export type Department = "sales" | "service";
export type ChatAttribution = { page_path?: string; referrer_origin?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string };
export type ChatQualification = { city?: string; lives?: number; ages?: number[]; modality?: "empresarial" | "adesao" | "indefinido" };
export type ChatRequest = { action: "start" | "reset" | "message" | "poll" | "register" | "handoff"; department: Department; token?: string; input?: string; request_id?: string; attribution?: ChatAttribution; qualification?: ChatQualification; contact?: { name: string; phone: string; email: string; consent: true } };
export type ChatOption = { label: string; value: string };
export type ChatMessage = { id: string; text: string; quickReplies?: ChatOption[]; list?: { title: string; options: ChatOption[] }; document?: { url: string; fileName: string } };
export type ChatResponse = { token: string; messages: ChatMessage[]; input: { kind: string; placeholder: string; hint?: string } | null; handoff: boolean; crmSynced: boolean; brand: "amelia"; department: Department; agentMessages?: { id: string; text: string }[]; history?: { id: string; text: string; role: "bot" | "user" | "agent" }[]; registered?: boolean };

const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** Attribution deliberately excludes query strings, click IDs and visitor identifiers. */
export function sanitizeChatAttribution(value: unknown): ChatAttribution | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  const result: ChatAttribution = {};
  if (typeof input.page_path === "string" && /^\/(?!\/)[a-zA-Z0-9/_.-]{0,199}$/.test(input.page_path) && !/\d{7,}/.test(input.page_path)) result.page_path = input.page_path;
  if (typeof input.referrer_origin === "string") {
    try {
      const url = new URL(input.referrer_origin);
      if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password && url.origin.length <= 200) result.referrer_origin = url.origin;
    } catch { /* optional attribution must not block a conversation */ }
  }
  for (const key of campaignKeys) {
    const field = input[key];
    if (typeof field === "string" && /^[\p{L}\p{N} _.-]{1,100}$/u.test(field) && !/\d{7,}/.test(field)) result[key] = field;
  }
  return Object.keys(result).length ? result : undefined;
}

export function captureChatAttribution(href: string, referrer: string): ChatAttribution | undefined {
  try {
    const url = new URL(href);
    return sanitizeChatAttribution({ page_path: url.pathname, referrer_origin: referrer, ...Object.fromEntries(campaignKeys.map(key => [key, url.searchParams.get(key)])) });
  } catch { return undefined; }
}

export function parseChatQualification(value: unknown): ChatQualification | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const result: ChatQualification = {};
  if (input.city !== undefined) {
    if (typeof input.city !== "string" || input.city.trim().length < 2 || input.city.length > 100) return null;
    result.city = input.city.trim();
  }
  if (input.lives !== undefined) {
    if (!Number.isInteger(input.lives) || Number(input.lives) < 1 || Number(input.lives) > 1000) return null;
    result.lives = Number(input.lives);
  }
  if (input.ages !== undefined) {
    if (!Array.isArray(input.ages) || input.ages.length < 1 || input.ages.length > 1000 || input.ages.some(age => !Number.isInteger(age) || age < 0 || age > 120)) return null;
    result.ages = input.ages as number[];
  }
  if (input.modality !== undefined) {
    if (!["empresarial", "adesao", "indefinido"].includes(String(input.modality))) return null;
    result.modality = input.modality as ChatQualification["modality"];
  }
  if (result.lives && result.ages && result.ages.length !== result.lives) return null;
  return Object.keys(result).length ? result : null;
}

export function isChatRequestSameOrigin(request: Request): boolean {
  const url = new URL(request.url);
  const requestOrigin = `${url.protocol}//${request.headers.get("host") ?? url.host}`;
  const origin = request.headers.get("origin");
  return (!origin || origin === requestOrigin) && request.headers.get("sec-fetch-site") !== "cross-site";
}

