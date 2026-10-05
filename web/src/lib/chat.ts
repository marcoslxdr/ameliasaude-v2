export type Department = "sales" | "service";
export type ChatRequest = { action: "start" | "reset" | "message" | "poll"; department: Department; token?: string; input?: string };
export type ChatOption = { label: string; value: string };
export type ChatMessage = { id: string; text: string; quickReplies?: ChatOption[]; list?: { title: string; options: ChatOption[] }; document?: { url: string; fileName: string } };
export type ChatResponse = { token: string; messages: ChatMessage[]; input: { kind: string; placeholder: string; hint?: string } | null; handoff: boolean; crmSynced: boolean; brand: "amelia"; department: Department; agentMessages?: { id: string; text: string }[] };

export function isChatRequestSameOrigin(request: Request): boolean {
  const url = new URL(request.url);
  const requestOrigin = `${url.protocol}//${request.headers.get("host") ?? url.host}`;
  const origin = request.headers.get("origin");
  return (!origin || origin === requestOrigin) && request.headers.get("sec-fetch-site") !== "cross-site";
}

export function parseChatRequest(body: unknown): ChatRequest | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const value = body as Record<string, unknown>;
  if (!["start", "reset", "message", "poll"].includes(String(value.action)) || !["sales", "service"].includes(String(value.department))) return null;
  if (["message", "poll"].includes(String(value.action)) && (typeof value.token !== "string" || !value.token || value.token.length > 60_000)) return null;
  if (value.action === "message" && (typeof value.input !== "string" || !value.input.trim() || value.input.length > 1000)) return null;
  return { action: value.action as ChatRequest["action"], department: value.department as Department,
    ...(["message", "poll"].includes(String(value.action)) ? { token: value.token as string } : {}),
    ...(value.action === "message" ? { input: (value.input as string).trim() } : {}) };
}

export function chatFlowUrl(value?: string): string | null {
  try {
    const url = new URL(value ?? "");
    // HTTP localhost is available only for integrated development tests.
    const local = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if ((url.protocol !== "https:" && !(local && url.protocol === "http:")) || url.username || url.password || url.search || url.hash) return null;
    if (url.pathname.endsWith("/api/agent/webchat/sync")) url.pathname = url.pathname.replace(/\/sync$/, "/flow");
    return url.pathname.endsWith("/api/agent/webchat/flow") ? url.toString() : null;
  } catch { return null; }
}

function safeOptions(value: unknown): boolean {
  return Array.isArray(value) && value.length <= 30 && value.every(item => item && typeof item.label === "string" && item.label.length <= 200 && typeof item.value === "string" && item.value.length <= 1000);
}

function safeMessage(message: ChatMessage): boolean {
  if (!message || typeof message.id !== "string" || typeof message.text !== "string" || message.text.length > 10_000) return false;
  if (message.quickReplies && !safeOptions(message.quickReplies)) return false;
  if (message.list && (!safeOptions(message.list.options) || typeof message.list.title !== "string")) return false;
  if (message.document) {
    try {
      const url = new URL(message.document.url);
      if (url.protocol !== "https:" || url.username || url.password || typeof message.document.fileName !== "string") return false;
    } catch { return false; }
  }
  return true;
}

function publicMessage(message: ChatMessage): ChatMessage {
  return { id: message.id, text: message.text,
    ...(message.quickReplies ? { quickReplies: message.quickReplies.map(({ label, value }) => ({ label, value })) } : {}),
    ...(message.list ? { list: { title: message.list.title, options: message.list.options.map(({ label, value }) => ({ label, value })) } } : {}),
    ...(message.document ? { document: { url: message.document.url, fileName: message.document.fileName } } : {}) };
}

export async function relayAmeliaChat(body: ChatRequest, options: { endpoint?: string; secret?: string; clientKey: string; fetchImpl?: typeof fetch }) {
  const endpoint = chatFlowUrl(options.endpoint);
  if (!endpoint || !options.secret) return { status: 503, payload: { error: "chat_unavailable" } };
  try {
    const response = await (options.fetchImpl ?? fetch)(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "x-webchat-brand": "amelia", "x-webchat-token": options.secret, "x-webchat-client": options.clientKey }, body: JSON.stringify(body), cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(25_000) });
    if (!response.ok) return { status: [400, 409, 410, 429].includes(response.status) ? response.status : 503, payload: { error: response.status === 410 ? "session_closed" : response.status === 429 ? "rate_limited" : [400, 409].includes(response.status) ? "session_expired" : "chat_unavailable" } };
    const data = await response.json() as ChatResponse;
    if (data.brand !== "amelia" || data.department !== body.department || typeof data.token !== "string" || !data.token || data.token.length > 60_000 || !Array.isArray(data.messages) || data.messages.length > 20 || !data.messages.every(safeMessage) || (data.input && (typeof data.input.kind !== "string" || typeof data.input.placeholder !== "string")) || (data.agentMessages && (!Array.isArray(data.agentMessages) || data.agentMessages.length > 50 || data.agentMessages.some(message => !message || typeof message.id !== "string" || typeof message.text !== "string" || message.text.length > 10_000)))) return { status: 502, payload: { error: "invalid_chat_response" } };
    // Only explicitly reviewed fields can cross the public boundary.
    return { status: 200, payload: { token: data.token, brand: "amelia", department: body.department, messages: data.messages.map(publicMessage), input: data.input ? { kind: data.input.kind, placeholder: data.input.placeholder, ...(typeof data.input.hint === "string" ? { hint: data.input.hint } : {}) } : null, handoff: data.handoff === true, crmSynced: data.crmSynced === true, agentMessages: (data.agentMessages ?? []).map(({ id, text }) => ({ id, text })) } };
  } catch { return { status: 503, payload: { error: "chat_unavailable" } }; }
}
