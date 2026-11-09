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
  assert.equal(parseChatRequest({ ...body, action: "message", token: "a".repeat(64), input: "a".repeat(5001) }), null);
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
const { chatCookieName, chatCookieOptions, chatSessionExpiry, shouldClearChatCookies, relayRequestWithCookie, publicChatPayload } = await import("../lib/chat-cookie.ts");
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


test("expired or revoked sessions clear browser bindings, while conflicts keep the recoverable session", async () => {
  const result=await relayAmeliaChat({action:"recover",department:"sales"},{...options,endpoint:"https://crm.example.com/api/v1/ai/webchat-preview",fetchImpl:async()=>Response.json({error:{code:"invalid_request",message:"session_expired"}},{status:410})});
  assert.equal(result.payload.error,"session_expired");
  assert.equal(shouldClearChatCookies("recover",result.status),true);
  for (const action of ["start","recover","reset"]) {
    assert.equal(shouldClearChatCookies(action,410),true);
    for (const status of [200,400,401,403,409,429,503]) assert.equal(shouldClearChatCookies(action,status),false);
  }
  for (const action of ["poll","register","message","handoff","history","earlier_messages","resume"]) assert.equal(shouldClearChatCookies(action,410),false);
  assert.equal(shouldClearChatCookies("logout",200),true);
  assert.equal(shouldClearChatCookies("logout",503),true);
});

test("commercial qualification validates CNPJ, dates and preferences without inventing modality", () => {
  const base = { action: "message", department: "sales", input: "sales:resume", request_id: "11111111-1111-4111-8111-111111111111" };
  const qualification = { interest: "business", cnpj: "11.222.333/0001-81", city: "Niterói", lives: 2, ages: [0, 35], previous_plan: "no", preferred_due_day: 10, desired_start_date: "2026-11-20" };
  const parsed = parseChatRequest({ ...base, qualification });
  assert.equal(parsed.qualification.cnpj, "11222333000181");
  assert.equal(parsed.qualification.modality, undefined);
  assert.equal(parsed.qualification.secret, undefined);
  for (const patch of [{ cnpj: "11111111111111" }, { preferred_due_day: 32 }, { desired_start_date: "2026-02-30" }, { ages: [1] }, { interest: "individual" }]) {
    assert.equal(parseChatRequest({ ...base, qualification: { ...qualification, ...patch } }), null);
  }
});

test("journey projection strips metadata and removes actions during human ownership", async () => {
  const journey = { version: "test-v1", step: "interest", text: "Para quem?", qualification: {}, options: [{label: "Família", value: "sales:interest:personal", secret: "private"}], secret: "private" };
  const relay = patch => relayAmeliaChat(body, { ...options, fetchImpl: async () => Response.json({ ...fixture(), journey, ...patch }) });
  const active = await relay({});
  assert.equal(active.status, 200);
  assert.equal(JSON.stringify(active.payload.journey).includes("private"), false);
  assert.equal(active.payload.journey.options.length, 1);
  for (const status of ["waiting_human", "in_progress", "closed"]) assert.deepEqual((await relay({ status })).payload.journey.options, []);
  assert.equal((await relay({ journey: { ...journey, options: [{ label: "Unsafe", value: "javascript:alert(1)" }] } })).status, 502);
  assert.equal((await relay({ journey: { ...journey, qualification: { cnpj: "123" } } })).status, 502);
});


test("a write waits for an in-flight poll to release the shared server lock", async () => {
  const { afterChatPoll } = await import('../lib/chat-recovery.ts');
  let release;
  const poll = new Promise(resolve => { release = resolve; });
  const events = [];
  const mutation = afterChatPoll(poll, async () => { events.push('write'); return 'sent'; });
  await Promise.resolve();
  assert.deepEqual(events, []);
  release();
  assert.equal(await mutation, 'sent');
  assert.deepEqual(events, ['write']);
  assert.equal(await afterChatPoll(Promise.reject(new Error('read failure')), async () => 'retry preserved'), 'retry preserved');
});