export function parseChatRequest(body: unknown): ChatRequest | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const value = body as Record<string, unknown>;
  if (!["start", "reset", "message", "poll", "register", "handoff"].includes(String(value.action)) || !["sales", "service"].includes(String(value.department))) return null;
  if (["message", "poll", "register", "handoff"].includes(String(value.action)) && (typeof value.token !== "string" || !value.token || value.token.length > 60_000)) return null;
  if (value.action === "message" && (typeof value.input !== "string" || !value.input.trim() || value.input.length > 1000)) return null;
  if (value.request_id !== undefined && (typeof value.request_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.request_id))) return null;
  let contact: ChatRequest["contact"];
  if (value.action === "register") {
    const c = value.contact as Record<string, unknown> | undefined;
    if (!c || typeof c.name !== "string" || c.name.trim().length < 2 || c.name.length > 150 || typeof c.phone !== "string" || !/^[+()\d\s-]{10,25}$/.test(c.phone) || typeof c.email !== "string" || c.email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email) || c.consent !== true || !value.request_id) return null;
    contact = {name:c.name.trim(),phone:c.phone.trim(),email:c.email.trim(),consent:true};
  }
  const qualification = value.qualification === undefined ? undefined : value.action === "message" ? parseChatQualification(value.qualification) : null;
  if (qualification === null) return null;
  const attribution = ["start", "reset", "register"].includes(String(value.action)) ? sanitizeChatAttribution(value.attribution) : undefined;
  return { ...(qualification ? {qualification} : {}), ...(attribution ? {attribution} : {}), ...(contact ? {contact} : {}), ...(value.request_id ? { request_id: value.request_id as string } : {}), action: value.action as ChatRequest["action"], department: value.department as Department,
    ...(["message", "poll", "register", "handoff"].includes(String(value.action)) ? { token: value.token as string } : {}),
    ...(value.action === "message" ? { input: (value.input as string).trim() } : {}) };
}

export function chatFlowUrl(value?: string): string | null {
  try {
    const url = new URL(value ?? "");
    // HTTP localhost is available only for integrated development tests.
    const local = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if ((url.protocol !== "https:" && !(local && url.protocol === "http:")) || url.username || url.password || url.search || url.hash) return null;
    if (url.pathname.endsWith("/api/agent/webchat/sync")) url.pathname = url.pathname.replace(/\/sync$/, "/flow");
    return ["/api/agent/webchat/flow", "/api/v1/ai/webchat-preview"].includes(url.pathname) ? url.toString() : null;
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

export async function relayAmeliaChat(body: ChatRequest, options: { endpoint?: string; secret?: string; clientKey: string; peerKey?: string; fetchImpl?: typeof fetch }) {
  const endpoint = chatFlowUrl(options.endpoint);
  if (!endpoint || !options.secret) return { status: 503, payload: { error: "chat_unavailable" } };
  try {
    const response = await (options.fetchImpl ?? fetch)(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "x-webchat-brand": "amelia", "x-webchat-token": options.secret, "x-webchat-client": options.clientKey, ...(options.peerKey ? { "x-webchat-peer": options.peerKey } : {}) }, body: JSON.stringify(body), cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(90_000) });
    if (response.status === 409 && endpoint.endsWith("/api/v1/ai/webchat-preview")) return { status: 409, payload: { error: "chat_busy" } };
    if (!response.ok) return { status: [400, 409, 410, 429].includes(response.status) ? response.status : 503, payload: { error: response.status === 410 ? "session_closed" : response.status === 429 ? "rate_limited" : response.status === 400 && body.action === "register" ? "invalid_contact" : [400, 409].includes(response.status) ? "session_expired" : "chat_unavailable" } };
    const decoded = await response.json();
    const data = (endpoint.endsWith("/api/v1/ai/webchat-preview") ? decoded.data : decoded) as ChatResponse;
    if (!data) return { status: 502, payload: { error: "invalid_chat_response" } };
    if (data.brand !== "amelia" || data.department !== body.department || typeof data.token !== "string" || !data.token || data.token.length > 60_000 || !Array.isArray(data.messages) || data.messages.length > 20 || !data.messages.every(safeMessage) || (data.input && (typeof data.input.kind !== "string" || typeof data.input.placeholder !== "string")) || (data.agentMessages && (!Array.isArray(data.agentMessages) || data.agentMessages.length > 50 || data.agentMessages.some(message => !message || typeof message.id !== "string" || typeof message.text !== "string" || message.text.length > 10_000)))) return { status: 502, payload: { error: "invalid_chat_response" } };
    if (data.history && (!Array.isArray(data.history) || data.history.length > 60 || data.history.some(m => !m || typeof m.id !== "string" || typeof m.text !== "string" || m.text.length > 10000 || !["bot","user","agent"].includes(m.role)))) return {status:502,payload:{error:"invalid_chat_response"}};
    // Only explicitly reviewed fields can cross the public boundary.
    return { status: 200, payload: { token: data.token, ...(data.history ? {history:data.history.map(({id,text,role})=>({id,text,role}))} : {}), registered:data.registered === true, brand: "amelia", department: body.department, messages: data.messages.map(publicMessage), input: data.input ? { kind: data.input.kind, placeholder: data.input.placeholder, ...(typeof data.input.hint === "string" ? { hint: data.input.hint } : {}) } : null, handoff: data.handoff === true, crmSynced: data.crmSynced === true, agentMessages: (data.agentMessages ?? []).map(({ id, text }) => ({ id, text })) } };
  } catch { return { status: 503, payload: { error: "chat_unavailable" } }; }
}
