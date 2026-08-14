import { NextResponse } from "next/server";
import {
  isHoneypotTriggered,
  validateAndNormalizeCotacao,
} from "@/lib/cotacao";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const CRM_TIMEOUT_MS = 10_000;

/** Best-effort in-memory limiter. Not a distributed protection. */
const recentHits = new Map<string, number[]>();

function json(status: number, body: unknown) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentHits.get(ip) ?? []).filter(
    (stamp) => now - stamp < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    recentHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentHits.set(ip, recent);
  return false;
}

function logForwardFailure(requestId: string, code: string, status?: number) {
  console.error("cotacao_forward_failed", { requestId, code, status });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json(400, { ok: false, error: "invalid_content_type" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  if (isHoneypotTriggered(body)) {
    return json(202, { ok: true });
  }

  if (isRateLimited(clientIp(request))) {
    return json(429, { ok: false, error: "rate_limited" });
  }

  const parsed = validateAndNormalizeCotacao(body);
  if (!parsed.success) {
    return json(400, { ok: false, error: parsed.code });
  }

  const endpoint = process.env.CRM_LEADS_ENDPOINT?.trim();
  const token = process.env.CRM_INGEST_TOKEN?.trim();
  if (!endpoint || !token) {
    logForwardFailure(parsed.data.requestId, "missing_crm_config");
    return json(503, { ok: false, error: "unavailable" });
  }

  let crmResponse: Response;
  try {
    crmResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const code =
      name === "TimeoutError" || name === "AbortError" ? "timeout" : "network";
    logForwardFailure(parsed.data.requestId, code);
    return json(503, { ok: false, error: "unavailable" });
  }

  if (crmResponse.ok) {
    return json(202, { ok: true });
  }

  logForwardFailure(parsed.data.requestId, "crm_error", crmResponse.status);
  return json(502, { ok: false, error: "unavailable" });
}
