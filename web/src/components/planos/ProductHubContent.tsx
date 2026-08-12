"use client";

import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/motion";

export type ProductHubVariant = "empresarial" | "adesao";

const CENTRAL_HREF = "tel:+552126400777";

const copy: Record<
  ProductHubVariant,
  {
    badge: string;
    h1: string;
    lead: string;
    whoTitle: string;
    who: string[];
    diffs: string[];
    faqs: { q: string; a: string }[];
    ctaLabel: string;
    ctaHref: string;
    otherLabel: string;
    otherHref: string;
  }
> = {
  empresarial: {
    badge: "Plano coletivo empresarial",
    h1: "Plano de saúde empresarial Amélia Saúde | Rio de Janeiro",
    lead: "Modalidade coletiva empresarial para empresas com CNPJ no Rio de Janeiro e Grande Rio. A partir de 2 vidas, com condições alinhadas ao perfil do grupo e suporte para o RH.",
    whoTitle: "Quem pode contratar",
    who: [
      "Empresas com CNPJ ativo",
      "MEI, micro, pequenas e médias empresas",
      "Grupos a partir de 2 beneficiários",
      "Dependentes conforme regras do produto",
    ],
    diffs: [
      "Contratação via empresa (CNPJ)",
      "Rede e cobertura conforme proposta e contrato",
      "Orientação comercial para comparação de produtos",
      "Atendimento sem burocracia desnecessária",
    ],
    faqs: [
      {
        q: "A partir de quantas vidas?",
        a: "A referência institucional é a partir de 2 beneficiários. Confirme o mínimo e as condições na proposta vigente.",
      },
      {
        q: "Serve para MEI?",
        a: "Empresas com CNPJ, incluindo MEI, podem avaliar a modalidade empresarial. Elegibilidade e documentação dependem do produto.",
      },
      {
        q: "Posso incluir dependentes?",
        a: "Sim, conforme regras do contrato (cônjuge, filhos e demais graus aceitos no produto).",
      },
    ],
    ctaLabel: "Falar sobre plano empresarial",
    ctaHref: CENTRAL_HREF,
    otherLabel: "Ver plano por adesão",
    otherHref: "/planos/adesao",
  },
  adesao: {
    badge: "Plano coletivo por adesão",
    h1: "Plano de saúde coletivo por adesão Amélia Saúde | Rio de Janeiro",
    lead: "Modalidade coletiva por adesão para profissionais vinculados a entidades de classe — sindicatos, conselhos e associações — no Rio de Janeiro e Grande Rio.",
    whoTitle: "Quem pode contratar",
    who: [
      "Profissionais com vínculo aceito pela entidade",
      "Associados a sindicatos, conselhos ou associações",
      "Você e dependentes, conforme regras do produto",
      "Sem necessidade de contratar via CNPJ próprio",
    ],
    diffs: [
      "Contratação mediada por entidade de classe",
      "Elegibilidade depende do vínculo e da entidade",
      "Orientação sobre documentos e portabilidade",
      "Rede e cobertura conforme proposta e contrato",
    ],
    faqs: [
      {
        q: "Preciso de CNPJ?",
        a: "Não para a modalidade por adesão. O caminho típico é o vínculo com uma entidade de classe homologada.",
      },
      {
        q: "Qualquer categoria profissional entra?",
        a: "Não. A elegibilidade depende das entidades e categorias aceitas no produto vigente.",
      },
      {
        q: "Posso levar a família?",
        a: "Dependentes podem ser incluídos conforme as regras do contrato e da entidade.",
      },
    ],
    ctaLabel: "Falar sobre plano por adesão",
    ctaHref: CENTRAL_HREF,
    otherLabel: "Ver plano empresarial",
    otherHref: "/planos/empresarial",
  },
};

export function ProductHubContent({ variant }: { variant: ProductHubVariant }) {
  const c = copy[variant];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        <section
          className="relative overflow-hidden border-b border-[var(--amelia-line)]"
          style={{
            padding:
              "clamp(6.5rem, 14vh, 9rem) clamp(1.5rem, 5vw, 5rem) clamp(3rem, 7vh, 4.5rem)",
          }}
        >
          <HeroBackground variant="bloom" />
          <div className="relative z-10 mx-auto max-w-[800px]">
            <motion.div
              variants={staggerContainer(0.08, 0)}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp}>
                <Link
                  href="/planos"
                  className="mb-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-[var(--amelia-deep)] hover:underline underline-offset-4"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Todos os planos
                </Link>
              </motion.div>
              <motion.span
                variants={fadeUp}
                className="mb-4 inline-flex rounded-full border border-[var(--amelia-line)] bg-[var(--amelia-soft)] px-4 py-2 font-sans text-[11px] font-normal tracking-[0.1em] text-[var(--amelia-deep)]"
              >
                {c.badge}
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="font-display font-normal tracking-tight text-[var(--amelia-deep)]"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {c.h1}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-2xl font-sans font-light leading-relaxed text-[var(--amelia-body)]"
                style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.15rem)" }}
              >
                {c.lead}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <Button href={c.ctaHref} variant="primary">
                  {c.ctaLabel}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section
          style={{
            padding: "clamp(3rem, 7vh, 4.5rem) clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div className="mx-auto grid max-w-[960px] gap-10 md:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              <h2 className="font-display text-2xl font-normal text-[var(--amelia-deep)]">
                {c.whoTitle}
              </h2>
              <ul className="mt-4 space-y-3">
                {c.who.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-sans text-sm font-light text-[var(--amelia-body)]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--amelia-purple)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              <h2 className="font-display text-2xl font-normal text-[var(--amelia-deep)]">
                Diferenciais a conferir
              </h2>
              <ul className="mt-4 space-y-3">
                {c.diffs.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-sans text-sm font-light text-[var(--amelia-body)]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--amelia-purple)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section
          className="bg-[var(--amelia-surface)]"
          aria-labelledby="faq-heading"
          style={{
            padding: "clamp(3rem, 7vh, 4.5rem) clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div className="mx-auto max-w-[720px]">
            <h2
              id="faq-heading"
              className="font-display text-2xl font-normal text-[var(--amelia-deep)]"
            >
              Perguntas frequentes
            </h2>
            <dl className="mt-6 space-y-5">
              {c.faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[var(--amelia-line)] bg-white p-5"
                >
                  <dt className="font-sans text-sm font-semibold text-[var(--amelia-ink)]">
                    {faq.q}
                  </dt>
                  <dd className="mt-2 font-sans text-sm font-light leading-relaxed text-[var(--amelia-body)]">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 font-sans text-sm font-light text-[#5c5470]">
              Compare também a outra modalidade:{" "}
              <Link
                href={c.otherHref}
                className="font-medium text-[var(--amelia-deep)] underline-offset-4 hover:underline"
              >
                {c.otherLabel}
              </Link>{" "}
              ·{" "}
              <Link
                href="/planos"
                className="font-medium text-[var(--amelia-deep)] underline-offset-4 hover:underline"
              >
                visão geral dos planos
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
