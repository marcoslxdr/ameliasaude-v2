import type { ChatRequest, ChatResponse, Department } from "./chat";

export const chatCookieName = (department: Department) => `amelia_chat_session_${department}`;
export const chatCookieOptions = (secure: boolean, expires: Date) => ({ httpOnly: true, secure, sameSite: "strict" as const, path: "/api/chat", expires });
export function chatSessionExpiry(value: unknown, now = Date.now()): Date | null {
  if (typeof value !== "string") return null;
  const expires = Date.parse(value);
  if (!Number.isFinite(expires) || expires <= now || expires > now + 24 * 60 * 60 * 1000 + 5000) return null;
  return new Date(expires);
}
export function relayRequestWithCookie(body: ChatRequest, cookieToken?: string): ChatRequest {
  const valid = cookieToken && /^[a-f0-9]{64}$/.test(cookieToken) ? cookieToken : undefined;
  const { token: legacy, ...rest } = body;
  if (["start", "reset"].includes(body.action)) return rest;
  // A browser cannot override a live HttpOnly session through JSON. The only
  // legacy ingress is an explicit recovery attempt without a session cookie.
  const token = valid ?? (body.action === "recover" ? legacy : undefined);
  return { ...rest, ...(token ? { token } : {}) };
}
export function publicChatPayload(payload: ChatResponse): Omit<ChatResponse, "token"> {
  const { token: _token, ...publicPayload } = payload;
  const safeId = (id: string) => _token ? id.replaceAll(_token, "session") : id;
  return { ...publicPayload,
    messages: publicPayload.messages.map(message => ({ ...message, id: safeId(message.id) })),
    ...(publicPayload.history ? { history: publicPayload.history.map(message=>({...message,id:safeId(message.id)})) } : {}),
    ...(publicPayload.agentMessages ? { agentMessages: publicPayload.agentMessages.map(message=>({...message,id:safeId(message.id)})) } : {}),
  };
}
