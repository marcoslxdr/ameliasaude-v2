import { createHmac, randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isChatRequestSameOrigin, parseChatRequest, relayAmeliaChat } from "@/lib/chat";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" };
  const fail = (error: string, status: number) => NextResponse.json({ error }, { status, headers });
  // Next's dev server normalizes nextUrl.hostname to localhost, even when the
  // browser reached 127.0.0.1. The Host header retains the actual request host.
  if (!isChatRequestSameOrigin(request)) return fail("invalid_origin", 403);
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return fail("invalid_content_type", 415);
  if (Number(request.headers.get("content-length")) > 65_000) return fail("request_too_large", 413);
  let value: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 65_000) return fail("request_too_large", 413);
    value = JSON.parse(raw);
  } catch { return fail("invalid_json", 400); }
  const body = parseChatRequest(value);
  if (!body) return fail("invalid_request", 400);
  const secret = process.env.CRM_WEBCHAT_TOKEN;
  const current = request.cookies.get("amelia_chat_client")?.value;
  const client = current && /^[a-f0-9]{64}$/.test(current) ? current : randomBytes(32).toString("hex");
  const clientKey = secret ? createHmac("sha256", secret).update(client).digest("hex") : "unknown";
  const result = await relayAmeliaChat(body, { endpoint: process.env.CRM_WEBCHAT_FLOW_URL || process.env.CRM_WEBCHAT_URL, secret, clientKey });
  const response = NextResponse.json(result.payload, { status: result.status, headers });
  response.cookies.set("amelia_chat_client", client, { httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "strict", path: "/api/chat", maxAge: 24 * 60 * 60 });
  return response;
}
