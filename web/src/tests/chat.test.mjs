import test from "node:test";
import assert from "node:assert/strict";
import { chatFlowUrl, isChatRequestSameOrigin, parseChatRequest, relayAmeliaChat } from "../lib/chat.ts";

const body = { action: "start", department: "sales" };
const fixture = () => ({ brand: "amelia", department: "sales", token: "a".repeat(64), messages: [{ id: "greeting", text: "Olá" }], input: { kind: "text", placeholder: "Mensagem" }, handoff: false, crmSynced: false });
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
  assert.equal(parseChatRequest({ ...body, action: "message", token: "a".repeat(64), input: "a".repeat(1001) }), null);
  assert.equal(parseChatRequest({ ...body, action: "poll", token: "a".repeat(64).repeat(60001) }), null);
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
  for (const [status, error] of [[410, "session_closed"], [400, "session_expired"], [409, "request_conflict"], [429, "rate_limited"]]) {
    const result = await relayAmeliaChat({ ...body, action: "poll", token: "a".repeat(64) }, { ...options, fetchImpl: async () => Response.json({ error: {code:"invalid_request",message:error} }, { status }) });
    assert.deepEqual(result, { status, payload: { error } });
  }
});

test("unsafe documents and malformed bot/agent content are blocked", async () => {
  for (const patch of [{ messages: [{ id: "x", text: "x", document: { url: "javascript:alert(1)", fileName: "x" } }] }, { agentMessages: [{ id: "x", text: 123 }] }, { messages: [{ id: "x", text: "x", quickReplies: [{ label: "x", value: {} }] }] }]) {
    assert.equal((await relayAmeliaChat(body, { ...options, fetchImpl: async () => Response.json({ ...fixture(), ...patch }) })).status, 502);
  }
});

test("human messages preserve identity for browser deduplication", async () => {
  const result = await relayAmeliaChat({ ...body, action: "poll", token: "a".repeat(64) }, { ...options, fetchImpl: async () => Response.json({ ...fixture(), handoff: true, agentMessages: [{ id: "human-1", text: "Resposta humana" }] }) });
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
  const registration = { action: "register", department: "sales", token: "a".repeat(64), request_id: "11111111-1111-4111-8111-111111111111", contact: { name: "Teste", phone: "+442079460000", email: "teste@example.com", consent: true } };
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
  assert.equal(parseChatRequest({ ...body, action: "poll", token: "a".repeat(64), attribution }).attribution, undefined);
});

test("attribution rejects credentials, email, phone and arbitrary query fields", () => {
  assert.equal(sanitizeChatAttribution({ page_path: "/1234567890", referrer_origin: "https://user:password@example.com", utm_source: "user@example.com", utm_medium: "21999999999", email: "secret@example.com", gclid: "private" }), undefined);
  assert.equal(sanitizeChatAttribution({ page_path: "//evil.example" }), undefined);
  assert.equal(sanitizeChatAttribution({ page_path: "/?email=x", utm_campaign: "a".repeat(101) }), undefined);
});

test("guided qualification is bounded, optional, and consistent with lives", () => {
  const request = { action: "message", department: "sales", token: "a".repeat(64), input: "Quero uma cotação", request_id: "11111111-1111-4111-8111-111111111111" };
  const qualification = { city: "Rio de Janeiro", lives: 2, ages: [28, 34], modality: "empresarial" };
  assert.deepEqual(parseChatRequest({ ...request, qualification }).qualification, qualification);
  assert.deepEqual(parseChatRequest({ ...request, qualification: { city: "Rio" } }).qualification, { city: "Rio" });
  for (const invalid of [{ lives: 0 }, { lives: 1001 }, { ages: [-1] }, { ages: [121] }, { lives: 2, ages: [30] }, { city: "R" }, { modality: "individual" }, { ages: [2.3] }, {}]) {
    assert.equal(parseChatRequest({ ...request, qualification: invalid }), null);
  }
  assert.equal(parseChatRequest({ ...body, qualification }), null);
});

