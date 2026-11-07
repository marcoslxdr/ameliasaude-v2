import { createHmac, randomBytes } from "node:crypto";
import { getVercelOidcToken } from "@vercel/oidc";
import { NextResponse, type NextRequest } from "next/server";
import { isChatRequestSameOrigin, parseChatRequest, relayAmeliaChat, type ChatResponse } from "@/lib/chat";

import { chatCookieName, chatCookieOptions, chatSessionExpiry, publicChatPayload, relayRequestWithCookie } from "@/lib/chat-cookie";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

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
  // Hash IP only on the server; the CRM never receives the address itself.
  const peer = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "local";
  const peerKey = secret ? createHmac("sha256", secret).update(peer.split(",")[0].trim()).digest("hex") : "unknown";
  const forwarded = relayRequestWithCookie(body, request.cookies.get(chatCookieName(body.department))?.value);
  // Trusted Sources authenticates this deployment to the configured CRM only.
  // Never trust a caller-supplied OIDC header or return this identity to the browser.
  let trustedOidcToken: string | undefined;
  let identityUnavailable = false;
  if (process.env.VERCEL === "1") {
    try { trustedOidcToken = await getVercelOidcToken(); }
    catch { identityUnavailable = true; }
  }
  const result = identityUnavailable ? { status: 503, payload: { error: "chat_unavailable" } } : await relayAmeliaChat(forwarded, { endpoint: process.env.CRM_WEBCHAT_FLOW_URL || process.env.CRM_WEBCHAT_URL, secret, clientKey, peerKey, trustedOidcToken });
  const alreadyExpiredLogout = body.action === "logout" && result.status === 410;
  const successful = result.status === 200 ? result.payload as ChatResponse : alreadyExpiredLogout ? { brand: "amelia" as const, department: body.department, messages: [], input: null, handoff: false, crmSynced: false, status: "closed" as const, read_only: true } : null;
  const response = NextResponse.json(successful ? publicChatPayload(successful) : result.payload, { status: alreadyExpiredLogout ? 200 : result.status, headers });
  const secure = request.nextUrl.protocol === "https:";
  if (body.action === "logout") {
    for (const name of ["amelia_chat_client", chatCookieName("sales"), chatCookieName("service")]) response.cookies.set(name, "", { ...chatCookieOptions(secure, new Date(0)), maxAge: 0 });
  } else if (successful?.token) {
    const expires = chatSessionExpiry(successful.session_expires_at);
    if (!expires) return fail("invalid_chat_response", 502);
    response.cookies.set(chatCookieName(body.department), successful.token, chatCookieOptions(secure, expires));
    // The backend owns absolute expiry. Never turn an old session into a fresh
    // sliding 24-hour browser credential by polling or reopening the widget.
    response.cookies.set("amelia_chat_client", client, chatCookieOptions(secure, expires));
  }
  return response;
}
