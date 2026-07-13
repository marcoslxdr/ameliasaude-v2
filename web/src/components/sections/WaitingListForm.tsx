"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp, viewportConfig } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function inputBase(hasError: boolean): string {
  return [
    "w-full rounded-xl border bg-white/80 px-4 py-3 font-sans text-sm",
    "text-[#1a1a1a] placeholder:text-[#a8a8a8]",
    "transition-[border-color,box-shadow] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
    hasError
      ? "border-red-400 focus-visible:ring-red-300"
      : "border-[var(--amelia-line)] focus-visible:border-[var(--amelia-purple)] focus-visible:ring-[var(--amelia-purple])/30",
  ].join(" ");
}

const planOptions = [
  { value: "", label: "Qual plano você tem interesse?" },
  { value: "individual", label: "Individual" },
  { value: "familiar", label: "Familiar" },
  { value: "empresarial", label: "Empresarial" },
] as const;

interface WaitingListFormProps {
  onSuccess?: () => void;
}

export function WaitingListForm({ onSuccess }: WaitingListFormProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setInteresse("");
    setStatus("idle");
    setErrorMsg("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waiting-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, interesse }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMsg(data.error || "Erro ao enviar. Tente novamente.");
        track("waiting_list_error", { error: data.error || `HTTP ${res.status}` });
        return;
      }

      setStatus("success");
      track("waiting_list_submitted", {
        interesse: interesse || "nao_especificado",
        has_telefone: !!telefone,
      });
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch {
      setStatus("error");
      setErrorMsg("Erro de conexão. Verifique sua internet e tente novamente.");
      track("waiting_list_error", { error: "network" });
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(123,109,178,0.12)] text-[var(--amelia-deep)]">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </span>
          <h2
            className="mb-4 font-display font-normal uppercase text-[var(--amelia-deep)]"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Inscrição confirmada!
          </h2>
          <p className="mx-auto max-w-[32rem] font-sans font-light leading-relaxed text-[var(--amelia-body)]" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}>
            Recebemos seus dados e entraremos em contato assim que houver novidades sobre os planos Amélia Saúde.
          </p>
          <div className="mt-6">
            <Button variant="outline" size="sm" onClick={resetForm}>
              Nova inscrição
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="mb-3 font-sans text-[11px] font-normal tracking-[0.12em] text-[var(--amelia-purple)]">
          Lista de Espera
        </p>
        <h2
          className="font-display font-normal uppercase text-[var(--amelia-deep)]"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          Quer ser Amélia?
        </h2>
        <p className="mx-auto mt-3 max-w-[32rem] font-sans font-light leading-relaxed text-[var(--amelia-body)]" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}>
          Deixe seus dados para entrar na lista de espera da Amélia Saúde.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-[480px]">
        <div className="mb-4">
          <label htmlFor="wl-nome" className="sr-only">Nome completo</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--amelia-purple)]">
              <IconUser className="h-[18px] w-[18px]" />
            </span>
            <input
              id="wl-nome"
              type="text"
              required
              minLength={2}
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputBase(status === "error" && !nome)}
              autoComplete="name"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="wl-email" className="sr-only">Email</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--amelia-purple)]">
              <IconMail className="h-[18px] w-[18px]" />
            </span>
            <input
              id="wl-email"
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase(status === "error" && !email)}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="wl-telefone" className="sr-only">Telefone (opcional)</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--amelia-purple)]">
              <IconPhone className="h-[18px] w-[18px]" />
            </span>
            <input
              id="wl-telefone"
              type="tel"
              placeholder="Telefone (opcional)"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className={inputBase(false)}
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="wl-interesse" className="sr-only">Plano de interesse</label>
          <select
            id="wl-interesse"
            value={interesse}
            onChange={(e) => setInteresse(e.target.value)}
            className={`${inputBase(false)} appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'16'%20height%3D'16'%20fill%3D'none'%20stroke%3D'%237b6db2'%20stroke-width%3D'1.75'%20viewBox%3D'0%200%2024%2024'%3E%3Cpath%20d%3D'm6%209%206%206%206-6'%2F%3E%3C%2Fsvg%3E")] bg-[length:18px_18px] bg-[right_14px_center] bg-no-repeat pr-10`}
          >
            {planOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <AnimatePresence>
          {status === "error" && errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-4 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-center font-sans text-sm text-red-700 backdrop-blur-[2px]"
              role="alert"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enviando...
              </span>
            ) : (
              "Entrar na lista de espera"
            )}
          </Button>
        </div>

        <p className="mt-5 text-center font-sans text-[12px] text-[#8a8a8a]">
          Seus dados estão seguros. Usaremos apenas para contato sobre disponibilidade de planos.
        </p>
      </form>
    </div>
  );
}