test("campaign navigation preserves only safe UTM across anchors and routes", async () => {
  const { campaignDestination, captureChatAttribution } = await import("../lib/chat.ts");
  const source = "https://www.ameliasaude.com.br/landing?utm_source=teste&utm_medium=cpc&utm_campaign=avaliacao&email=pessoa@example.com&gclid=secret&utm_content=21999999999#old";
  for (const target of ["/landing#lp-cotacao", "/landing#lp-duvidas", "/planos"]) {
    const destination = campaignDestination(target, source);
    assert.deepEqual(captureChatAttribution(destination.href, ""), {page_path:destination.pathname,utm_source:"teste",utm_medium:"cpc",utm_campaign:"avaliacao"});
    assert.equal(destination.search.includes("email"),false);
    assert.equal(destination.search.includes("gclid"),false);
    assert.equal(destination.search.includes("utm_content"),false);
  }
  assert.equal(campaignDestination("https://external.example/path", source).search, "");
  assert.equal(campaignDestination("/landing?utm_source=own",source).searchParams.get("utm_source"),"own");
});

test("registration qualification is strict and cannot carry price or pipeline control", () => {
  const registration={action:"register",department:"sales",request_id:id1,contact:{name:"Teste",phone:"+442079460000",email:"teste@example.com",consent:true},qualification:{interest:"personal",city:"Niterói",lives:1,ages:[35]}};
  assert.deepEqual(parseChatRequest(registration).qualification,registration.qualification);
  for(const field of ["price","status","stage_id","secret"]) assert.equal(parseChatRequest({...registration,qualification:{...registration.qualification,[field]:"injected"}}),null);
  assert.equal(parseChatRequest({...registration,action:"request_review"}),null);
});

test("v2 reload retry binds exact registration and qualification to session expiry and conversation", async () => {
  const {restorePendingChatRequest}=await import("../lib/chat-recovery.ts");
  const now=Date.now(), expiresAt=new Date(now+3600000).toISOString();
  const sessionRef="c".repeat(64);
  const scope={department:"sales",sessionRef,expiresAt,conversationId:id1};
  const pending={version:2,savedAt:now,sessionRef,expiresAt,body:{action:"register",department:"sales",request_id:id1,contact:{name:"Teste",phone:"+442079460000",email:"teste@example.com",consent:true},qualification:{interest:"personal",city:"Niterói",lives:1,ages:[35]}}};
  const raw=JSON.stringify(pending);
  assert.deepEqual(restorePendingChatRequest(raw,scope,now),pending);
  // A committed registration recovered after response loss legitimately gains a conversation.
  assert.deepEqual(restorePendingChatRequest(raw,{...scope,conversationId:undefined},now),pending);
  for(const patch of [{sessionRef:"d".repeat(64)},{sessionRef:undefined},{department:"service"},{expiresAt:new Date(now+7200000).toISOString()}]) assert.equal(restorePendingChatRequest(raw,{...scope,...patch},now),null);
  assert.equal(restorePendingChatRequest(raw,scope,now+3600000),null);
  assert.equal(restorePendingChatRequest(JSON.stringify({...pending,savedAt:now+1}),scope,now),null);
  assert.equal(restorePendingChatRequest(JSON.stringify({...pending,version:undefined}),scope,now),null);
  const bound={...pending,body:{...pending.body,conversation_id:id1}};
  assert.equal(restorePendingChatRequest(JSON.stringify(bound),{...scope,conversationId:"22222222-2222-4222-8222-222222222222"},now),null);
  assert.equal(restorePendingChatRequest(JSON.stringify({...pending,body:{...pending.body,qualification:{status:"won"}}}),scope,now),null);
});

