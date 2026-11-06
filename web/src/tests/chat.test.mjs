import test from "node:test";
import assert from "node:assert/strict";
import { chatFlowUrl, isChatRequestSameOrigin, parseChatRequest, relayAmeliaChat } from "../lib/chat.ts";

const body = { action: "start", department: "sales" };
const fixture = () => ({ brand: "amelia", department: "sales", token: "opaque-session", messages: [{ id: "greeting", text: "Olá" }], input: { kind: "text", placeholder: "Mensagem" }, handoff: false, crmSynced: false });
const options = { endpoint: "https://crm.example.com/api/agent/webchat/flow", secret: "test-server-secret", clientKey: "a".repeat(64) };

test("same-origin browser works when Next normalizes localhost, foreign origin is blocked", () => {
  const request = headers => new Request("http://localhost:3411/api/chat", { headers: { host: "127.0.0.1:3411", ...headers } });
  assert.equal(isChatRequestSameOrigin(request({ origin: "http://127.0.0.1:3411" })), true);
  assert.equal(isChatRequestSameOrigin(request({ origin: "https://evil.example" })), false);
  assert.equal(isChatRequestSameOrigin(request({ "sec-fetch-site": "cross-site" })), false);
});

test("explicit department is mandatory and message/session limits are enforced", () => {
  assert.equal(parseChatRequest({ action: "start" }), null);
  assert.equal(parseChatRequest({ ...body, department: "atendimento" }), null);
  assert.equal(parseChatRequest({ ...body, action: "message", input: "Oi" }), null);
  assert.equal(parseChatRequest({ ...body, action: "message", token: "x", input: "a".repeat(1001) }), null);
  assert.equal(parseChatRequest({ ...body, action: "poll", token: "x".repeat(60001) }), null);
  assert.deepEqual(parseChatRequest({ ...body, brand: "six", arbitrary: "hidden" }), body);
});

test("only fixed CRM flow paths are accepted without credentials, queries or redirects", () => {
  assert.equal(chatFlowUrl("https://crm.example.com/api/agent/webchat/sync"), options.endpoint);
  assert.equal(chatFlowUrl("http://crm.example.com/api/agent/webchat/flow"), null);
  assert.equal(chatFlowUrl("https://user:secret@crm.example.com/api/agent/webchat/flow"), null);
  assert.equal(chatFlowUrl(`${options.endpoint}?token=secret`), null);
  assert.equal(chatFlowUrl("https://crm.example.com/arbitrary"), null);
});

test("HTTP loopback is only accepted outside production", () => {
  const prior = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "development";
    assert.equal(chatFlowUrl("http://localhost:3410/api/agent/webchat/flow"), "http://localhost:3410/api/agent/webchat/flow");
    process.env.NODE_ENV = "production";
    assert.equal(chatFlowUrl("http://localhost:3410/api/agent/webchat/flow"), null);
    assert.equal(chatFlowUrl("http://127.0.0.1:3410/api/agent/webchat/flow"), null);
  } finally {
    if (prior === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = prior;
  }
});

test("server bridge fixes Amélia brand and hides credentials in the public response", async () => {
  const result = await relayAmeliaChat(body, { ...options, fetchImpl: async (url, request) => {
    assert.equal(url, options.endpoint);
    assert.equal(request.headers["x-webchat-brand"], "amelia");
    assert.equal(request.headers["x-webchat-token"], options.secret);
    assert.equal(request.redirect, "manual");
    assert.equal(JSON.parse(request.body).department, "sales");
    return Response.json({ ...fixture(), messages: [{ id: "greeting", text: "Olá", internalSecret: options.secret }], agentMessages: [{ id: "human", text: "Oi", internalSecret: options.secret }], internalSecret: options.secret });
  } });
  assert.equal(result.status, 200);
  assert.equal(JSON.stringify(result.payload).includes(options.secret), false);
});

test("cross-brand and cross-department responses are rejected", async () => {
  for (const patch of [{ brand: "six" }, { department: "service" }]) {
    const result = await relayAmeliaChat(body, { ...options, fetchImpl: async () => Response.json({ ...fixture(), ...patch }) });
    assert.equal(result.status, 502);
  }
});