test("human handoff uses its own action and preserves the request identity", () => {
  const request = { action: "handoff", department: "sales", token: "a".repeat(64), request_id: "11111111-1111-4111-8111-111111111111" };
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

const { registrationAttempt } = await import("../lib/chat-recovery.ts");
const { chatCookieName, chatCookieOptions, chatSessionExpiry, relayRequestWithCookie, publicChatPayload } = await import("../lib/chat-cookie.ts");
const id1 = "11111111-1111-4111-8111-111111111111";
const id2 = "22222222-2222-4222-8222-222222222222";

test("registration retry preserves exact payload and UUID; edited fields start another request", () => {
  const base = {action:"register",department:"sales",contact:{name:"Teste",phone:"+442079460000",email:"teste@example.com",consent:true}};
  const first = registrationAttempt(null,base,()=>id1);
  const retry = registrationAttempt(first,base,()=>{throw new Error("must reuse UUID");});
  assert.deepEqual(retry,first);
  const edited = registrationAttempt(first,{...base,contact:{...base.contact,email:"outro@example.com"}},()=>id2);
  assert.equal(edited.request_id,id2);
  assert.equal(first.contact.email,"teste@example.com");
  assert.equal(registrationAttempt(first,{...base,action:"request_review"},()=>id2).request_id,id2);
});

test("modern requests rely on HttpOnly session and legacy migration cannot override it", () => {
  const cookie = "c".repeat(64), legacy="b".repeat(64);
  assert.equal(parseChatRequest({action:"poll",department:"sales"}).token,undefined);
  assert.equal(relayRequestWithCookie({action:"poll",department:"sales",token:legacy},cookie).token,cookie);
  assert.equal(relayRequestWithCookie({action:"message",department:"sales",input:"Oi",request_id:id1,token:legacy}).token,undefined);
  assert.equal(relayRequestWithCookie({action:"recover",department:"sales",token:legacy}).token,legacy);
  assert.equal(relayRequestWithCookie({action:"reset",department:"sales",token:legacy},cookie).token,undefined);
});

test("cookies are secure HttpOnly, department-scoped, and expire at the fixed backend timestamp", () => {
  const now=Date.now(), expiration=new Date(now+3600000).toISOString();
  assert.equal(chatCookieName("sales"),"amelia_chat_session_sales");
  assert.deepEqual(chatCookieOptions(true,chatSessionExpiry(expiration,now)),{httpOnly:true,secure:true,sameSite:"strict",path:"/api/chat",expires:new Date(expiration)});
  assert.equal(chatSessionExpiry(expiration,now+1800000).toISOString(),expiration);
  assert.equal(chatSessionExpiry(expiration,now+3600001),null);
  assert.equal(chatSessionExpiry(new Date(now+86410000).toISOString(),now),null);
  assert.equal(chatSessionExpiry("invalid",now),null);
});

test("public response removes backend token including old welcome IDs", () => {
  const token="d".repeat(64);
  const data={...fixture(),token,messages:[{id:`${token}:welcome`,text:"Olá"}]};
  const response=publicChatPayload(data);
  assert.equal("token" in response,false);
  assert.equal(JSON.stringify(response).includes(token),false);
  assert.equal(response.messages[0].id,"session:welcome");
  assert.equal(data.token,token);
});

test("OTP recovery requires email plus phone and a six-digit code", () => {
  const request={action:"email_code",department:"sales",email:"TESTE@example.com",phone:"+442079460000"};
  assert.equal(parseChatRequest(request).email,"teste@example.com");
  assert.equal(parseChatRequest({...request,phone:undefined}),null);
  assert.equal(parseChatRequest({...request,email:"invalid"}),null);
  assert.deepEqual(parseChatRequest({action:"verify_email",department:"sales",code:"123456",secret:"discard"}),{action:"verify_email",department:"sales",code:"123456"});
  for(const code of ["12345","1234567","12a456",123456]) assert.equal(parseChatRequest({action:"verify_email",department:"sales",code}),null);
});

test("resume and expected-conversation IDs are validated; review requests require consent", () => {
  assert.equal(parseChatRequest({action:"resume",department:"sales"}),null);
  assert.equal(parseChatRequest({action:"resume",department:"sales",conversation_id:"another-person"}),null);
  assert.equal(parseChatRequest({action:"resume",department:"sales",conversation_id:id1}).conversation_id,id1);
  assert.equal(parseChatRequest({action:"poll",department:"sales",conversation_id:id1}).conversation_id,id1);
  assert.equal(parseChatRequest({action:"request_review",department:"sales",request_id:id1,contact:{name:"Teste",email:"t@example.com",phone:"+442079460000",consent:false}}),null);
});

test("identity conflict and verification errors retain machine meaning instead of generic busy", async () => {
  for(const [status,code] of [[409,"identity_conflict"],[409,"conversation_changed"],[409,"request_conflict"],[400,"invalid_verification_code"],[503,"verification_unavailable"],[429,"resend_wait"]]) {
    const result=await relayAmeliaChat(body,{...options,endpoint:"https://crm.example.com/api/v1/ai/webchat-preview",fetchImpl:async()=>Response.json({error:{code:"invalid_request",message:code,details:{secret:"hidden"}}},{status})});
    assert.equal(result.payload.error,code);
    assert.equal(JSON.stringify(result.payload).includes("hidden"),false);
  }
});

test("verified history is bounded and closed conversations are always read-only", async () => {
  const data={...fixture(),status:"closed",read_only:false,verification:{enabled:true,status:"verified"},conversations:[{id:id1,updated_at:new Date().toISOString(),status:"closed",preview:"Atendimento anterior",can_resume:true}]};
  const relay=patch=>relayAmeliaChat({action:"history",department:"sales"},{...options,fetchImpl:async()=>Response.json({...data,...patch})});
  const result=await relay({});
  assert.equal(result.payload.read_only,true);
  assert.equal(result.payload.conversations[0].can_resume,false);
  assert.equal((await relay({verification:{enabled:true,status:"pending"}})).status,502);
  assert.equal((await relay({conversations:Array(21).fill(data.conversations[0])})).status,502);
});

test("pending registration survives reload only with a valid consented payload",()=>{
  const now=Date.now();
  const pending={savedAt:now,body:{action:"register",department:"sales",request_id:id1,contact:{name:"Teste",phone:"+442079460000",email:"teste@example.com",consent:true}}};
  assert.deepEqual(readPendingChatRequest(JSON.stringify(pending),null,now),pending);
  assert.equal(readPendingChatRequest(JSON.stringify({...pending,body:{...pending.body,contact:{...pending.body.contact,consent:false}}}),null,now),null);
  assert.equal(readPendingChatRequest(JSON.stringify({...pending,body:{...pending.body,contact:null}}),null,now),null);
});


test("pagination requests accept opaque cursors only on the scoped page actions", () => {
  for (const action of ["history", "earlier_messages"]) {
    const request={action,department:"sales",conversation_id:id1,cursor:"opaque_Base64url-123"};
    assert.equal(parseChatRequest(request).cursor,request.cursor);
    for (const cursor of ["", "../private", "x".repeat(501), 123]) assert.equal(parseChatRequest({...request,cursor}),null);
  }
  assert.equal(parseChatRequest({action:"earlier_messages",department:"sales",cursor:"abc"}),null);
  assert.equal(parseChatRequest({action:"message",department:"sales",input:"Oi",request_id:id1,cursor:"abc"}),null);
});

test("relay retains reviewed history cursors and server queue timestamp, rejects malformed pages", async () => {
  const data={...fixture(),status:"waiting_human",waiting_since:"2026-11-07T12:00:00.000Z",history_cursor:"older_123",conversations_cursor:null};
  const relay=patch=>relayAmeliaChat(body,{...options,fetchImpl:async()=>Response.json({...data,...patch})});
  const result=await relay({});
  assert.equal(result.payload.waiting_since,data.waiting_since);
  assert.equal(result.payload.history_cursor,"older_123");
  assert.equal(result.payload.conversations_cursor,null);
  assert.equal((await relay({status:"in_progress"})).payload.waiting_since,null);
  for (const patch of [{history_cursor:"not a cursor"},{conversations_cursor:123},{waiting_since:"invalid"}]) assert.equal((await relay(patch)).status,502);
});

test("older messages survive later polls with stable order and without duplicates", async () => {
  const {mergeChatMessages}=await import("../lib/chat-recovery.ts");
  const page=(first,last)=>Array.from({length:last-first+1},(_,i)=>({id:String(first+i),text:`message ${first+i}`}));
  const latest=page(61,120);
  const loaded=mergeChatMessages(latest,page(1,60),true);
  assert.equal(loaded.length,120);
  assert.equal(loaded[0].id,"1");assert.equal(loaded.at(-1).id,"120");
  const polled=mergeChatMessages(loaded,page(62,121));
  assert.equal(polled.length,121);assert.equal(polled[0].id,"1");assert.equal(polled.at(-1).id,"121");
  assert.equal(mergeChatMessages(polled,page(1,60),true).length,121);
  assert.deepEqual(mergeChatMessages([],[{id:"other",text:"different conversation"}]),[{id:"other",text:"different conversation"}]);
});

test("queue label measures the server timestamp without promising a response time", async () => {
  const {chatWaitingTime}=await import("../lib/chat-recovery.ts");
  const since="2026-11-07T12:00:00.000Z",start=Date.parse(since);
  assert.equal(chatWaitingTime(since,start+59999),"há menos de 1 minuto");
  assert.equal(chatWaitingTime(since,start+60000),"há 1 minuto");
  assert.equal(chatWaitingTime(since,start+3660000),"há 1 hora e 1 min");
  assert.equal(chatWaitingTime(since,start-1000),"há menos de 1 minuto");
  assert.equal(chatWaitingTime(null,start),null);assert.equal(chatWaitingTime("invalid",start),null);
});


test("trusted deployment identity is sent only as the server relay header, never public JSON", async () => {
  const trustedOidcToken="synthetic.server.identity";
  let calls=0;
  const fetchImpl=async (url,init)=>{
    calls++;
    assert.equal(url,options.endpoint);
    assert.equal(init.headers["x-vercel-trusted-oidc-idp-token"],trustedOidcToken);
    assert.equal(init.redirect,"manual");
    assert.equal(init.body.includes(trustedOidcToken),false);
    return Response.json({...fixture(),trustedOidcToken});
  };
  const result=await relayAmeliaChat(body,{...options,trustedOidcToken,fetchImpl});
  assert.equal(calls,1);assert.equal(result.status,200);
  assert.equal(JSON.stringify(result.payload).includes(trustedOidcToken),false);
  await relayAmeliaChat(body,{...options,fetchImpl:async (_url,init)=>{
    assert.equal("x-vercel-trusted-oidc-idp-token" in init.headers,false);
    return Response.json(fixture());
  }});
  const failure=await relayAmeliaChat(body,{...options,trustedOidcToken,fetchImpl:async()=>{throw new Error(trustedOidcToken);}});
  assert.deepEqual(failure,{status:503,payload:{error:"chat_unavailable"}});
  assert.equal(parseChatRequest({...body,trustedOidcToken}).trustedOidcToken,undefined);
});
