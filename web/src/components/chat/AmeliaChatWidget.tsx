"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import ReactMarkdown from "react-markdown";
import { createPortal } from "react-dom";
import { MessageCircle, Send, X, ArrowLeft, Headphones, Sparkles } from "lucide-react";
import { CHAT_MESSAGE_LIMIT, captureChatAttribution, parseChatQualification, type ChatQualification, type ChatRequest, type ChatResponse, type Department, type ChatMessage, type ChatStatus, type ChatConversation, type ChatVerification } from "@/lib/chat";
import { afterChatPoll, canApplyChatPoll, chatWaitingTime, mergeChatMessages, isTerminalChatError, readPendingChatRequest, restorePendingChatRequest, registrationAttempt, type PendingChatScope, type PendingChatRequest } from "@/lib/chat-recovery";

type Bubble = { id: string; role: "bot" | "user" | "agent"; text: string; options?: ChatMessage["quickReplies"]; document?: ChatMessage["document"] };
type Session = { journey?: ChatResponse["journey"]; historyCursor?: string | null; olderLoaded?: boolean; waitingSince?: string | null; connected?: boolean; conversationId?: string; status?: ChatStatus; readOnly?: boolean; verification?: ChatVerification; expiresAt?: string; errorCode?: string; messages: Bubble[]; input: ChatResponse["input"]; handoff: boolean; crmSynced: boolean; started: boolean; error?: string; terminal?: boolean };
const fresh = (): Session => ({ messages: [], input: null, handoff: false, crmSynced: false, started: false });
const names = { sales: "Vendas", service: "Atendimento" };

async function requestChat(body: ChatRequest): Promise<ChatResponse> {
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(100_000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "chat_unavailable");
  return data;
}

function statusLabel(status: ChatStatus) {
  return {active:"Assistente virtual",waiting_human:"Aguardando a equipe",in_progress:"Em atendimento com a equipe",closed:"Atendimento encerrado"}[status];
}
function errorText(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  const messages: Record<string,string> = {
    invalid_contact:"Confira nome, telefone com DDD e e-mail. Se seus dados mudaram, solicite uma revisão abaixo.",
    identity_conflict:"Não foi possível confirmar estes dados. Confira o cadastro ou escolha “Preciso atualizar meus dados”.",
    request_conflict:"Esta solicitação já foi registrada com outros dados. Confira o formulário antes de tentar novamente.",
    conversation_changed:"O atendimento mudou em outra aba. Atualize a conversa antes de enviar outra mensagem.",
    chat_busy:"Sua solicitação anterior ainda está sendo processada. Aguarde um instante e tente novamente.",
    rate_limited:"Aguarde um instante antes de tentar novamente.",
    session_closed:"Este atendimento foi encerrado. Inicie um novo atendimento para conversar.",
    session_expired:"O acesso neste dispositivo expirou. Inicie ou recupere um atendimento.",
    invalid_verification_code:"Não foi possível confirmar o código. Confira os seis dígitos ou solicite um novo código.",
    verification_unavailable:"A recuperação por e-mail está indisponível no momento. Você pode iniciar um novo atendimento.",
    verification_delivery_failed:"Não foi possível enviar o código agora. Tente novamente em instantes.",
    resend_wait:"Aguarde o intervalo indicado antes de solicitar outro código.",
    verification_rate_limited:"Você atingiu o limite de tentativas. Aguarde antes de tentar novamente.",
    verification_required:"Confirme seu e-mail para consultar atendimentos anteriores.",
    history_unavailable:"Não foi possível consultar seus atendimentos agora. Tente novamente.",
  };
  return messages[code] ?? "Não foi possível conectar ao chat. Tente novamente em instantes. Sua solicitação não foi confirmada.";
}

export type ChatPrefill = { contact: NonNullable<ChatRequest["contact"]>; qualification: ChatQualification };
export type AmeliaChatHandle = { open: (returnFocus?: HTMLElement | null, prefill?: ChatPrefill) => Promise<void> };
type AmeliaChatWidgetProps = { children?: ReactNode; launcherClassName?: string; initialDepartment?: Department; hideLauncher?: boolean; ref?: Ref<AmeliaChatHandle> };

