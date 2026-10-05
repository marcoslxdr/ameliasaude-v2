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
