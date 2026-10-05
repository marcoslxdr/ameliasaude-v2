"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, X, ArrowLeft, Headphones, Sparkles } from "lucide-react";
import type { ChatRequest, ChatResponse, Department, ChatMessage } from "@/lib/chat";

type Bubble = { id: string; role: "bot" | "user" | "agent"; text: string; options?: ChatMessage["quickReplies"]; document?: ChatMessage["document"] };
type Session = { token?: string; messages: Bubble[]; input: ChatResponse["input"]; handoff: boolean; crmSynced: boolean; started: boolean; error?: string; terminal?: boolean };
const fresh = (): Session => ({ messages: [], input: null, handoff: false, crmSynced: false, started: false });
const names = { sales: "Vendas", service: "Atendimento" };

async function requestChat(body: ChatRequest): Promise<ChatResponse> {
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(30_000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "chat_unavailable");
  return data;
}

function errorText(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  return code === "rate_limited" ? "Aguarde um instante antes de enviar outra mensagem." : code === "session_closed" ? "Esta conversa foi encerrada. Inicie uma nova conversa para continuar." : code === "session_expired" ? "Esta conversa expirou. Inicie uma nova conversa para continuar." : "Não foi possível conectar ao chat. Tente novamente em instantes. Sua mensagem não foi confirmada.";
}

function terminalError(error: unknown) {
  return error instanceof Error && ["session_closed", "session_expired"].includes(error.message);
}