test("relay exposes a validated noncredential retry reference without broad metadata",async()=>{
  const session_ref="c".repeat(64);
  const run=ref=>relayAmeliaChat(body,{...options,fetchImpl:async()=>Response.json({...fixture(),session_ref:ref,session_expires_at:new Date(Date.now()+3600000).toISOString()})});
  assert.equal((await run(session_ref)).payload.session_ref,session_ref);
  assert.equal((await run("unsafe")).status,502);
});

test("transport and retry preserve1000 ages including120 with strict bounds",async()=>{
  const {CHAT_MESSAGE_LIMIT}=await import("../lib/chat.ts");
  const {restorePendingChatRequest}=await import("../lib/chat-recovery.ts");
  const input=Array(1000).fill(120).join(", ");
  const request={action:"message",department:"sales",request_id:id1,input,qualification:{interest:"personal",city:"Niterói",lives:1000,ages:Array(1000).fill(120),product:"carioca_10_adesao",coparticipation:"sem",modality:"adesao"}};
  assert.equal(parseChatRequest({...request,department:"service"}),null);
  assert.equal(CHAT_MESSAGE_LIMIT,5000);assert.equal(input.length,4998);
  assert.deepEqual(parseChatRequest(request),request);
  const now=Date.now(),expiresAt=new Date(now+3600000).toISOString(),sessionRef="c".repeat(64);
  const saved={version:2,body:request,savedAt:now,expiresAt,sessionRef};
  assert.ok(JSON.stringify(saved).length<10000);
  assert.deepEqual(restorePendingChatRequest(JSON.stringify(saved),{department:"sales",sessionRef,expiresAt},now),saved);
  const response=await relayAmeliaChat(request,{...options,fetchImpl:async(_url,init)=>{
    assert.deepEqual(JSON.parse(init.body).qualification,request.qualification);
    assert.equal(JSON.parse(init.body).input,input);
    return Response.json(fixture());
  }});
  assert.equal(response.status,200);
  assert.equal(parseChatRequest({...request,input:"a".repeat(5001)}),null);
  for(const patch of [{lives:1001},{ages:Array(1001).fill(120)},{product:"individual"},{coparticipation:"free"},{modality:"empresarial"},{price:1}])assert.equal(parseChatRequest({...request,qualification:{...request.qualification,...patch}}),null);
});

test("relay accepts only the two explicit product commands with digits",async()=>{
  const q={product:"carioca_10_adesao",coparticipation:"sem"};
  const run=value=>relayAmeliaChat(body,{...options,fetchImpl:async()=>Response.json({...fixture(),journey:{version:"test",step:"quote_product",text:"Escolha o produto",qualification:q,options:[{label:"Produto",value}]}})});
  for(const value of ["sales:product:carioca_10_adesao","sales:product:carioca_10_pme"]){const result=await run(value);assert.equal(result.status,200);assert.deepEqual(result.payload.journey.qualification,q);}
  for(const value of ["sales:product:carioca_11_adesao","sales:status:123","javascript:alert(1)"])assert.equal((await run(value)).status,502);
});

test("previous plan duration is bounded and survives retry projection",async()=>{
  const {parseChatQualification}=await import("../lib/chat.ts");
  assert.deepEqual(parseChatQualification({previous_plan:"yes",previous_plan_duration:"6_to_12_months"}),{previous_plan:"yes",previous_plan_duration:"6_to_12_months"});
  assert.equal(parseChatQualification({previous_plan_duration:"approved"}),null);
});

test("numeric due-day cards are accepted only for the documented step and values", async () => {
  const run=(value,step="due_preference")=>relayAmeliaChat(body,{...options,fetchImpl:async()=>Response.json({...fixture(),journey:{version:"test",step,text:"Vencimento",qualification:{city:"Niterói"},options:[{label:"Dia",value}]}})});
  for(const value of ["1","5","10","15","20"])assert.equal((await run(value)).status,200);
  for(const value of ["0","2","31","01","15 ","javascript:alert(1)"])assert.equal((await run(value)).status,502);
  for(const step of ["topics","summary","interest"])assert.equal((await run("15",step)).status,502);
});

