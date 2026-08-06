"use client";

import Link from "next/link";
import { Building2, Users, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/motion";

const WA_BASE = "https://wa.me/5521971724757";

const products = [
  {
    id: "empresarial",
    badge: "Para empresas (CNPJ)",
    title: "Plano empresarial",
    subtitle: "Para sua empresa",
    description:
      "Plano de saúde coletivo empresarial para empresas com 2 ou mais vidas no Rio de Janeiro e Grande Rio. Ideal para MEI, micro, pequenas e médias empresas que querem oferecer benefício de saúde com contratação via CNPJ.",
    who: [
      "Empresas com CNPJ ativo",
      "A partir de 2 beneficiários",
      "MEI, PME e corporativo",
      "Dependentes conforme contrato",
    ],
    highlights: [
      "Contratação coletiva empresarial",
      "Rede no Rio de Janeiro e Grande Rio",
      "Condições negociadas por perfil de vidas",
      "Suporte comercial para o RH",
    ],
    ctaLabel: "Falar sobre plano empresarial",
    ctaHref: `${WA_BASE}?text=${encodeURIComponent(
      "Olá! Quero informações sobre o plano de saúde empresarial da Amélia Saúde."
    )}`,
    icon: Building2,
    href: "/planos/empresarial",
  },
  {
    id: "adesao",
    badge: "Por categoria profissional",
    title: "Plano coletivo por adesão",
    subtitle: "Pela sua categoria",
    description:
      "Plano de saúde coletivo por adesão via entidades de classe e categorias profissionais no Rio de Janeiro. Para quem tem vínculo com sindicato, conselho, associação ou entidade homologada.",
    who: [
      "Profissionais com vínculo de classe",
      "Sindicatos, conselhos e associações",
      "Você e sua família (conforme regras)",
      "Sem necessidade de CNPJ próprio",
    ],
    highlights: [
      "Contratação via entidade de classe",
      "Modalidade coletiva por adesão",
      "Elegibilidade conforme vínculo aceito",
      "Orientação sobre documentos e portabilidade",
    ],
    ctaLabel: "Falar sobre plano por adesão",
    ctaHref: `${WA_BASE}?text=${encodeURIComponent(
      "Olá! Quero informações sobre o plano coletivo por adesão da Amélia Saúde."
    )}`,
    icon: Users,
    href: "/planos/adesao",
  },
] as const;

const compareRows = [
  {
    label: "Como contrata",
    empresarial: "Via CNPJ da empresa",
    adesao: "Via entidade de classe",
  },
  {
    label: "Quem é elegível",
    empresarial: "Sócios e colaboradores + dependentes",
    adesao: "Profissional vinculado + dependentes",
  },
  {
    label: "Mínimo típico",
    empresarial: "A partir de 2 vidas",
    adesao: "Conforme regras da entidade e produto",
  },
  {
    label: "Território",
    empresarial: "Rio de Janeiro e Grande Rio",
    adesao: "Rio de Janeiro e Grande Rio",
  },
] as const;

export function PlanosContent() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative overflow-hidden border-b border-[var(--amelia-line)]"
          style={{
            padding:
              "clamp(6.5rem, 14vh, 9rem) clamp(1.5rem, 5vw, 5rem) clamp(3rem, 7vh, 4.5rem)",
          }}
        >
          <HeroBackground variant="bloom" />
          <div className="relative z-10 mx-auto max-w-[900px] text-center">
            <motion.div
              variants={staggerContainer(0.08, 0)}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                variants={fadeUp}
                className="mb-6 inline-flex rounded-full border border-[var(--amelia-line)] bg-[var(--amelia-soft)] px-5 py-2.5 font-sans text-[11px] font-normal tracking-[0.1em] text-[var(--amelia-deep)]"
              >
                Planos de saúde · Rio de Janeiro
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="font-display font-normal tracking-tight text-[var(--amelia-deep)]"
                style={{
                  fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                }}
              >
                Planos de saúde empresariais e por adesão no Rio de Janeiro
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mx-auto mt-6 max-w-2xl font-sans font-light leading-relaxed text-[var(--amelia-body)]"
                style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)" }}
              >
                A Amélia Saúde oferece duas modalidades coletivas: plano
                empresarial para empresas de todos os portes e plano coletivo
                por adesão via entidades de classe no Rio de Janeiro e Grande
                Rio.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Product cards */}
        <section
          aria-labelledby="modalidades-heading"
          style={{
            padding:
              "clamp(3.5rem, 8vh, 5.5rem) clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div className="mx-auto max-w-[1140px]">
            <h2
              id="modalidades-heading"
              className="sr-only"
            >
              Modalidades de planos
            </h2>
            <motion.ul
              variants={staggerContainer(0.1, 0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="grid list-none grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10"
            >
              {products.map((product) => {
                const Icon = product.icon;
                return (
                  <motion.li
                    key={product.id}
                    id={product.id}
                    variants={fadeUp}
                    className="flex flex-col overflow-hidden rounded-[1.35rem] border border-[var(--amelia-line)] bg-white shadow-[0_14px_40px_-20px_rgba(36,24,53,0.12)] scroll-mt-28"
                  >
                    <div className="flex flex-1 flex-col p-8 sm:p-10">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--amelia-soft)] text-[var(--amelia-deep)]">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--amelia-purple)]">
                        {product.badge}
                      </span>
                      <h3 className="mt-2 font-display text-[clamp(1.65rem,3vw,2rem)] font-normal tracking-tight text-[var(--amelia-deep)]">
                        {product.subtitle}
                      </h3>
                      <p className="mt-1 font-sans text-sm font-medium text-[var(--amelia-ink)]">
                        {product.title}
                      </p>
                      <p className="mt-4 font-sans text-[0.95rem] font-light leading-relaxed text-[#5c5470]">
                        {product.description}
                      </p>

                      <div className="mt-6">
                        <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[var(--amelia-deep)]">
                          Para quem é
                        </p>
                        <ul className="mt-3 space-y-2">
                          {product.who.map((item) => (
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
                      </div>

                      <div className="mt-6">
                        <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[var(--amelia-deep)]">
                          O que comparar
                        </p>
                        <ul className="mt-3 space-y-2">
                          {product.highlights.map((item) => (
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
                      </div>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button href={product.ctaHref} variant="primary">
                          {product.ctaLabel}
                        </Button>
                        <Link
                          href={product.href}
                          className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-[var(--amelia-deep)] underline-offset-4 hover:underline"
                        >
                          Ver página dedicada
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </section>

        {/* Comparison */}
        <section
          aria-labelledby="comparar-heading"
          className="bg-[var(--amelia-surface)]"
          style={{
            padding:
              "clamp(3.5rem, 8vh, 5rem) clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div className="mx-auto max-w-[900px]">
            <h2
              id="comparar-heading"
              className="text-center font-display text-[clamp(1.75rem,3.5vw,2.25rem)] font-normal tracking-tight text-[var(--amelia-deep)]"
            >
              Qual modalidade combina com você?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center font-sans text-[0.95rem] font-light text-[#5c5470]">
              Use este comparativo como ponto de partida. Elegibilidade,
              rede, cobertura e valores dependem do produto e da proposta
              vigentes.
            </p>

            <div className="mt-10 overflow-x-auto rounded-2xl border border-[var(--amelia-line)] bg-white shadow-[0_10px_30px_-18px_rgba(36,24,53,0.12)]">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--amelia-line)] bg-[var(--amelia-soft)]">
                    <th className="px-5 py-4 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[var(--amelia-deep)]">
                      Critério
                    </th>
                    <th className="px-5 py-4 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[var(--amelia-deep)]">
                      Empresarial
                    </th>
                    <th className="px-5 py-4 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[var(--amelia-deep)]">
                      Por adesão
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-[var(--amelia-line)] last:border-0"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 font-sans text-sm font-medium text-[var(--amelia-ink)]"
                      >
                        {row.label}
                      </th>
                      <td className="px-5 py-4 font-sans text-sm font-light text-[var(--amelia-body)]">
                        {row.empresarial}
                      </td>
                      <td className="px-5 py-4 font-sans text-sm font-light text-[var(--amelia-body)]">
                        {row.adesao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-center font-sans text-sm font-light text-[#5c5470]">
              Ainda em dúvida? Leia o guia{" "}
              <Link
                href="/blog/plano-empresarial-ou-adesao-qual-escolher"
                className="font-medium text-[var(--amelia-deep)] underline-offset-4 hover:underline"
              >
                plano empresarial ou adesão: qual escolher
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CTA */}
        <section
          className="relative overflow-hidden"
          style={{
            padding:
              "clamp(3.5rem, 8vh, 5.5rem) clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <HeroBackground variant="haze" />
          <div className="relative z-10 mx-auto max-w-[640px] text-center">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.25rem)] font-normal tracking-tight text-[var(--amelia-deep)]">
              Fale com a Amélia Saúde
            </h2>
            <p className="mt-4 font-sans text-[0.95rem] font-light leading-relaxed text-[#5c5470]">
              Nosso time orienta sobre elegibilidade, rede e a modalidade mais
              adequada — sem prometer preço ou cobertura sem a proposta
              formal.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href={`${WA_BASE}?text=${encodeURIComponent(
                  "Olá! Quero ajuda para escolher entre plano empresarial e por adesão."
                )}`}
                variant="primary"
              >
                WhatsApp comercial
              </Button>
              <Button href="/#contato" variant="outline">
                Outros canais
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