export function AmeliaChatWidget() {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState<Department | null>(null);
  const [sessions, setSessions] = useState<Record<Department, Session>>({ sales: fresh(), service: fresh() });
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const messageLog = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);
  const active = department ? sessions[department] : null;

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current?.close();
  }, [open]);

  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [active?.messages.length, open]);

  useEffect(() => {
    if (!open || !messageLog.current) return;
    const observer = new ResizeObserver(() => end.current?.scrollIntoView({ block: "nearest" }));
    observer.observe(messageLog.current);
    return () => observer.disconnect();
  }, [open, department]);

  const merge = useCallback((target: Department, data: ChatResponse, inbound?: string, polling = false) => {
    setSessions(previous => {
      const current = previous[target];
      const messages = [...current.messages];
      if (inbound) messages.push({ id: crypto.randomUUID(), role: "user", text: inbound });
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

  async function start(target: Department, reset = false) {
    if (submitting.current) return;
    setDepartment(target);
    setDraft("");
    // Reopening a department must preserve its conversation, including errors.
    // Only the explicit restart action may discard the established session.
    if (sessions[target].started && !reset) return;
    submitting.current = true;
    setBusy(true);
    try {
      const data = await requestChat({ action: reset ? "reset" : "start", department: target });
      setSessions(previous => ({ ...previous, [target]: fresh() }));
      merge(target, data);
    } catch (error) {
      setSessions(previous => ({ ...previous, [target]: { ...previous[target], error: errorText(error), terminal: terminalError(error) } }));
    } finally { submitting.current = false; setBusy(false); }
  }

  async function send(value: string) {
    if (!department || !active?.token || active.terminal || submitting.current || !value.trim()) return;
    const target = department;
    submitting.current = true;
    setBusy(true);
    try {
      const data = await requestChat({ action: "message", department: target, token: active.token, input: value.trim() });
      merge(target, data, value.trim());
      setDraft("");
    } catch (error) {
      setDraft(value);
      setSessions(previous => ({ ...previous, [target]: { ...previous[target], error: errorText(error), terminal: terminalError(error) } }));
    } finally { submitting.current = false; setBusy(false); }
  }

  // Poll only the current department. Tokens remain in memory, scoped to each conversation.
  useEffect(() => {
    if (!open || !department || !active?.token || !active.crmSynced || active.terminal) return;
    let stopped = false;
    let polling = false;
    const timer = window.setInterval(async () => {
      if (submitting.current || polling || document.hidden) return;
      polling = true;
      try {
        const data = await requestChat({ action: "poll", department, token: active.token });
        if (!stopped) merge(department, data, undefined, true);
      } catch (error) {
        if (!stopped) setSessions(previous => ({ ...previous, [department]: { ...previous[department], error: errorText(error), terminal: terminalError(error) } }));
      } finally { polling = false; }
    }, 5000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [open, department, active?.token, active?.crmSynced, active?.terminal, merge]);

  function submit(event: FormEvent) { event.preventDefault(); void send(draft); }
  const canType = Boolean(active?.token && !active.terminal && active.input && !["none", "choice"].includes(active.input.kind));

  return <>
    <button ref={launcher} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-controls="amelia-chat" aria-expanded={open} className="fixed bottom-5 right-5 z-[90] flex min-h-12 items-center gap-2 rounded-full bg-[var(--amelia-deep)] px-5 py-3 font-sans text-sm text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--amelia-purple)]">
      <MessageCircle size={21} aria-hidden="true" /> Fale com a Amélia
    </button>
    <dialog ref={dialog} id="amelia-chat" aria-labelledby="amelia-chat-title" onCancel={event => { event.preventDefault(); setOpen(false); }} onClose={() => { if (!dialog.current?.open) launcher.current?.focus(); }} className="ph-no-capture ph-no-autocapture m-auto h-[min(680px,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-[420px] overflow-hidden rounded-3xl border-0 p-0 text-[var(--amelia-deep)] shadow-2xl backdrop:bg-black/35 sm:mb-5 sm:mr-5">
      <div className="flex h-full flex-col bg-white font-sans">
        <header className="flex items-center gap-3 bg-[var(--amelia-deep)] px-4 py-4 text-white">
          {department && <button type="button" disabled={busy} aria-label="Escolher vendas ou atendimento" onClick={() => { setDepartment(null); setDraft(""); }} className="rounded-lg p-2 focus-visible:outline-2"><ArrowLeft size={20} /></button>}
          <div className="min-w-0 flex-1"><h2 id="amelia-chat-title" className="text-base font-medium">Amélia Saúde</h2><p className="text-xs text-white/80">{department ? names[department] : "Como podemos ajudar?"}</p></div>
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
              <p className="whitespace-pre-wrap break-words">{message.text}</p>
              {message.document && <a href={message.document.url} target="_blank" rel="noopener noreferrer" className="mt-2 block underline">Abrir {message.document.fileName}</a>}
              {message.options && index === (active?.messages.length ?? 0) - 1 && <div className="mt-3 flex flex-wrap gap-2">{message.options.map(option => <button key={option.value} type="button" disabled={busy || active?.terminal} onClick={() => void send(option.value)} className="rounded-xl border border-[var(--amelia-purple)] bg-white px-3 py-2 text-left text-sm disabled:opacity-50 focus-visible:outline-2">{option.label}</button>)}</div>}
            </div>)}
            {busy && <p role="status" className="text-xs text-[var(--amelia-body)]">Conectando…</p>}
            <div ref={end} />
          </div>
          {active?.handoff && <p role="status" className="border-t px-4 py-2 text-xs">Acompanhe a resposta da equipe aqui neste chat.</p>}
          {active?.error && <div role="alert" className="border-t bg-amber-50 px-4 py-3 text-sm"><p>{active.error}</p><button type="button" disabled={busy} onClick={() => void start(department, true)} className="mt-2 underline">Iniciar nova conversa</button></div>}
          {canType && <form onSubmit={submit} className="flex items-end gap-2 border-t p-3">
            <div className="flex-1"><label htmlFor="amelia-chat-message" className="sr-only">Mensagem para {names[department]}</label><textarea id="amelia-chat-message" className="ph-mask min-h-12 w-full resize-none rounded-xl border border-[var(--amelia-line)] p-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--amelia-purple)]" value={draft} onChange={event => setDraft(event.target.value)} maxLength={1000} rows={2} placeholder={active?.input?.placeholder || "Digite sua mensagem"} disabled={busy} /></div>
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Enviar mensagem" className="mb-1 rounded-xl bg-[var(--amelia-deep)] p-3 text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2"><Send size={20} /></button>
          </form>}
          {active?.input?.hint && <p className="px-4 pb-2 text-xs text-[var(--amelia-body)]">{active.input.hint}</p>}
        </>}
      </div>
    </dialog>
  </>;
}
