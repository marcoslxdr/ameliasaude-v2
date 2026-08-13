"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { getButtonClassName } from "@/lib/button-styles";

/**
 * Formulário de cotação — pedido do Marcelo (Amélia) em reunião 12/08:
 * 1) selecionar QUANTAS VIDAS (1..10 ou mais);
 * 2) definir a IDADE de cada vida (duas etapas).
 * Versão emergencial: campo de idade simples por vida (a versão com perfil
 * etário/faixas fica para atualização posterior).
 *
 * ENVIO: e-mail + CRM. O e-mail de destino o Marcelo ia mandar depois —
 * preencher COTACAO_EMAIL quando chegar. CRM: jogar no endpoint quando definido.
 */
const COTACAO_EMAIL = "cotacao@ameliasaude.com.br"; // TODO: confirmar com Marcelo

const MAX_VIDAS = 10;

const vidasOptions = Array.from({ length: MAX_VIDAS }, (_, i) => i + 1);

export function CotacaoForm() {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [vidas, setVidas] = useState<number>(1);
  const [idades, setIdades] = useState<number[]>([]);
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const idadesAtuais = useMemo(() => {
    const arr = [...idades];
    while (arr.length < vidas) arr.push(undefined as unknown as number);
    return arr.slice(0, vidas);
  }, [idades, vidas]);

  const setVida = (index: number, idade: number) => {
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

  const idadesPreenchidas =
    idadesAtuais.length === vidas && idadesAtuais.every((i) => i > 0 && i <= 120);

  const montarCorpo = () =>
    [
      `Quantidade de vidas: ${vidas}`,
      ...idadesAtuais.map(
        (idade, i) => `Vida ${i + 1}: ${idade} anos`
      ),
      "",
      `Nome: ${nome}`,
      `Cidade: ${cidade}`,
      `E-mail: ${email}`,
      `WhatsApp: ${whatsapp}`,
    ].join("\n");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const assunto = encodeURIComponent(
      `Cotação de plano — ${vidas} vida(s)`
    );
    const corpo = encodeURIComponent(montarCorpo());
    window.location.href = `mailto:${COTACAO_EMAIL}?subject=${assunto}&body=${corpo}`;
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

          {etapa === 1 ? (
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
              className="rounded-3xl border border-[var(--amelia-line)] bg-white/85 p-6 shadow-[0_18px_50px_-20px_rgba(36,24,53,0.14)] backdrop-blur-[2px] sm:p-8"
            >
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
                      onChange={(e) => setVida(i, Number(e.target.value))}
                      className={inputClass}
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
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#6b6b6b]">
                    Cidade
                  </span>
                  <input
                    required
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Sua cidade"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#6b6b6b]">
                    E-mail
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className={inputClass}
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
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={
                  !idadesPreenchidas || !nome || !cidade || !email || !whatsapp
                }
                className={`${getButtonClassName("primary", "md")} mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Enviar solicitação de cotação
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
