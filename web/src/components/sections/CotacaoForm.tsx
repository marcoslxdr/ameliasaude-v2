"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { getButtonClassName } from "@/lib/button-styles";
import {
  extractAttribution,
  validateAndNormalizeCotacao,
} from "@/lib/cotacao";

/**
 * Formulário de cotação — pedido do Marcelo (Amélia) em reunião 12/08:
 * 1) selecionar QUANTAS VIDAS (1..10 ou mais);
 * 2) definir a IDADE de cada vida (duas etapas).
 * Versão emergencial: campo de idade simples por vida (a versão com perfil
 * etário/faixas fica para atualização posterior).
 *
 * ENVIO: POST /api/cotacao → CRM (server-side). Sem mailto.
 */
const MAX_VIDAS = 10;
const WHATSAPP_HREF = "https://wa.me/552126400777";

const vidasOptions = Array.from({ length: MAX_VIDAS }, (_, i) => i + 1);

type FormStatus = "idle" | "submitting" | "success" | "error";

function trackCotacao(
  event:
    | "cotacao_submit_started"
    | "cotacao_submit_success"
    | "cotacao_submit_error",
  properties: { livesCount: number; pathname: string; error?: string },
) {
  try {
    posthog.capture(event, properties);
  } catch {
    // never break UX for analytics
  }
}

function clientErrorMessage(code: string): string {
  switch (code) {
    case "invalid_lives_ages":
      return "Confira a quantidade de vidas e as idades informadas.";
    case "consent_required":
      return "É necessário aceitar a Política de Privacidade para enviar.";
    case "invalid_email":
      return "Informe um e-mail válido.";
    case "invalid_whatsapp":
      return "Informe um WhatsApp válido com DDD.";
    case "rate_limited":
      return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
    default:
      return "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
  }
}

function safeErrorCode(status: number, body: unknown): string {
  if (body && typeof body === "object" && "error" in body) {
    const error = (body as { error?: unknown }).error;
    if (typeof error === "string" && /^[a-z0-9_]{1,64}$/.test(error)) {
      return error;
    }
  }
  if (status === 429) return "rate_limited";
  if (status === 400) return "validation";
  if (status === 502 || status === 503) return "unavailable";
  return "server_error";
}