test("unavailable CRM is an error and never a simulated successful chat", async () => {
  const result = await relayAmeliaChat(body, { ...options, fetchImpl: async () => { throw new Error("private backend info"); } });
  assert.deepEqual(result, { status: 503, payload: { error: "chat_unavailable" } });
  assert.equal((await relayAmeliaChat(body, { clientKey: options.clientKey })).status, 503);
});

test("closed and invalid sessions retain terminal statuses without becoming network errors", async () => {
  for (const [status, error] of [[410, "session_closed"], [400, "session_expired"], [409, "session_expired"], [429, "rate_limited"]]) {
    const result = await relayAmeliaChat({ ...body, action: "poll", token: "x" }, { ...options, fetchImpl: async () => Response.json({ error: "private detail" }, { status }) });
    assert.deepEqual(result, { status, payload: { error } });
  }
});

test("unsafe documents and malformed bot/agent content are blocked", async () => {
  for (const patch of [{ messages: [{ id: "x", text: "x", document: { url: "javascript:alert(1)", fileName: "x" } }] }, { agentMessages: [{ id: "x", text: 123 }] }, { messages: [{ id: "x", text: "x", quickReplies: [{ label: "x", value: {} }] }] }]) {
    assert.equal((await relayAmeliaChat(body, { ...options, fetchImpl: async () => Response.json({ ...fixture(), ...patch }) })).status, 502);
  }
});

test("human messages preserve identity for browser deduplication", async () => {
  const result = await relayAmeliaChat({ ...body, action: "poll", token: "x" }, { ...options, fetchImpl: async () => Response.json({ ...fixture(), handoff: true, agentMessages: [{ id: "human-1", text: "Resposta humana" }] }) });
  assert.equal(result.payload.handoff, true);
  assert.deepEqual(result.payload.agentMessages, [{ id: "human-1", text: "Resposta humana" }]);
});

test("CRM preview preserves request id, peer hash and unwraps the canonical API response", async () => {
  const id = "11111111-1111-4111-8111-111111111111";
  const parsed = parseChatRequest({ action: "message", department: "sales", input: "Qual a rede?", token: "b".repeat(64), request_id: id });
  assert.equal(parsed.request_id, id);
  const result = await relayAmeliaChat(parsed, { ...options, endpoint: "https://crm.example.com/api/v1/ai/webchat-preview", peerKey: "c".repeat(64), fetchImpl: async (_url, request) => {
    assert.equal(JSON.parse(request.body).request_id, id);
    assert.equal(request.headers["x-webchat-peer"], "c".repeat(64));
    return Response.json({ data: fixture() });
  } });
  assert.equal(result.status, 200);
  assert.equal(result.payload.messages[0].text, "Olá");
});

test("busy preview keeps the conversation recoverable", async () => {
  const result = await relayAmeliaChat(body, { ...options, endpoint: "https://crm.example.com/api/v1/ai/webchat-preview", fetchImpl: async () => Response.json({}, { status: 409 }) });
  assert.equal(result.payload.error, "chat_busy");
});

test("registration requires name, phone, email and explicit consent", () => {
  const registration = { action: "register", department: "sales", token: "x", request_id: "11111111-1111-4111-8111-111111111111", contact: { name: "Teste", phone: "+442079460000", email: "teste@example.com", consent: true } };
  assert.ok(parseChatRequest(registration));
  for (const field of ["name", "phone", "email", "consent"]) {
    assert.equal(parseChatRequest({ ...registration, contact: { ...registration.contact, [field]: undefined } }), null);
  }
});

const { captureChatAttribution, sanitizeChatAttribution } = await import("../lib/chat.ts");
const { canApplyChatPoll, isTerminalChatError, readPendingChatRequest, restoreChatSession } = await import("../lib/chat-recovery.ts");