export function AmeliaChatWidget({ children, launcherClassName, initialDepartment, hideLauncher = false, ref }: AmeliaChatWidgetProps = {}) {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState<Department | null>(null);
  const [sessions, setSessions] = useState<Record<Department, Session>>({ sales: fresh(), service: fresh() });
  const [draft, setDraft] = useState("");
  const [contact, setContact] = useState({name:"",phone:"",email:""});
  const [consent, setConsent] = useState(false);
  const [guide, setGuide] = useState<'main'|'plans'|'network'|'qualification'|null>('main');
  const [network, setNetwork] = useState({city:'',specialty:'',product:'Carioca 10'});
  const [qualification, setQualification] = useState({ city: "", lives: "", ages: "", modality: "indefinido" });
  const [qualificationError, setQualificationError] = useState("");
  const prefilled = useRef<{ payload: ChatPrefill; phase: "start" | "register" | "done"; conversationId?: string; body?: ChatRequest } | null>(null);
  const registration = useRef<Partial<Record<Department, ChatRequest>>>({});
  const [view, setView] = useState<"choice" | "chat" | "identify" | "code" | "history">("choice");
  const [identity, setIdentity] = useState({ email: "", phone: "" });
  const [code, setCode] = useState("");
  const [conversationsCursor, setConversationsCursor] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [flowError, setFlowError] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const [clock, setClock] = useState(0);
  const errorPanel = useRef<HTMLDivElement>(null);
  const flowPanel = useRef<HTMLDivElement>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const externalTrigger = useRef<HTMLElement | null>(null);
  const messageLog = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const followLatest = useRef(true);
  const visibleConversation = useRef<string | undefined>(undefined);
  const scrollAnchor = useRef<{ height: number; top: number } | null>(null);
  const submitting = useRef(false);
  const pending = useRef<Partial<Record<Department, PendingChatRequest>>>({});
  const retryScopes = useRef<Partial<Record<Department, PendingChatScope>>>({});
  const revisions = useRef<Record<Department, number>>({ sales: 0, service: 0 });
  const attribution = useRef<ReturnType<typeof captureChatAttribution>>(undefined);
  const pollInFlight = useRef<Promise<ChatResponse> | null>(null);
  function requestAfterPoll(body: ChatRequest) {
    return afterChatPoll(pollInFlight.current, () => requestChat(body));
  }
  // Capture once at arrival, before a CTA changes the address; no campaign storage.
  useEffect(() => {
    attribution.current ??= captureChatAttribution(window.location.href, document.referrer);
    for (const target of ["sales", "service"] as const) {
      try {
        const raw = sessionStorage.getItem(`amelia-chat-pending:${target}`);
        if (raw && !readPendingChatRequest(raw, null)) sessionStorage.removeItem(`amelia-chat-pending:${target}`);
      } catch { /* optional */ }
    }
  }, []);
  const active = department ? sessions[department] : null;
  useEffect(() => {
    if (!department || !active?.expiresAt) return;
    const target=department;
    const timer=window.setTimeout(()=>{
      prefilled.current=null;revisions.current[target]++;pending.current[target]=undefined;registration.current[target]=undefined;
      try{sessionStorage.removeItem(`amelia-chat-session:${target}`);sessionStorage.removeItem(`amelia-chat-pending:${target}`);}catch{/* optional */}
      setSessions(previous=>({...previous,[target]:fresh()}));setView("choice");setDraft("");setCode("");setContact({name:"",phone:"",email:""});setIdentity({email:"",phone:""});setConsent(false);setQualification({city:"",lives:"",ages:"",modality:"indefinido"});setNetwork({city:"",specialty:"",product:"Carioca 10"});setConversations([]);setConversationsCursor(null);setFlowError("O acesso neste dispositivo expirou. Inicie ou recupere um atendimento.");
    },Math.max(0,Date.parse(active.expiresAt)-Date.now()));
    return ()=>window.clearTimeout(timer);
  },[department,active?.expiresAt]);
  useEffect(() => { if (active?.error && !busy) errorPanel.current?.focus(); }, [active?.error, busy]);
  useEffect(() => { if (!open || (view !== "code" && active?.status !== "waiting_human")) return; const timer=window.setInterval(()=>setClock(Date.now()),1000); return ()=>window.clearInterval(timer); }, [open, view, active?.status]);
  useEffect(() => { if (flowError) flowPanel.current?.focus(); }, [flowError]);
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bus = new BroadcastChannel("amelia-chat-session"); channel.current = bus;
    bus.onmessage = event => {
      if (event.data === "logout") {
        prefilled.current=null;revisions.current.sales++; revisions.current.service++;
        pending.current = {}; registration.current = {};
        for (const target of ["sales","service"] as const) { try {sessionStorage.removeItem(`amelia-chat-session:${target}`);sessionStorage.removeItem(`amelia-chat-pending:${target}`);} catch {/* optional */} }
        setSessions({ sales: fresh(), service: fresh() }); setView("choice"); setDraft(""); setContact({name:"",phone:"",email:""}); setIdentity({email:"",phone:""}); setCode("");setConsent(false);setQualification({city:"",lives:"",ages:"",modality:"indefinido"});setNetwork({city:"",specialty:"",product:"Carioca 10"});setConversations([]);setConversationsCursor(null);setFlowError("");
      }
    };
    return () => { bus.close(); channel.current = null; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const trigger = launcher.current ?? externalTrigger.current;
    if (!element?.open) element?.showModal();
    return () => {
      element?.close();
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    const log = messageLog.current;
    const changed = visibleConversation.current !== active?.conversationId;
    visibleConversation.current = active?.conversationId;
    if (scrollAnchor.current && log && !changed) {
      log.scrollTop = scrollAnchor.current.top + log.scrollHeight - scrollAnchor.current.height;
      scrollAnchor.current = null;
    } else if (changed || followLatest.current) {
      scrollAnchor.current=null;followLatest.current=true;end.current?.scrollIntoView({ block: "nearest" });
    }
  }, [active?.messages, active?.conversationId, open]);

  const merge = useCallback((target: Department, data: ChatResponse, inbound?: string, earlier = false) => {
    retryScopes.current[target] = { department: target, sessionRef: data.session_ref, expiresAt: data.session_expires_at, conversationId: data.conversation_id };
    setSessions(previous => {
      const current = previous[target];
      const sameConversation = data.conversation_id === current.conversationId;
      const messages: Bubble[] = mergeChatMessages<Bubble>(sameConversation ? current.messages : [], data.history ?? [], earlier);
      if (inbound && !data.history) messages.push({ id: crypto.randomUUID(), role: "user", text: inbound });
      for (const message of data.messages ?? []) {
        if (!messages.some(item => item.id === message.id)) messages.push({ id: message.id, role: "bot", text: message.text, options: message.quickReplies ?? message.list?.options, document: message.document });
      }
      for (const message of data.agentMessages ?? []) {
        if (!messages.some(item => item.id === message.id)) messages.push({ id: message.id, role: "agent", text: message.text });
      }
      // Poll revision guards prevent older history replacing a newer mutation.
      return { ...previous, [target]: { journey: earlier && sameConversation && data.status === "active" ? data.journey ?? current.journey : data.journey, connected: true, historyCursor: earlier || !sameConversation || !current.olderLoaded ? data.history_cursor : current.historyCursor, olderLoaded: earlier || (sameConversation && current.olderLoaded), waitingSince: data.status === "waiting_human" ? data.waiting_since ?? (sameConversation ? current.waitingSince : null) : null, conversationId: data.conversation_id, status: data.status ?? (data.handoff ? "waiting_human" : "active"), readOnly: data.read_only === true || data.status === "closed", verification: data.verification ?? current.verification, expiresAt: data.session_expires_at, messages, input: data.input, handoff: data.handoff, crmSynced: data.crmSynced, started: true, ...(pending.current[target] ? { error: current.error, errorCode: current.errorCode, terminal: current.terminal } : {}) } };
    });
  }, []);

  async function start(target: Department, reset = false, retry = false, preservePrefill = false) {
    if (submitting.current) return;
    if (reset && !preservePrefill) prefilled.current = null;
    setDepartment(target); setFlowError("");
    if (sessions[target].started && (!sessions[target].expiresAt || Date.parse(sessions[target].expiresAt!)>Date.now()) && !reset && !retry) { setView("chat"); return; }
    submitting.current = true; const revision=++revisions.current[target]; setBusy(true);
    try {
      attribution.current ??= captureChatAttribution(window.location.href, document.referrer);
      let legacy: string | null = null;
      try { legacy = sessionStorage.getItem(`amelia-chat-session:${target}`); } catch { /* optional */ }
      const data = await requestAfterPoll(reset ? { action: "reset", department: target, attribution: attribution.current } : { action: "recover", department: target, ...(legacy ? {token:legacy} : {}) });
      if (revision!==revisions.current[target]) return;
      if (reset) { pending.current[target] = undefined; registration.current[target] = undefined; setDraft(""); setContact({name:"",phone:"",email:""}); setConsent(false);setQualification({city:"",lives:"",ages:"",modality:"indefinido"});setNetwork({city:"",specialty:"",product:"Carioca 10"}); }
      else {
        try {
          const raw = sessionStorage.getItem(`amelia-chat-pending:${target}`);
          const saved = restorePendingChatRequest(raw, { department: target, sessionRef: data.session_ref, expiresAt: data.session_expires_at, conversationId: data.conversation_id });
          pending.current[target] = saved ?? undefined;
          if (saved) {
            if (saved.body.input && !saved.body.input.startsWith("sales:")) setDraft(saved.body.input);
            if (saved.body.contact) { setContact(saved.body.contact); setConsent(true); registration.current[target] = saved.body; }
          } else if (raw) {
            setFlowError("Uma solicitação antiga não pôde ser retomada com segurança. Confira os dados antes de enviar novamente.");
            sessionStorage.removeItem(`amelia-chat-pending:${target}`);
            registration.current[target] = undefined;
            setDraft(""); setContact({name:"",phone:"",email:""}); setConsent(false);
          }
        } catch { /* optional */ }
      }
      try { sessionStorage.removeItem(`amelia-chat-session:${target}`); if(reset) sessionStorage.removeItem(`amelia-chat-pending:${target}`); } catch { /* optional */ }
      setSessions(previous => ({ ...previous, [target]: fresh() }));
      if (!preservePrefill && prefilled.current?.conversationId && prefilled.current.conversationId !== data.conversation_id) prefilled.current=null;
      merge(target, data); setView("chat");
      return data;
    } catch (error) {
      if (revision!==revisions.current[target]) return;
      if (!reset && isTerminalChatError(error)) { pending.current[target]=undefined;registration.current[target]=undefined;try{sessionStorage.removeItem(`amelia-chat-pending:${target}`);}catch{/* optional */}prefilled.current=null;setView("choice"); setSessions(previous=>({...previous,[target]:fresh()})); }
      else { setFlowError(errorText(error)); setSessions(previous=>({...previous,[target]:{...previous[target],error:errorText(error),errorCode:error instanceof Error?error.message:"",terminal:isTerminalChatError(error)}})); }
    } finally { submitting.current = false; setBusy(false); }
  }

  // Contact and qualification share one recoverable registration. No synthetic chat turn.
  async function continuePrefill() {
    const flow = prefilled.current;
    if (!flow || flow.phase === "done" || submitting.current) return;
    if (flow.phase === "start") {
      const data = await start("sales", true, false, true);
      if (!data || prefilled.current !== flow) return;
      flow.conversationId = data.conversation_id;
      flow.phase = "register";
      setContact(flow.payload.contact); setConsent(true);
    }
    flow.body ??= { action: "register", department: "sales", conversation_id: flow.conversationId, request_id: crypto.randomUUID(), contact: flow.payload.contact, qualification: flow.payload.qualification, attribution: attribution.current };
    const data = await deliver(flow.body);
    if (!data || prefilled.current !== flow) return;
    flow.conversationId = data.conversation_id;
    flow.body = undefined; flow.phase = "done";
    return true;
  }

  useImperativeHandle(ref, () => ({ async open(returnFocus, prefill) {
    externalTrigger.current = returnFocus ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setOpen(true);
    if (prefill) {
      if (submitting.current) throw new Error("chat_busy");
      const same = prefilled.current && JSON.stringify(prefilled.current.payload) === JSON.stringify(prefill);
      if (!same) prefilled.current = { payload: prefill, phase: "start" };
      if (prefilled.current?.phase === "done") { setDepartment("sales"); setView("chat"); return; }
      if (!await continuePrefill()) throw new Error("chat_unavailable");
    } else await start(initialDepartment ?? "sales");
  } }));

  async function deliver(body: ChatRequest) {
    const target = body.department;
    submitting.current = true;
    const revision = ++revisions.current[target];
    setBusy(true);
    const previousPending = pending.current[target];
    const scope = retryScopes.current[target];
    pending.current[target] = { version: 2, body, savedAt: previousPending && previousPending.body.request_id === body.request_id ? previousPending.savedAt : Date.now(), sessionRef: scope?.sessionRef, expiresAt: scope?.expiresAt };
    try { if (scope?.sessionRef && scope?.expiresAt) sessionStorage.setItem(`amelia-chat-pending:${target}`, JSON.stringify(pending.current[target])); } catch { /* in-memory retry still works */ }
    try {
      const data = await requestAfterPoll(body);
      if (revision!==revisions.current[target]) return;
      pending.current[target] = undefined;
      if (["register", "request_review"].includes(body.action)) registration.current[target] = undefined;
      try { sessionStorage.removeItem(`amelia-chat-pending:${target}`); } catch { /* optional */ }
      merge(target, data, body.input);
      setDraft("");
      setGuide(null);
      return data;
    } catch (error) {
      if (revision!==revisions.current[target]) return;
      if (isTerminalChatError(error)) {
        prefilled.current=null; pending.current[target]=undefined; registration.current[target]=undefined;
        try { sessionStorage.removeItem(`amelia-chat-pending:${target}`); } catch { /* optional */ }
        setDraft(""); setContact({name:"",phone:"",email:""}); setConsent(false);
      } else if (body.input && !body.input.startsWith("sales:")) setDraft(body.input);
      setSessions(previous => ({ ...previous, [target]: { ...previous[target], error: errorText(error), errorCode: error instanceof Error ? error.message : "", terminal: isTerminalChatError(error) } }));
    } finally { submitting.current = false; setBusy(false); }
  }

  async function send(value: string, details?: ChatQualification) {
    if (!department || !active?.connected || active.terminal || active.readOnly || submitting.current || !value.trim()) return;
    const waiting = pending.current[department];
    if (waiting) { await deliver(waiting.body); return; }
    await deliver({ action: "message", department, conversation_id: active.conversationId, input: value.trim(), request_id: crypto.randomUUID(), ...(details ? { qualification: details } : {}) });
  }

  async function handoff() {
    if (!department || !active?.connected || active.terminal || active.readOnly || submitting.current) return;
    await deliver(pending.current[department]?.body ?? { action: "handoff", department, conversation_id: active.conversationId, request_id: crypto.randomUUID() });
  }

  async function retryCurrent() {
    if (!department || submitting.current || active?.readOnly) return;
    if (prefilled.current && prefilled.current.phase !== "done") { await continuePrefill(); return; }
    const waiting = pending.current[department];
    if (waiting) await deliver(waiting.body);
    else await start(department, false, true);
  }

  function qualify(event: FormEvent) {
    event.preventDefault();
    const ages = qualification.ages.trim() ? qualification.ages.split(/[,;\s]+/).filter(Boolean).map(Number) : undefined;
    const details = parseChatQualification({ ...(qualification.city.trim() ? { city: qualification.city.trim() } : {}), ...(qualification.lives ? { lives: Number(qualification.lives) } : {}), ...(ages ? { ages } : {}), modality: qualification.modality });
    if (!details) { setQualificationError("Confira a quantidade de pessoas e as idades informadas."); return; }
    setQualificationError("");
    const modality = { empresarial: "empresarial", adesao: "por adesão", indefinido: "a definir" }[details.modality ?? "indefinido"];
    const text = `Quero uma cotação. Modalidade: ${modality}.${details.city ? ` Cidade: ${details.city}.` : ""}${details.lives ? ` Pessoas: ${details.lives}.` : ""}${details.ages ? ` Idades: ${details.ages.join(",")}.` : ""}`;
    void send(text, details);
  }

  // Credentials stay HttpOnly; only the exact unconfirmed request is tab-scoped.
  useEffect(() => {
    if (!open || view!=="chat" || !department || !active?.connected || !active.crmSynced || active.terminal || active.readOnly) return;
    let stopped = false;
    let polling = false;
    const timer = window.setInterval(async () => {
      if (submitting.current || polling || pollInFlight.current || document.hidden) return;
      polling = true;
      const revision = revisions.current[department];
      const request = requestChat({ action: "poll", department, conversation_id: active.conversationId });
      pollInFlight.current = request;
      try {
        const data = await request;
        if (!stopped && canApplyChatPoll(revision, revisions.current[department], submitting.current)) merge(department, data);
      } catch (error) {
        if (!stopped && canApplyChatPoll(revision, revisions.current[department], submitting.current)) setSessions(previous => ({ ...previous, [department]: { ...previous[department], error: errorText(error), errorCode: error instanceof Error ? error.message : "", terminal: isTerminalChatError(error) } }));
      } finally { if (pollInFlight.current === request) pollInFlight.current = null; polling = false; }
    }, 5000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [open, view, department, active?.connected, active?.conversationId, active?.crmSynced, active?.terminal, active?.readOnly, merge]);

  async function register(event: FormEvent, review = false) {
    event.preventDefault();
    if (!department || !active?.connected || submitting.current || !consent) return;
    const flow = department === "sales" && prefilled.current?.phase === "register" ? prefilled.current : null;
    const carriedQualification = !review ? flow?.payload.qualification ?? pending.current[department]?.body.qualification : undefined;
    const body: Omit<ChatRequest, "request_id"> = { ...(carriedQualification ? { qualification: carriedQualification } : {}), action: review ? "request_review" : "register", department, conversation_id: active.conversationId, contact: { name: contact.name.trim(), phone: contact.phone.trim(), email: contact.email.trim().toLowerCase(), consent: true }, attribution: attribution.current };
    const next = registrationAttempt(registration.current[department] ?? null, body, () => crypto.randomUUID());
    registration.current[department] = next;
    if (flow) { flow.payload = { ...flow.payload, contact: next.contact! }; flow.body = next; }
    const data = await deliver(next);
    if (data && flow && prefilled.current === flow) {
      if (review || data.handoff || data.status !== "active") { prefilled.current = null; return; }
      flow.conversationId = data.conversation_id; flow.body = undefined; flow.phase = "done";
    }
  }

  async function beginResume() {
    if (submitting.current) return;
    const target = department ?? initialDepartment ?? "sales";
    if (!sessions[target].connected) {
      submitting.current=true; setBusy(true); setDepartment(target);
      const revision=++revisions.current[target];
      try { const data=await requestAfterPoll({action:"start",department:target,attribution:attribution.current}); if(revision!==revisions.current[target])return; merge(target,data); }
      catch(error) { if(revision===revisions.current[target])setFlowError(errorText(error)); return; }
      finally {submitting.current=false;setBusy(false);}
    }
    setIdentity({ email: contact.email, phone: contact.phone }); setFlowError(""); setView("identify");
  }

  async function flowAction(action: "email_code" | "verify_email" | "history" | "resume", conversationId?: string, cursor?: string) {
    if (!department || submitting.current) return;
    submitting.current=true;setBusy(true);setFlowError("");
    const revision=++revisions.current[department];
    try {
      const data = await requestAfterPoll({ action, department, ...(action==="email_code" ? {email:identity.email.trim().toLowerCase(),phone:identity.phone.trim()} : {}), ...(action==="verify_email" ? {code} : {}), ...(conversationId ? {conversation_id:conversationId} : {}), ...(cursor ? {cursor} : {}) });
      if (revision!==revisions.current[department]) return;
      merge(department,data);
      if (action==="email_code") { setCode("");setClock(Date.now());setResendAt(Date.now()+(data.verification?.resend_after??60)*1000);setView("code"); }
      if (action==="verify_email") { setConversations(data.conversations??[]);setConversationsCursor(data.conversations_cursor??null);setView("history"); }
      if (action==="history") {setConversations(previous=>cursor ? mergeChatMessages(previous,data.conversations??[]) : data.conversations??[]);setConversationsCursor(data.conversations_cursor??null);setView("history");}
      if (action==="resume") {
        prefilled.current=null;registration.current[department]=undefined;
        pending.current[department]=undefined;setDraft("");
        try {
          const saved=restorePendingChatRequest(sessionStorage.getItem(`amelia-chat-pending:${department}`), { department, sessionRef:data.session_ref, expiresAt:data.session_expires_at, conversationId:data.conversation_id });
          if(saved){pending.current[department]=saved;if(saved.body.input&&!saved.body.input.startsWith("sales:"))setDraft(saved.body.input);}
          else sessionStorage.removeItem(`amelia-chat-pending:${department}`);
        }catch{/* optional */}
        setGuide("main");setView("chat");
      }
    } catch(error) {if(revision===revisions.current[department])setFlowError(errorText(error));}
    finally{submitting.current=false;setBusy(false);}
  }

  async function loadEarlier() {
    if (!department || !active?.conversationId || !active.historyCursor || submitting.current) return;
    submitting.current=true;setBusy(true);setFlowError("");
    const target=department, revision=++revisions.current[target];
    try {
      const data=await requestAfterPoll({action:"earlier_messages",department:target,conversation_id:active.conversationId,cursor:active.historyCursor});
      if (revision!==revisions.current[target]) return;
      const log=messageLog.current;
      if (log) scrollAnchor.current={height:log.scrollHeight,top:log.scrollTop};
      merge(target,data,undefined,true);
    } catch(error) {if(revision===revisions.current[target])setFlowError(errorText(error));}
    finally {submitting.current=false;setBusy(false);}
  }

  async function logout() {
    if (!department || submitting.current) return;
    submitting.current=true;setBusy(true);
    let failed=false;
    try { await requestAfterPoll({action:"logout",department}); }
    catch { failed=true; }
    finally {
      prefilled.current=null;revisions.current.sales++;revisions.current.service++;
      for(const target of ["sales","service"] as const) {try{sessionStorage.removeItem(`amelia-chat-session:${target}`);sessionStorage.removeItem(`amelia-chat-pending:${target}`);}catch{/* optional */}}
      pending.current={};registration.current={};setSessions({sales:fresh(),service:fresh()});setView("choice");setDraft("");setContact({name:"",phone:"",email:""});setIdentity({email:"",phone:""});setCode("");setConsent(false);setQualification({city:"",lives:"",ages:"",modality:"indefinido"});setNetwork({city:"",specialty:"",product:"Carioca 10"});setConversations([]);setConversationsCursor(null);
      setFlowError(failed ? "O histórico foi fechado neste dispositivo. Não foi possível confirmar o encerramento no servidor; feche esta página se estiver em um dispositivo compartilhado." : "");
      channel.current?.postMessage("logout");submitting.current=false;setBusy(false);
    }
  }

  function submit(event: FormEvent) { event.preventDefault(); void send(draft); }
  const waitingTime = chatWaitingTime(active?.waitingSince, clock);
  const canType = Boolean(active?.connected && !active.terminal && active.errorCode!=="conversation_changed" && !active.readOnly && department && !pending.current[department] && active.input && !["none", "choice", "contact"].includes(active.input.kind));

  return <>
    {!hideLauncher && <button ref={launcher} type="button" style={{ color: "#fff" }} onClick={() => { setOpen(true); void start(initialDepartment ?? "sales"); }} aria-label={children ? undefined : "Fale com a Amélia"} title={children ? undefined : "Fale com a Amélia"} aria-haspopup="dialog" aria-controls="amelia-chat" aria-expanded={open} className={launcherClassName ?? "fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full border-0 bg-[var(--amelia-deep)] p-0 text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--amelia-purple)]"}>
      {children ?? <MessageCircle size={26} aria-hidden="true" />}
    </button>}
    {open ? createPortal(<dialog ref={dialog} id="amelia-chat" aria-labelledby="amelia-chat-title" onCancel={event => { event.preventDefault(); setOpen(false); }} className="ph-no-capture ph-no-autocapture m-auto h-[min(680px,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-[420px] overflow-hidden rounded-3xl border-0 p-0 text-[var(--amelia-deep)] shadow-2xl backdrop:bg-black/35 sm:mb-5 sm:mr-5">
      <div className="flex h-full flex-col bg-white font-sans">
        <header className="flex items-center gap-3 bg-[var(--amelia-deep)] px-4 py-4 text-white">
          {department && !initialDepartment && <button type="button" disabled={busy} aria-label="Escolher vendas ou atendimento" onClick={() => { setDepartment(null); setDraft(""); }} className="rounded-lg p-2 focus-visible:outline-2"><ArrowLeft size={20} /></button>}
          <div className="min-w-0 flex-1"><h2 id="amelia-chat-title" className="text-base font-medium">Amélia Saúde</h2><p className="text-xs text-white/80">{department ? "Assistente virtual · Prévia" : "Como podemos ajudar?"}</p></div>
          <button type="button" aria-label="Fechar chat" onClick={() => setOpen(false)} className="rounded-lg p-2 focus-visible:outline-2"><X size={22} /></button>
        </header>
        {flowError && <div ref={flowPanel} tabIndex={-1} role="alert" className="border-t bg-amber-50 px-4 py-3 text-sm">{flowError}</div>}
        {view !== "chat" || !department ? <div className="ph-no-capture min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {busy && <p role="status" className="text-sm">Conectando…</p>}
          {view === "choice" && <>
            <h3 className="text-xl font-medium">Como podemos ajudar?</h3>
            <p className="text-sm text-[var(--amelia-body)]">Comece uma conversa ou consulte um atendimento anterior.</p>
            {!initialDepartment && <label className="block text-sm">Assunto<select value={department??"sales"} onChange={e=>setDepartment(e.target.value as Department)} className="mt-1 w-full rounded-xl border p-3"><option value="sales">Quero contratar</option><option value="service">Preciso de atendimento</option></select></label>}
            <button type="button" disabled={busy} onClick={()=>void start(department??initialDepartment??"sales",true)} className="flex w-full items-center gap-3 rounded-2xl border p-4 text-left disabled:opacity-50"><Sparkles size={22} aria-hidden="true"/><span><strong className="block">Novo atendimento</strong><span className="text-sm">Conhecer planos e conversar com a Amélia.</span></span></button>
            <button type="button" disabled={busy} onClick={()=>void beginResume()} className="flex w-full items-center gap-3 rounded-2xl border p-4 text-left disabled:opacity-50"><Headphones size={22} aria-hidden="true"/><span><strong className="block">Retomar atendimento</strong><span className="text-sm">Confirmar seu e-mail e recuperar conversas.</span></span></button>
            {flowError && <button type="button" disabled={busy} onClick={()=>void start(department??initialDepartment??"sales",false,true)} className="underline">Tentar recuperar novamente</button>}
          </>}
          {view === "identify" && <form onSubmit={e=>{e.preventDefault();void flowAction("email_code");}} className="space-y-4">
            <h3 className="text-lg font-medium">Retomar atendimento</h3>
            <p className="text-sm">Informe o e-mail e telefone usados no atendimento. Se os dados corresponderem a um atendimento elegível, você receberá um código para confirmar seu e-mail.</p>
            {active?.verification?.enabled === false && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm">A recuperação por e-mail está indisponível no momento. Você pode iniciar um novo atendimento.</p>}
            <label className="block text-sm">E-mail<input type="email" autoComplete="email" required maxLength={254} value={identity.email} onChange={e=>setIdentity(v=>({...v,email:e.target.value}))} className="ph-mask mt-1 w-full rounded-xl border p-3" disabled={busy}/></label>
            <label className="block text-sm">Telefone com DDD<input type="tel" autoComplete="tel" required maxLength={25} value={identity.phone} onChange={e=>setIdentity(v=>({...v,phone:e.target.value}))} className="ph-mask mt-1 w-full rounded-xl border p-3" disabled={busy}/></label>
            <button type="submit" disabled={busy||active?.verification?.enabled===false} style={{color:"#fff"}} className="w-full rounded-xl bg-[var(--amelia-deep)] p-3 text-white disabled:opacity-50">Receber código por e-mail</button>
          </form>}
          {view === "code" && <form onSubmit={e=>{e.preventDefault();void flowAction("verify_email");}} className="space-y-4">
            <h3 className="text-lg font-medium">Confirme seu e-mail</h3>
            <p className="text-sm">Se os dados corresponderem a um atendimento elegível, você receberá um código de seis dígitos. Confira também a pasta de spam.</p>
            <label className="block text-sm">Código de seis dígitos<input autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" required minLength={6} maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,""))} className="ph-mask mt-1 w-full rounded-xl border p-3 text-center text-xl tracking-[0.25em]" disabled={busy}/></label>
            <button type="submit" disabled={busy||code.length!==6} style={{color:"#fff"}} className="w-full rounded-xl bg-[var(--amelia-deep)] p-3 text-white disabled:opacity-50">Confirmar e consultar atendimentos</button>
            <button type="button" disabled={busy||clock<resendAt} onClick={()=>void flowAction("email_code")} className="underline disabled:opacity-50">{clock<resendAt ? `Reenviar em ${Math.ceil((resendAt-(clock||Date.now()))/1000)}s` : "Reenviar código"}</button>
            <button type="button" disabled={busy} onClick={()=>{setView("identify");setFlowError("");setCode("");}} className="ml-4 underline">Corrigir dados</button>
          </form>}
          {view === "history" && <>
            <h3 className="text-lg font-medium">Seus atendimentos</h3>
            <p className="text-sm">Escolha uma conversa. Atendimentos encerrados ficam disponíveis somente para consulta.</p>
            {conversations.length===0 && <p role="status" className="rounded-xl bg-purple-50 p-3 text-sm">Não há atendimentos disponíveis para estes dados.</p>}
            <ul className="space-y-2">{conversations.map(item=><li key={item.id}><button type="button" disabled={busy} onClick={()=>void flowAction("resume",item.id)} className="w-full rounded-xl border p-3 text-left disabled:opacity-50"><span className="block text-xs text-[var(--amelia-body)]">{new Date(item.updated_at).toLocaleString("pt-BR")} · {statusLabel(item.status)}</span><span className="ph-mask mt-1 block break-words text-sm">{item.preview||"Atendimento Amélia Saúde"}</span><span className="mt-2 block text-xs underline">{item.can_resume ? "Continuar conversa" : "Consultar histórico"}</span></button></li>)}</ul>
            {conversationsCursor && <button type="button" disabled={busy} onClick={()=>void flowAction("history",undefined,conversationsCursor)} className="w-full rounded-xl border p-3 text-sm underline disabled:opacity-50">Carregar mais atendimentos</button>}
          </>}
          {view !== "choice" && <div className="flex flex-wrap gap-4 text-sm"><button type="button" disabled={busy} onClick={()=>{setFlowError("");setView(active?.connected?"chat":"choice");}} className="underline">Voltar</button><button type="button" disabled={busy} onClick={()=>void start(department??initialDepartment??"sales",true)} className="underline">Novo atendimento</button></div>}
          {active?.connected && <button type="button" disabled={busy} onClick={()=>void logout()} className="text-sm underline">Sair deste dispositivo</button>}
          <p className="text-xs leading-relaxed text-[var(--amelia-body)]">O acesso neste dispositivo dura até 24 horas. Em um dispositivo compartilhado, saia ao terminar. <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="underline">Privacidade</a></p>
        </div> : <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2 text-xs"><p role="status" className="mr-auto font-medium">{statusLabel(active?.status??"active")}</p><button type="button" disabled={busy} onClick={()=>active?.verification?.status==="verified"?void flowAction("history"):void beginResume()} className="underline">Atendimentos</button><button type="button" disabled={busy} onClick={()=>void start(department,true)} className="underline">Novo</button><button type="button" disabled={busy} onClick={()=>void logout()} className="underline">Sair</button></div>
          <div ref={messageLog} onScroll={event=>{const log=event.currentTarget;followLatest.current=log.scrollHeight-log.scrollTop-log.clientHeight<80;}} role="log" aria-label={`Mensagens de ${names[department]}`} aria-live="polite" aria-relevant="additions" className="ph-mask flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
            {active?.historyCursor && <button type="button" disabled={busy} onClick={()=>void loadEarlier()} className="w-full rounded-xl border p-2 text-sm underline disabled:opacity-50">Carregar mensagens anteriores</button>}
            {active?.messages.map((message, index) => <div key={message.id} className={`max-w-[95%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "ml-auto bg-[var(--amelia-deep)] text-white" : "bg-purple-50"}`}>
              {message.role === "agent" && <p className="mb-1 text-xs font-medium">Equipe Amélia Saúde</p>}
              {message.role === "user" ? <p className="whitespace-pre-wrap break-words">{message.text}</p> : <div className="space-y-2 break-words"><ReactMarkdown components={{
                a: ({ href, children }) => href?.startsWith("https://www.ameliasaude.com.br/")
                  ? <a href={href} target="_blank" rel="noopener noreferrer" className="underline">{children}</a>
                  : <span>{children}</span>,
              }}>{message.text}</ReactMarkdown></div>}
              {message.document && <a href={message.document.url} target="_blank" rel="noopener noreferrer" className="mt-2 block underline">Abrir {message.document.fileName}</a>}
              {!active?.journey && message.options && index === (active?.messages.length ?? 0) - 1 && <div className="mt-3 flex flex-wrap gap-2">{message.options.map(option => <button key={option.value} type="button" disabled={busy || active?.terminal} onClick={() => void send(option.value)} className="rounded-xl border border-[var(--amelia-purple)] bg-white px-3 py-2 text-left text-sm disabled:opacity-50 focus-visible:outline-2">{option.label}</button>)}</div>}
            </div>)}
            {busy && <p role="status" className="text-xs text-[var(--amelia-body)]">{active?.started ? "Consultando as informações…" : "Conectando…"}</p>}
            <div ref={end} />
          </div>
          {(active?.handoff || active?.status === "waiting_human") && <p role="status" className="border-t px-4 py-2 text-xs">{active.status === "waiting_human" ? <>Aguardando a equipe{waitingTime ? ` ${waitingTime}` : ""}. Este é o tempo decorrido, sem previsão de resposta.</> : "Acompanhe a resposta da equipe aqui neste chat."}</p>}
          {department && pending.current[department] && !active?.terminal && !active?.readOnly && !busy && <p role="status" className="border-t bg-amber-50 px-4 py-2 text-xs">Há uma solicitação sem confirmação.{pending.current[department]?.body.input && <span className="mt-1 block break-words">{pending.current[department]?.body.input?.startsWith("sales:") ? "Solicitação comercial aguardando confirmação." : pending.current[department]?.body.input}</span>}{!active?.error && <button type="button" onClick={()=>void retryCurrent()} className="mt-1 underline">Tentar novamente</button>}</p>}
          {active?.error && <div ref={errorPanel} tabIndex={-1} role="alert" className="border-t bg-amber-50 px-4 py-3 text-sm"><p>{active.error}</p><button type="button" disabled={busy} onClick={() => active.errorCode === "conversation_changed" ? void start(department,false,true) : active.terminal ? void start(department, true) : void retryCurrent()} className="mt-2 underline">{active.errorCode === "conversation_changed" ? "Atualizar atendimento" : active.terminal ? "Iniciar nova conversa" : "Tentar novamente"}</button></div>}
          {active?.readOnly && <p role="status" className="border-t bg-purple-50 px-4 py-3 text-sm">Este atendimento foi encerrado. O histórico está disponível para consulta.<button type="button" disabled={busy} onClick={()=>void start(department,true)} className="ml-2 underline">Novo atendimento</button></p>}
          {active?.input?.kind === "contact" && <form onSubmit={e=>void register(e)} className="ph-no-capture min-h-0 space-y-3 overflow-y-auto border-t p-4">
            <p className="text-sm">Seus dados permitem continuar o atendimento com nossa equipe.</p>
            {([['name','Nome','text','name'],['phone','Telefone com DDD','tel','tel'],['email','E-mail','email','email']] as const).map(([field,label,type,autoComplete])=><label key={field} className="block text-sm">{label}<input className="ph-mask mt-1 w-full rounded-xl border p-2.5" type={type} autoComplete={autoComplete} required minLength={field==='name'?2:undefined} maxLength={field==='name'?150:field==='phone'?25:254} value={contact[field]} onChange={e=>setContact(c=>({...c,[field]:e.target.value}))} disabled={busy}/></label>)}
            <label className="flex items-start gap-2 text-xs"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required disabled={busy}/><span>Autorizo a Amélia Saúde a entrar em contato sobre esta solicitação. <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="underline">Privacidade</a></span></label>
            {["identity_conflict","invalid_contact"].includes(active?.errorCode??"") && <button type="button" disabled={busy||!consent} onClick={e=>void register(e,true)} className="block text-left text-sm underline">Preciso atualizar meus dados</button>}
            <button type="submit" style={{ color: "#fff" }} disabled={busy||!consent} className="w-full rounded-xl bg-[var(--amelia-deep)] p-3 text-sm text-white disabled:opacity-40">Iniciar atendimento</button>
          </form>}
          {canType && !active?.handoff && active?.journey && <div className="max-h-44 overflow-y-auto border-t p-3 text-xs" aria-label="Opções da jornada comercial"><div className="flex flex-wrap gap-2">{active.journey.options.map(option => <button key={option.value} type="button" disabled={busy || active.status === "in_progress"} onClick={() => void send(option.value)} className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-left text-sm disabled:opacity-50">{option.label}</button>)}</div></div>}
          {canType && !active?.handoff && !active?.journey && <div className="border-t p-3 text-xs">
            <div className="flex items-center justify-between"><button type="button" className="font-medium underline" onClick={()=>setGuide(guide ? null : 'main')} aria-expanded={!!guide}>Menu de ajuda</button>{guide && guide!=='main' && <button type="button" className="underline" onClick={()=>setGuide('main')}>Voltar ao menu</button>}</div>
            {guide==='main' && <div className="mt-2 grid grid-cols-2 gap-2" aria-label="Opções de atendimento">
              <button type="button" disabled={busy} className="rounded-xl border p-2 text-left" onClick={()=>setGuide('plans')}>Conhecer planos</button>
              <button type="button" disabled={busy} className="rounded-xl border p-2 text-left" onClick={()=>setGuide('network')}>Consultar rede</button>
              <button type="button" disabled={busy} className="rounded-xl border p-2 text-left" onClick={()=>setGuide('qualification')}>Preços e carências</button>
              <button type="button" disabled={busy} className="rounded-xl border p-2 text-left" onClick={()=>void handoff()}>Falar com equipe</button>
            </div>}
            {guide==='plans' && <div className="mt-2 flex flex-wrap gap-2" aria-label="Modalidades de plano">{[['Empresarial (CNPJ)','Quero conhecer os planos empresariais para CNPJ.'],['Por adesão','Quero conhecer os planos coletivos por adesão.'],['Ajude-me a escolher','Ainda não sei qual modalidade de plano posso contratar. Pode me orientar?']].map(([label,text])=><button key={label} type="button" disabled={busy} onClick={()=>void send(text)} className="rounded-xl border p-2">{label}</button>)}</div>}
            {guide==='qualification' && <form onSubmit={qualify} className="ph-no-capture mt-2 max-h-64 space-y-2 overflow-y-auto" aria-label="Dados para cotação">
              <p>Conte o que já souber para prepararmos sua cotação. Você também pode perguntar pelo campo de mensagem.</p>
              <div className="grid grid-cols-2 gap-2">
                <label>Cidade<input maxLength={100} value={qualification.city} onChange={e=>setQualification(q=>({...q,city:e.target.value}))} className="mt-1 w-full rounded-lg border p-2" disabled={busy}/></label>
                <label>Quantidade de pessoas<input type="number" min={1} max={1000} step={1} value={qualification.lives} onChange={e=>setQualification(q=>({...q,lives:e.target.value}))} className="mt-1 w-full rounded-lg border p-2" disabled={busy}/></label>
              </div>
              <label className="block">Idades (separadas por vírgula)<input maxLength={CHAT_MESSAGE_LIMIT} placeholder="Ex.: 28, 34, 7" value={qualification.ages} onChange={e=>setQualification(q=>({...q,ages:e.target.value}))} className="ph-mask mt-1 w-full rounded-lg border p-2" disabled={busy}/></label>
              <label className="block">Modalidade<select value={qualification.modality} onChange={e=>setQualification(q=>({...q,modality:e.target.value}))} className="mt-1 w-full rounded-lg border p-2" disabled={busy}><option value="indefinido">Quero ajuda para escolher</option><option value="empresarial">Empresarial (CNPJ)</option><option value="adesao">Por adesão</option></select></label>
              {qualificationError && <p role="alert">{qualificationError}</p>}
              <button type="submit" style={{color:"#fff"}} disabled={busy} className="w-full rounded-lg bg-[var(--amelia-deep)] p-2 text-white">Pedir cotação</button>
            </form>}
            {guide==='network'  && <form onSubmit={e=>{e.preventDefault();void send(`Consulte a rede credenciada: cidade ${network.city}; especialidade ${network.specialty}; plano ${network.product}. Informe as unidades e a fonte.`);}} className="mt-2 grid grid-cols-2 gap-2">
              <label>Cidade<input required maxLength={100} value={network.city} onChange={e=>setNetwork(n=>({...n,city:e.target.value}))} className="mt-1 w-full rounded-lg border p-2"/></label>
              <label>Especialidade<input required maxLength={100} value={network.specialty} onChange={e=>setNetwork(n=>({...n,specialty:e.target.value}))} className="mt-1 w-full rounded-lg border p-2"/></label>
              <label>Plano<select value={network.product} onChange={e=>setNetwork(n=>({...n,product:e.target.value}))} className="mt-1 w-full rounded-lg border p-2"><option>Carioca 10</option><option>Não sei meu plano</option></select></label>
              <button type="submit" style={{ color: "#fff" }} disabled={busy} className="self-end rounded-lg bg-[var(--amelia-deep)] p-2 text-white">Buscar na rede</button>
            </form>}
          </div>}
          {canType && <form onSubmit={submit} className="flex items-end gap-2 border-t p-3">
            <div className="flex-1"><label htmlFor="amelia-chat-message" className="sr-only">Mensagem para {names[department]}</label><textarea id="amelia-chat-message" className="ph-mask min-h-12 w-full resize-none rounded-xl border border-[var(--amelia-line)] p-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--amelia-purple)]" value={draft} onChange={event => setDraft(event.target.value)} maxLength={department === "sales" ? CHAT_MESSAGE_LIMIT : 1000} rows={2} placeholder={active?.input?.placeholder || "Digite sua mensagem"} disabled={busy} /></div>
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Enviar mensagem" style={{ color: "#fff" }} className="mb-1 rounded-xl bg-[var(--amelia-deep)] p-3 text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2"><Send size={20} /></button>
          </form>}
          {active?.input?.hint && <p className="px-4 pb-2 text-xs text-[var(--amelia-body)]">{active.input.hint}</p>}
        </>}
      </div>
    </dialog>, document.body) : null}
  </>;
}