export function CotacaoForm() {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [vidas, setVidas] = useState<number>(1);
  const [idades, setIdades] = useState<Array<number | undefined>>([]);
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const requestIdRef = useRef("");
  const submittingRef = useRef(false);

  const idadesAtuais = useMemo(() => {
    const arr = [...idades];
    while (arr.length < vidas) arr.push(undefined);
    return arr.slice(0, vidas);
  }, [idades, vidas]);

  const setVida = (index: number, idade: number | undefined) => {
    const arr = [...idadesAtuais];
    arr[index] = idade;
    setIdades(arr);
  };

  const selecionarVidas = (n: number) => {
    setVidas(n);
    setIdades(Array(n).fill(undefined));
    setEtapa(2);
  };

  const voltar = () => setEtapa(1);

  const ensureRequestId = () => {
    if (!requestIdRef.current) {
      requestIdRef.current = crypto.randomUUID();
    }
    return requestIdRef.current;
  };

  const recomecar = () => {
    requestIdRef.current = "";
    submittingRef.current = false;
    setEtapa(1);
    setVidas(1);
    setIdades([]);
    setNome("");
    setCidade("");
    setWhatsapp("");
    setEmail("");
    setConsent(false);
    setWebsite("");
    setStatus("idle");
    setErrorMessage("");
  };

  const idadesPreenchidas =
    idadesAtuais.length === vidas &&
    idadesAtuais.every(
      (idade) =>
        typeof idade === "number" &&
        Number.isInteger(idade) &&
        idade >= 0 &&
        idade <= 120,
    );

  const canSubmit =
    idadesPreenchidas &&
    nome.trim().length >= 2 &&
    cidade.trim().length >= 2 &&
    Boolean(email && whatsapp && consent) &&
    status !== "submitting";

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || status === "submitting") return;

    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "/cotacao";
    const pageUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "https://www.ameliasaude.com.br/cotacao";
    const referrer =
      typeof document !== "undefined" ? document.referrer || undefined : undefined;
    const source = extractAttribution({ pageUrl, referrer });
    const payload = {
      requestId: ensureRequestId(),
      name: nome,
      city: cidade,
      email,
      whatsapp,
      livesCount: vidas,
      ages: idadesAtuais.map((idade) => Number(idade)),
      consent,
      consentAt: new Date().toISOString(),
      source,
      website,
    };

    const local = validateAndNormalizeCotacao(payload);
    if (!local.success) {
      setStatus("error");
      setErrorMessage(clientErrorMessage(local.code));
      trackCotacao("cotacao_submit_error", {
        livesCount: vidas,
        pathname,
        error: local.code,
      });
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setErrorMessage("");
    trackCotacao("cotacao_submit_started", { livesCount: vidas, pathname });

    try {
      const response = await fetch("/api/cotacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      if (response.ok) {
        requestIdRef.current = "";
        setStatus("success");
        trackCotacao("cotacao_submit_success", { livesCount: vidas, pathname });
        return;
      }

      const code = safeErrorCode(response.status, body);
      setStatus("error");
      setErrorMessage(clientErrorMessage(code));
      trackCotacao("cotacao_submit_error", {
        livesCount: vidas,
        pathname,
        error: code,
      });
    } catch {
      setStatus("error");
      setErrorMessage(clientErrorMessage("network"));
      trackCotacao("cotacao_submit_error", {
        livesCount: vidas,
        pathname,
        error: "network",
      });
    } finally {
      submittingRef.current = false;
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--amelia-line)] bg-white px-4 py-3 font-sans text-[15px] text-[var(--amelia-deep)] outline-none transition-colors focus:border-[var(--amelia-purple)] focus:ring-2 focus:ring-[rgba(123,107,178,0.25)]";

  return (
    <section
      id="cotacao"
      className="relative overflow-hidden"
      style={{
        padding:
          "clamp(4.5rem, 9vh, 6.5rem) clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      <HeroBackground variant="bloom" />
      <div className="relative z-10 mx-auto w-full max-w-[760px]">
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <span className="mb-4 inline-flex rounded-full border border-[var(--amelia-line)] bg-[var(--amelia-soft)] px-4 py-2 font-sans text-[11px] font-normal tracking-[0.1em] text-[var(--amelia-deep)]">
              Simule seu plano
            </span>
            <h2
              className="mt-3 font-display font-normal uppercase text-[var(--amelia-deep)]"
              style={{
                fontSize: "clamp(1.9rem, 4.2vw, 2.8rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Quantas vidas você precisa?
            </h2>
            <p
              className="mx-auto mt-4 max-w-[34rem] font-sans font-light leading-relaxed text-[var(--amelia-body)]"
              style={{ fontSize: "clamp(1rem, 1.7vw, 1.15rem)" }}
            >
              Selecione a quantidade de vidas e informe a idade de cada uma —
              assim enviamos a proposta certa para o seu perfil.
            </p>
          </motion.div>

          {status === "success" ? (
            <motion.div
              key="success"
              variants={fadeUp}
              className="rounded-3xl border border-[var(--amelia-line)] bg-white/85 p-6 shadow-[0_18px_50px_-20px_rgba(36,24,53,0.14)] backdrop-blur-[2px] sm:p-8"
              role="status"
              aria-live="polite"
            >
              <p className="text-center font-sans text-[15px] leading-relaxed text-[var(--amelia-deep)]">
                Recebemos sua solicitação. Nossa equipe entra em contato em breve.
              </p>
              <button
                type="button"
                onClick={recomecar}
                className={`${getButtonClassName("primary", "md")} mt-6 w-full`}
              >
                Recomeçar
              </button>
            </motion.div>
          ) : etapa === 1 ? (
            <motion.div
              key="etapa1"
              variants={fadeUp}
              className="rounded-3xl border border-[var(--amelia-line)] bg-white/85 p-6 shadow-[0_18px_50px_-20px_rgba(36,24,53,0.14)] backdrop-blur-[2px] sm:p-8"
            >
              <p className="mb-4 font-sans text-sm font-medium text-[var(--amelia-deep)]">
                Quantas vidas? (1 a {MAX_VIDAS} ou mais)
              </p>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {vidasOptions.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => selecionarVidas(n)}
                    className="rounded-xl border border-[var(--amelia-line)] bg-white py-3 font-sans text-[15px] font-medium text-[var(--amelia-deep)] transition-all hover:border-[var(--amelia-purple)] hover:bg-[var(--amelia-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--amelia-purple)]"
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => selecionarVidas(11)}
                className="mt-3 w-full rounded-xl border border-dashed border-[var(--amelia-purple)] bg-[var(--amelia-soft)]/60 py-3 font-sans text-[15px] font-medium text-[var(--amelia-purple)] transition-colors hover:bg-[var(--amelia-soft)]"
              >
                10 ou mais vidas
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="etapa2"
              variants={fadeUp}
              onSubmit={enviar}
              aria-busy={status === "submitting"}
              className="relative rounded-3xl border border-[var(--amelia-line)] bg-white/85 p-6 shadow-[0_18px_50px_-20px_rgba(36,24,53,0.14)] backdrop-blur-[2px] sm:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden opacity-0"
              >
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <div className="mb-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={voltar}
                  className="font-sans text-sm font-medium text-[var(--amelia-purple)] hover:underline"
                >
                  ← Alterar quantidade
                </button>
                <span className="font-sans text-sm text-[#6b6b6b]">
                  {vidas} {vidas === 1 ? "vida" : "vidas"}
                </span>
              </div>

              <p className="mb-4 font-sans text-sm font-medium text-[var(--amelia-deep)]">
                Idade de cada vida
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {idadesAtuais.map((idade, i) => (
                  <label key={i} className="flex flex-col gap-1.5">
                    <span className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#6b6b6b]">
                      Vida {i + 1}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      inputMode="numeric"
                      placeholder="Idade"
                      value={idade ?? ""}
                      onChange={(e) =>
                        setVida(
                          i,
                          e.target.value === "" ? undefined : Number(e.target.value),
                        )
                      }
                      className={inputClass}
                      disabled={status === "submitting"}
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#6b6b6b]">
                    Nome
                  </span>
                  <input
                    required
                    type="text"
                    minLength={2}
                    maxLength={120}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className={inputClass}
                    disabled={status === "submitting"}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#6b6b6b]">
                    Cidade
                  </span>
                  <input
                    required
                    type="text"
                    minLength={2}
                    maxLength={120}
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Sua cidade"
                    className={inputClass}
                    disabled={status === "submitting"}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#6b6b6b]">
                    E-mail
                  </span>
                  <input
                    required
                    type="email"
                    maxLength={255}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className={inputClass}
                    disabled={status === "submitting"}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#6b6b6b]">
                    WhatsApp
                  </span>
                  <input
                    required
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(21) 99999-9999"
                    className={inputClass}
                    disabled={status === "submitting"}
                  />
                </label>
              </div>

              <label className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--amelia-purple)] bg-[var(--amelia-soft)] p-4">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={status === "submitting"}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--amelia-purple)]"
                />
                <span className="font-sans text-sm leading-relaxed text-[var(--amelia-deep)]">
                  Concordo com o tratamento dos meus dados para receber a
                  cotação, conforme a{" "}
                  <Link
                    href="/privacidade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--amelia-purple)] underline underline-offset-2"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </span>
              </label>

              {status === "error" ? (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mt-4 rounded-xl border border-[#e8c4c4] bg-[#fdf2f2] p-4"
                >
                  <p className="font-sans text-sm leading-relaxed text-[var(--amelia-deep)]">
                    {errorMessage}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle");
                        setErrorMessage("");
                      }}
                      className="font-sans text-sm font-medium text-[var(--amelia-purple)] underline underline-offset-2"
                    >
                      Tentar novamente
                    </button>
                    <a
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm font-medium text-[var(--amelia-purple)] underline underline-offset-2"
                    >
                      Falar no WhatsApp
                    </a>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit}
                className={`${getButtonClassName("primary", "md")} mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {status === "submitting"
                  ? "Enviando..."
                  : "Enviar solicitação de cotação"}
              </button>
              <p className="mt-3 text-center font-sans text-xs text-[#8a8a8a]">
                Seus dados são usados apenas para enviar sua proposta. Nada de spam.
              </p>
            </motion.form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
