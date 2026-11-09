import { parseChatRequest, type ChatRequest, type Department } from "./chat.ts";

export type PendingChatRequest = { body: ChatRequest; savedAt: number; version?: 2; sessionRef?: string; expiresAt?: string };
export type PendingChatScope = { department: Department; sessionRef?: string; expiresAt?: string; conversationId?: string };

/** Only an unconfirmed write from this exact HttpOnly session may be restored. */
export function restorePendingChatRequest(raw: string | null, scope: PendingChatScope, now = Date.now()): PendingChatRequest | null {
  const saved = readPendingChatRequest(raw, null, now);
  if (!saved || saved.version !== 2 || !scope.sessionRef || !/^[a-f0-9]{64}$/.test(scope.sessionRef) || saved.sessionRef !== scope.sessionRef || saved.expiresAt !== scope.expiresAt || !saved.expiresAt || !Number.isFinite(Date.parse(saved.expiresAt)) || Date.parse(saved.expiresAt) <= now || saved.body.department !== scope.department || saved.body.token || (saved.body.conversation_id && saved.body.conversation_id !== scope.conversationId)) return null;
  const body = parseChatRequest(saved.body);
  return body ? { version: 2, body, savedAt: saved.savedAt, sessionRef: saved.sessionRef, expiresAt: saved.expiresAt } : null;
}
const maxAge = 24 * 60 * 60 * 1000;

export function isTerminalChatError(error: unknown): boolean {
  return error instanceof Error && ["session_closed", "session_expired"].includes(error.message);
}

/** A temporary outage must never silently create a second CRM conversation. */
export async function restoreChatSession<T>(token: string | null, poll: (token: string) => Promise<T>, start: () => Promise<T>): Promise<T> {
  return token ? poll(token) : start();
}

export function readPendingChatRequest(raw: string | null, token: string | null, now = Date.now()): PendingChatRequest | null {
  if (!raw || raw.length > 10_000) return null;
  try {
    const value = JSON.parse(raw) as PendingChatRequest;
    const body = value.body;
    if (value.expiresAt && (!Number.isFinite(Date.parse(value.expiresAt)) || Date.parse(value.expiresAt) <= now)) return null;
    if (!value || !Number.isFinite(value.savedAt) || now - value.savedAt > maxAge || value.savedAt > now || !body || (token !== null && body.token !== token) || !["sales", "service"].includes(body.department) || !["message", "handoff", "register", "request_review"].includes(body.action) || typeof body.request_id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.request_id)) return null;
    if (body.action === "message" && (typeof body.input !== "string" || !body.input.trim() || body.input.length > 1000)) return null;
    if (["register", "request_review"].includes(body.action)) {
      const contact = body.contact;
      if (!contact || typeof contact.name !== "string" || contact.name.trim().length < 2 || contact.name.length > 150 || typeof contact.phone !== "string" || !/^[+()\d\s-]{10,25}$/.test(contact.phone) || typeof contact.email !== "string" || contact.email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email) || contact.consent !== true) return null;
    }
    if (body.conversation_id !== undefined && (typeof body.conversation_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.conversation_id))) return null;
    return value;
  } catch { return null; }
}

/** A poll begun before a mutation cannot replace the mutation's newer history. */
export function canApplyChatPoll(startRevision: number, currentRevision: number, submitting: boolean): boolean {
  return !submitting && startRevision === currentRevision;
}

/** The retry identity belongs to the exact normalized registration payload. */
export function registrationAttempt(previous: ChatRequest | null, body: Omit<ChatRequest, "request_id">, newId: () => string): ChatRequest {
  const same = previous && JSON.stringify({ ...previous, request_id: undefined }) === JSON.stringify(body);
  return same ? previous : { ...body, request_id: newId() };
}

/** A latest-page poll cannot discard older pages the visitor explicitly loaded. */
export function mergeChatMessages<T extends { id: string }>(current: T[], page: T[], earlier = false): T[] {
  const ordered = earlier ? [...page, ...current] : [...current, ...page];
  const merged = new Map<string, T>();
  for (const message of ordered) merged.set(message.id, { ...merged.get(message.id), ...message });
  return [...merged.values()];
}

/** Elapsed queue time only; never an estimated time until a person responds. */
export function chatWaitingTime(since: string | null | undefined, now: number): string | null {
  if (!since || !Number.isFinite(Date.parse(since)) || !Number.isFinite(now) || now <= 0) return null;
  const minutes = Math.floor(Math.max(0, now - Date.parse(since)) / 60_000);
  if (minutes < 1) return "há menos de 1 minuto";
  if (minutes < 60) return `há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  const hours = Math.floor(minutes / 60), remainder = minutes % 60;
  return `há ${hours} ${hours === 1 ? "hora" : "horas"}${remainder ? ` e ${remainder} min` : ""}`;
}

/** Serialize writes after an already-running poll: both share the server session lock. */
export async function afterChatPoll<T>(poll: Promise<unknown> | null, send: () => Promise<T>): Promise<T> {
  if (poll) { try { await poll; } catch { /* A failed read must not discard the pending write. */ } }
  return send();
}
