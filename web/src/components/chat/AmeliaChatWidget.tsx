"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import ReactMarkdown from "react-markdown";
import { createPortal } from "react-dom";
import { MessageCircle, Send, X, ArrowLeft, Headphones, Sparkles } from "lucide-react";
import { captureChatAttribution, parseChatQualification, type ChatQualification, type ChatRequest, type ChatResponse, type Department, type ChatMessage } from "@/lib/chat";
import { canApplyChatPoll, isTerminalChatError, readPendingChatRequest, restoreChatSession, type PendingChatRequest } from "@/lib/chat-recovery";

type Bubble = { id: string; role: "bot" | "user" | "agent"; text: string; options?: ChatMessage["quickReplies"]; document?: ChatMessage["document"] };
type Session = { token?: string; messages: Bubble[]; input: ChatResponse["input"]; handoff: boolean; crmSynced: boolean; started: boolean; error?: string; terminal?: boolean };
const fresh = (): Session => ({ messages: [], input: null, handoff: false, crmSynced: false, started: false });
const names = { sales: "Vendas", service: "Atendimento" };

async function requestChat(body: ChatRequest): Promise<ChatResponse> {
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(100_000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "chat_unavailable");
  return data;
}

function errorText(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  return code === "invalid_contact" ? "Confira nome, telefone com DDD e e-mail. Não foi possível concluir o cadastro." : code === "chat_busy" ? "Sua mensagem anterior ainda está sendo respondida. Aguarde um instante e tente novamente." : code === "rate_limited" ? "Aguarde um instante antes de enviar outra mensagem." : code === "session_closed" ? "Esta conversa foi encerrada. Inicie uma nova conversa para continuar." : code === "session_expired" ? "Esta conversa expirou. Inicie uma nova conversa para continuar." : "Não foi possível conectar ao chat. Tente novamente em instantes. Sua mensagem não foi confirmada.";
}