test("complete shared-engine journey crosses relay, due recovery and invalid correction before automatic proposal", async () => {
  const {createJourney,advanceJourney,journeyView,TOPICS}=await import("../lib/sales-journey/engine.ts");
  let state=createJourney({interest:"personal",city:"Niterói",lives:2,ages:[35,18],previous_plan:"no",product:"carioca_10_adesao",coparticipation:"sem",modality:"adesao"});
  const seen=[];
  const relay=async(action="poll")=>{
    const result=await relayAmeliaChat({...body,action},{...options,fetchImpl:async()=>Response.json({...fixture(),status:"active",journey:journeyView(state)})});
    assert.equal(result.status,200);assert.equal(result.payload.handoff,false);return result.payload;
  };
  for(let i=0;i<6;i++){
    assert.equal(state.step,"topics");seen.push(TOPICS[state.topicIndex].id);
    await relay();state=advanceJourney(state,"sales:next").state;
  }
  assert.equal(state.step,"due_preference");
  const before=await relay("recover");assert.deepEqual(before.journey.options.filter(x=>!x.value.startsWith("sales:")).map(x=>x.value),["1","5","10","15","20"]);assert.ok(before.journey.options.some(x=>x.value==="sales:skip"));
  const invalid=advanceJourney(state,"31");state=invalid.state;
  assert.equal(state.step,"due_preference");assert.equal(state.qualification.preferred_due_day,undefined);await relay();
  state=advanceJourney(state,"15").state;
  assert.equal(state.qualification.preferred_due_day,15);seen.push(TOPICS[state.topicIndex].id);await relay();
  assert.deepEqual(seen,TOPICS.map(t=>t.id));
  state=advanceJourney(state,"sales:next").state;assert.equal(state.step,"start_preference");await relay();
  state=advanceJourney(state,"sales:skip").state;assert.equal(state.step,"summary");await relay();
  state=advanceJourney(state,"sales:proposal").state;assert.equal(state.step,"proposal_requested");
  assert.equal((await relay("recover")).journey.qualification.preferred_due_day,15);
  assert.equal(state.proposalRequest.qualification.preferred_due_day,15);
});

test("new due31 is rejected at input and retry while legacy response recovers every field", async()=>{
  const {parseChatQualification,parseStoredChatQualification}=await import("../lib/chat.ts");
  const {restorePendingChatRequest}=await import("../lib/chat-recovery.ts");
  const q={city:"Niterói",lives:2,ages:[35,18],preferred_due_day:31};
  assert.equal(parseChatQualification(q),null);assert.deepEqual(parseStoredChatQualification(q),q);
  const request={action:"message",department:"sales",input:"Preferência",request_id:"11111111-1111-4111-8111-111111111111",qualification:q};
  assert.equal(parseChatRequest(request),null);
  const now=Date.now(),expiresAt=new Date(now+60000).toISOString(),sessionRef="c".repeat(64);
  assert.equal(restorePendingChatRequest(JSON.stringify({version:2,body:request,savedAt:now,expiresAt,sessionRef}),{department:"sales",sessionRef,expiresAt},now),null);
  const recovered=await relayAmeliaChat({...body,action:"recover"},{...options,fetchImpl:async()=>Response.json({...fixture(),status:"active",journey:{version:"legacy",step:"summary",text:"Preferência anterior:31, a confirmar",qualification:q,options:[{label:"Corrigir",value:"sales:edit"}]}})});
  assert.equal(recovered.status,200);assert.deepEqual(recovered.payload.journey.qualification,q);
  for(const day of [1,5,10,15,20])assert.equal(parseChatRequest({...request,qualification:{...q,preferred_due_day:day}}).qualification.preferred_due_day,day);
});
