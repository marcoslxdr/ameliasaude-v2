import type { ChatRequest } from "./chat";

export type PendingChatRequest = { body: ChatRequest; savedAt: number };
const maxAge = 24 * 60 * 60 * 1000;

export function isTerminalChatError(error: unknown): boolean {
  return error instanceof Error && ["session_closed", "session_expired"].includes(error.message);
}

/** A temporary outage must never silently create a second CRM conversation. */
export async function restoreChatSession<T>(token: string | null, poll: (token: string) => Promise<T>, start: () => Promise<T>): Promise<T> {
  return token ? poll(token) : start();
}

export function readPendingChatRequest(raw: string | null, token: string, now = Date.now()): PendingChatRequest | null {
  if (!raw || raw.length > 10_000) return null;
  try {
    const value = JSON.parse(raw) as PendingChatRequest;
    const body = value.body;
    if (!value || !Number.isFinite(value.savedAt) || now - value.savedAt > maxAge || value.savedAt > now || !body || body.token !== token || !["sales", "service"].includes(body.department) || !["message", "handoff"].includes(body.action) || typeof body.request_id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.request_id)) return null;
    if (body.action === "message" && (typeof body.input !== "string" || !body.input.trim() || body.input.length > 1000)) return null;
    return value;
  } catch { return null; }
}

/** A poll begun before a mutation cannot replace the mutation's newer history. */
export function canApplyChatPoll(startRevision: number, currentRevision: number, submitting: boolean): boolean {
  return !submitting && startRevision === currentRevision;
}