export type AmeliaChatHandle = { open: (returnFocus?: HTMLElement | null) => void };
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
  const registrationId = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const externalTrigger = useRef<HTMLElement | null>(null);
  const messageLog = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);
  const pending = useRef<Partial<Record<Department, PendingChatRequest>>>({});
  const revisions = useRef<Record<Department, number>>({ sales: 0, service: 0 });
  const attribution = useRef<ReturnType<typeof captureChatAttribution>>(undefined);
  const active = department ? sessions[department] : null;

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

  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [active?.messages.length, open]);

  useEffect(() => {
    if (!open || !messageLog.current) return;
    const observer = new ResizeObserver(() => end.current?.scrollIntoView({ block: "nearest" }));
    observer.observe(messageLog.current);
    return () => observer.disconnect();
  }, [open, department]);

  const merge = useCallback((target: Department, data: ChatResponse, inbound?: string, polling = false) => {
    try { sessionStorage.setItem(`amelia-chat-session:${target}`, data.token); } catch { /* in-memory session still works */ }
    setSessions(previous => {
      const current = previous[target];
      const messages: Bubble[] = data.history ? [...data.history] : [...current.messages];
      if (inbound && !data.history) messages.push({ id: crypto.randomUUID(), role: "user", text: inbound });
      for (const message of data.messages ?? []) {
        if (!messages.some(item => item.id === message.id)) messages.push({ id: message.id, role: "bot", text: message.text, options: message.quickReplies ?? message.list?.options, document: message.document });
      }
      for (const message of data.agentMessages ?? []) {
        if (!messages.some(item => item.id === message.id)) messages.push({ id: message.id, role: "agent", text: message.text });
      }
      // A slow poll must never overwrite the newer token from a message turn.
      return { ...previous, [target]: { token: polling ? current.token : data.token, messages, input: data.input ?? current.input, handoff: data.handoff, crmSynced: data.crmSynced, started: true } };
    });
  }, []);

  async function start(target: Department, reset = false, retry = false) {
    if (submitting.current) return;
    setDepartment(target);
    if (reset || department !== target) setDraft("");
    // Reopening a department must preserve its conversation, including errors.
    // Only the explicit restart action may discard the established session.
    if (sessions[target].started && !reset && !retry) return;
    submitting.current = true;
    revisions.current[target]++;
    setBusy(true);
    try {
      attribution.current ??= captureChatAttribution(window.location.href, document.referrer);
      let saved: string | null = null;
      try { saved = reset ? null : sessionStorage.getItem(`amelia-chat-session:${target}`); } catch { /* optional */ }
      saved ??= reset ? null : sessions[target].token ?? null;
      if (reset) {
        pending.current[target] = undefined;
        try { sessionStorage.removeItem(`amelia-chat-pending:${target}`); } catch { /* optional */ }
      } else if (saved) {
        try { pending.current[target] = readPendingChatRequest(sessionStorage.getItem(`amelia-chat-pending:${target}`), saved) ?? undefined; } catch { /* optional */ }
        if (pending.current[target]?.body.input) setDraft(pending.current[target]!.body.input!);
        setSessions(previous => ({ ...previous, [target]: { ...previous[target], token: saved! } }));
      }
      const data = await restoreChatSession(saved,
        token => requestChat({ action: "poll", department: target, token }),
        () => requestChat({ action: reset ? "reset" : "start", department: target, attribution: attribution.current }));
      registrationId.current = null;
      if (reset) setSessions(previous => ({ ...previous, [target]: fresh() }));
      merge(target, data);
    } catch (error) {
      setSessions(previous => ({ ...previous, [target]: { ...previous[target], error: errorText(error), terminal: isTerminalChatError(error) || (reset && previous[target].terminal) } }));
    } finally { submitting.current = false; setBusy(false); }
  }

  useImperativeHandle(ref, () => ({
    open(returnFocus) {
      externalTrigger.current = returnFocus ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setOpen(true);
      if (initialDepartment) void start(initialDepartment);
    },
  }));

  async function deliver(body: ChatRequest) {
    const target = body.department;
    submitting.current = true;
    revisions.current[target]++;
    setBusy(true);
    pending.current[target] = { body, savedAt: pending.current[target]?.savedAt ?? Date.now() };
    try { sessionStorage.setItem(`amelia-chat-pending:${target}`, JSON.stringify(pending.current[target])); } catch { /* in-memory retry still works */ }
    try {
      const data = await requestChat(body);
      pending.current[target] = undefined;
      try { sessionStorage.removeItem(`amelia-chat-pending:${target}`); } catch { /* optional */ }
      merge(target, data, body.input);
      setDraft("");
      setGuide(null);
    } catch (error) {
      if (body.input) setDraft(body.input);
      setSessions(previous => ({ ...previous, [target]: { ...previous[target], error: errorText(error), terminal: isTerminalChatError(error) } }));
    } finally { submitting.current = false; setBusy(false); }
  }

  async function send(value: string, details?: ChatQualification) {
    if (!department || !active?.token || active.terminal || submitting.current || !value.trim()) return;
    const waiting = pending.current[department];
    if (waiting) { await deliver(waiting.body); return; }
    await deliver({ action: "message", department, token: active.token, input: value.trim(), request_id: crypto.randomUUID(), ...(details ? { qualification: details } : {}) });
  }

  async function handoff() {
    if (!department || !active?.token || active.terminal || submitting.current) return;
    await deliver(pending.current[department]?.body ?? { action: "handoff", department, token: active.token, request_id: crypto.randomUUID() });
  }

  async function retryCurrent() {
    if (!department || submitting.current) return;
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
    const text = `Quero uma cotação. Modalidade: ${modality}.${details.city ? ` Cidade: ${details.city}.` : ""}${details.lives ? ` Pessoas: ${details.lives}.` : ""}${details.ages ? ` Idades: ${details.ages.join(", ")}.` : ""}`;
    void send(text, details);
  }

  // Poll only the current department; session tokens and pending requests are tab-scoped.
  useEffect(() => {
    if (!open || !department || !active?.token || !active.crmSynced || active.terminal) return;
    let stopped = false;
    let polling = false;
    const timer = window.setInterval(async () => {
      if (submitting.current || polling || document.hidden) return;
      polling = true;
      const revision = revisions.current[department];
      try {
        const data = await requestChat({ action: "poll", department, token: active.token });
        if (!stopped && canApplyChatPoll(revision, revisions.current[department], submitting.current)) merge(department, data, undefined, true);
      } catch (error) {
        if (!stopped && canApplyChatPoll(revision, revisions.current[department], submitting.current)) setSessions(previous => ({ ...previous, [department]: { ...previous[department], error: errorText(error), terminal: isTerminalChatError(error) } }));
      } finally { polling = false; }
    }, 5000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [open, department, active?.token, active?.crmSynced, active?.terminal, merge]);

  async function register(event: FormEvent) {
    event.preventDefault();
    if (!department || !active?.token || submitting.current || !consent) return;
    submitting.current = true; revisions.current[department]++; setBusy(true);
    try {
      registrationId.current ??= crypto.randomUUID();
      const data = await requestChat({action:"register",department,token:active.token,request_id:registrationId.current,contact:{...contact,consent:true},attribution:attribution.current});
      merge(department,data);
    } catch(error) { setSessions(previous=>({...previous,[department]:{...previous[department],error:errorText(error),terminal:isTerminalChatError(error)}})); }
    finally { submitting.current=false;setBusy(false); }
  }

  function submit(event: FormEvent) { event.preventDefault(); void send(draft); }
  const canType = Boolean(active?.token && !active.terminal && department && !pending.current[department] && active.input && !["none", "choice", "contact"].includes(active.input.kind));

  return <>
    {!hideLauncher && <button ref={launcher} type="button" style={{ color: "#fff" }} onClick={() => { setOpen(true); if (initialDepartment) void start(initialDepartment); }} aria-label={children ? undefined : "Fale com a Amélia"} title={children ? undefined : "Fale com a Amélia"} aria-haspopup="dialog" aria-controls="amelia-chat" aria-expanded={open} className={launcherClassName ?? "fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full border-0 bg-[var(--amelia-deep)] p-0 text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--amelia-purple)]"}>
      {children ?? <MessageCircle size={26} aria-hidden="true" />}
    </button>}
    {open ? createPortal(<dialog ref={dialog} id="amelia-chat" aria-labelledby="amelia-chat-title" onCancel={event => { event.preventDefault(); setOpen(false); }} className="ph-no-capture ph-no-autocapture m-auto h-[min(680px,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-[420px] overflow-hidden rounded-3xl border-0 p-0 text-[var(--amelia-deep)] shadow-2xl backdrop:bg-black/35 sm:mb-5 sm:mr-5">
      <div className="flex h-full flex-col bg-white font-sans">
        <header className="flex items-center gap-3 bg-[var(--amelia-deep)] px-4 py-4 text-white">
          {department && !initialDepartment && <button type="button" disabled={busy} aria-label="Escolher vendas ou atendimento" onClick={() => { setDepartment(null); setDraft(""); }} className="rounded-lg p-2 focus-visible:outline-2"><ArrowLeft size={20} /></button>}
          <div className="min-w-0 flex-1"><h2 id="amelia-chat-title" className="text-base font-medium">Amélia Saúde</h2><p className="text-xs text-white/80">{department ? "Assistente virtual · Prévia" : "Como podemos ajudar?"}</p></div>
          <button type="button" aria-label="Fechar chat" onClick={() => setOpen(false)} className="rounded-lg p-2 focus-visible:outline-2"><X size={22} /></button>
        </header>
        {!department ? <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <p className="text-xl">Escolha com quem conversar</p>
          <button type="button" onClick={() => void start("sales")} className="flex w-full items-start gap-3 rounded-2xl border border-[var(--amelia-line)] p-4 text-left hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-[var(--amelia-purple)]"><Sparkles size={22} aria-hidden="true" /><span><strong className="block text-base font-medium">Quero contratar</strong><span className="text-sm text-[var(--amelia-body)]">Conhecer os planos e falar com vendas.</span></span></button>
          <button type="button" onClick={() => void start("service")} className="flex w-full items-start gap-3 rounded-2xl border border-[var(--amelia-line)] p-4 text-left hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-[var(--amelia-purple)]"><Headphones size={22} aria-hidden="true" /><span><strong className="block text-base font-medium">Preciso de atendimento</strong><span className="text-sm text-[var(--amelia-body)]">Ajuda com meu plano Amélia Saúde.</span></span></button>
          <p className="text-xs leading-relaxed text-[var(--amelia-body)]">As conversas de vendas e atendimento são separadas. Consulte nossa <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="underline">Política de Privacidade</a>.</p>
        </div> : <>
          <div ref={messageLog} role="log" aria-label={`Mensagens de ${names[department]}`} aria-live="polite" aria-relevant="additions" className="ph-mask flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
            {active?.messages.map((message, index) => <div key={message.id} className={`max-w-[95%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "ml-auto bg-[var(--amelia-deep)] text-white" : "bg-purple-50"}`}>
              {message.role === "agent" && <p className="mb-1 text-xs font-medium">Equipe Amélia Saúde</p>}
              {message.role === "user" ? <p className="whitespace-pre-wrap break-words">{message.text}</p> : <div className="space-y-2 break-words"><ReactMarkdown components={{
                a: ({ href, children }) => href?.startsWith("https://www.ameliasaude.com.br/")
                  ? <a href={href} target="_blank" rel="noopener noreferrer" className="underline">{children}</a>
                  : <span>{children}</span>,
              }}>{message.text}</ReactMarkdown></div>}
              {message.document && <a href={message.document.url} target="_blank" rel="noopener noreferrer" className="mt-2 block underline">Abrir {message.document.fileName}</a>}
              {message.options && index === (active?.messages.length ?? 0) - 1 && <div className="mt-3 flex flex-wrap gap-2">{message.options.map(option => <button key={option.value} type="button" disabled={busy || active?.terminal} onClick={() => void send(option.value)} className="rounded-xl border border-[var(--amelia-purple)] bg-white px-3 py-2 text-left text-sm disabled:opacity-50 focus-visible:outline-2">{option.label}</button>)}</div>}
            </div>)}
            {busy && <p role="status" className="text-xs text-[var(--amelia-body)]">{active?.started ? "Consultando as informações…" : "Conectando…"}</p>}
            <div ref={end} />
          </div>
          {active?.handoff && <p role="status" className="border-t px-4 py-2 text-xs">Acompanhe a resposta da equipe aqui neste chat.</p>}
          {department && pending.current[department] && !active?.terminal && !busy && <p role="status" className="border-t bg-amber-50 px-4 py-2 text-xs">Há uma solicitação sem confirmação.{pending.current[department]?.body.input && <span className="mt-1 block break-words">{pending.current[department]?.body.input}</span>}{!active?.error && <button type="button" onClick={()=>void retryCurrent()} className="mt-1 underline">Tentar novamente</button>}</p>}
          {active?.error && <div role="alert" className="border-t bg-amber-50 px-4 py-3 text-sm"><p>{active.error}</p><button type="button" disabled={busy} onClick={() => active.terminal ? void start(department, true) : void retryCurrent()} className="mt-2 underline">{active.terminal ? "Iniciar nova conversa" : "Tentar novamente"}</button></div>}
          {active?.input?.kind === "contact" && <form onSubmit={register} className="ph-no-capture min-h-0 space-y-3 overflow-y-auto border-t p-4">
            <p className="text-sm">Seus dados permitem continuar o atendimento com nossa equipe.</p>
            {([['name','Nome','text','name'],['phone','Telefone com DDD','tel','tel'],['email','E-mail','email','email']] as const).map(([field,label,type,autoComplete])=><label key={field} className="block text-sm">{label}<input className="ph-mask mt-1 w-full rounded-xl border p-2.5" type={type} autoComplete={autoComplete} required minLength={field==='name'?2:undefined} maxLength={field==='name'?150:field==='phone'?25:254} value={contact[field]} onChange={e=>setContact(c=>({...c,[field]:e.target.value}))} disabled={busy}/></label>)}
            <label className="flex items-start gap-2 text-xs"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required disabled={busy}/><span>Autorizo a Amélia Saúde a entrar em contato sobre esta solicitação. <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="underline">Privacidade</a></span></label>
            <button type="submit" style={{ color: "#fff" }} disabled={busy||!consent} className="w-full rounded-xl bg-[var(--amelia-deep)] p-3 text-sm text-white disabled:opacity-40">Iniciar atendimento</button>
          </form>}
          {canType && !active?.handoff && <div className="border-t p-3 text-xs">
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
              <label className="block">Idades (separadas por vírgula)<input maxLength={500} placeholder="Ex.: 28, 34, 7" value={qualification.ages} onChange={e=>setQualification(q=>({...q,ages:e.target.value}))} className="ph-mask mt-1 w-full rounded-lg border p-2" disabled={busy}/></label>
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
            <div className="flex-1"><label htmlFor="amelia-chat-message" className="sr-only">Mensagem para {names[department]}</label><textarea id="amelia-chat-message" className="ph-mask min-h-12 w-full resize-none rounded-xl border border-[var(--amelia-line)] p-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--amelia-purple)]" value={draft} onChange={event => setDraft(event.target.value)} maxLength={1000} rows={2} placeholder={active?.input?.placeholder || "Digite sua mensagem"} disabled={busy} /></div>
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Enviar mensagem" style={{ color: "#fff" }} className="mb-1 rounded-xl bg-[var(--amelia-deep)] p-3 text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2"><Send size={20} /></button>
          </form>}
          {active?.input?.hint && <p className="px-4 pb-2 text-xs text-[var(--amelia-body)]">{active.input.hint}</p>}
        </>}
      </div>
    </dialog>, document.body) : null}
  </>;
}