test("attribution retains approved campaign fields but strips query, fragment and referral path", () => {
  const attribution = captureChatAttribution("https://www.ameliasaude.com.br/planos?utm_source=instagram&utm_campaign=carioca-novembro&email=private@example.com&gclid=private#secret", "https://search.example.com/find?email=private@example.com");
  assert.deepEqual(attribution, { page_path: "/planos", referrer_origin: "https://search.example.com", utm_source: "instagram", utm_campaign: "carioca-novembro" });
  assert.deepEqual(parseChatRequest({ ...body, attribution, private: "hidden" }).attribution, attribution);
  assert.equal(parseChatRequest({ ...body, action: "poll", token: "x", attribution }).attribution, undefined);
});

test("attribution rejects credentials, email, phone and arbitrary query fields", () => {
  assert.equal(sanitizeChatAttribution({ page_path: "/1234567890", referrer_origin: "https://user:password@example.com", utm_source: "user@example.com", utm_medium: "21999999999", email: "secret@example.com", gclid: "private" }), undefined);
  assert.equal(sanitizeChatAttribution({ page_path: "//evil.example" }), undefined);
  assert.equal(sanitizeChatAttribution({ page_path: "/?email=x", utm_campaign: "a".repeat(101) }), undefined);
});

test("guided qualification is bounded, optional, and consistent with lives", () => {
  const request = { action: "message", department: "sales", token: "x", input: "Quero uma cotação" };
  const qualification = { city: "Rio de Janeiro", lives: 2, ages: [28, 34], modality: "empresarial" };
  assert.deepEqual(parseChatRequest({ ...request, qualification }).qualification, qualification);
  assert.deepEqual(parseChatRequest({ ...request, qualification: { city: "Rio" } }).qualification, { city: "Rio" });
  for (const invalid of [{ lives: 0 }, { lives: 1001 }, { ages: [-1] }, { ages: [121] }, { lives: 2, ages: [30] }, { city: "R" }, { modality: "individual" }, { ages: [2.3] }, {}]) {
    assert.equal(parseChatRequest({ ...request, qualification: invalid }), null);
  }
  assert.equal(parseChatRequest({ ...body, qualification }), null);
});

test("human handoff uses its own action and preserves the request identity", () => {
  const request = { action: "handoff", department: "sales", token: "x", request_id: "11111111-1111-4111-8111-111111111111" };
  assert.deepEqual(parseChatRequest(request), request);
});

test("a transient restoration outage never starts a second conversation", async () => {
  let starts = 0;
  const start = async () => { starts++; return fixture(); };
  await assert.rejects(restoreChatSession("existing-token", async () => { throw new Error("chat_unavailable"); }, start), /chat_unavailable/);
  assert.equal(starts, 0);
  const restored = await restoreChatSession("existing-token", async token => ({ ...fixture(), token }), start);
  assert.equal(restored.token, "existing-token");
  await restoreChatSession(null, async () => { throw new Error("unexpected"); }, start);
  assert.equal(starts, 1);
});

test("expired sessions demand an explicit reset; busy and network failures remain retryable", () => {
  for (const code of ["session_closed", "session_expired"]) assert.equal(isTerminalChatError(new Error(code)), true);
  for (const code of ["chat_busy", "rate_limited", "chat_unavailable"]) assert.equal(isTerminalChatError(new Error(code)), false);
});

test("an old poll cannot erase a message response or overwrite a reset", () => {
  assert.equal(canApplyChatPoll(3, 3, false), true);
  assert.equal(canApplyChatPoll(3, 4, false), false);
  assert.equal(canApplyChatPoll(3, 3, true), false);
});

test("reload retry reuses the exact request ID and rejects stale or foreign pending sessions", () => {
  const now = Date.now();
  const pending = { savedAt: now, body: { action: "message", department: "sales", token: "tab-token", input: "Quero cotação", request_id: "11111111-1111-4111-8111-111111111111", qualification: { city: "Rio" } } };
  assert.deepEqual(readPendingChatRequest(JSON.stringify(pending), "tab-token", now), pending);
  assert.equal(readPendingChatRequest(JSON.stringify(pending), "another-token", now), null);
  assert.equal(readPendingChatRequest(JSON.stringify(pending), "tab-token", now + 86_400_001), null);
  assert.equal(readPendingChatRequest("not-json", "tab-token", now), null);
});
