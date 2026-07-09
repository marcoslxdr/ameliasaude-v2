"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/motion";

function IconMissao({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="24" cy="24" r="18" />
      <path d="M24 14v10l6 6" />
      <path d="M14 24h4" />
      <path d="M30 24h4" />
      <circle cx="24" cy="24" r="3" />
    </svg>
  );
}

function IconVisao({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 24s8-14 20-14 20 14 20 14-8 14-20 14S4 24 4 24z" />
      <circle cx="24" cy="24" r="7" />
      <path d="M24 20v4l2 2" />
    </svg>
  );
}

function IconValores({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M24 4l4.5 9.5L39 15l-7.5 7.5L33 36l-9-5.5-9 5.5 1.5-13.5L9 15l10.5-1.5L24 4z" />
    </svg>
  );
}

type PillarIcon = typeof IconMissao;

const pillars: Array<{
  Icon: PillarIcon;
  num: string;
  title: string;
  hook: string;
  body: string;
}> = [
  {
    Icon: IconMissao,
    num: "01",
    title: "Missão",
    hook: "Cuidado com propósito, gestão responsável.",
    body: "Oferecer assistência médico-hospitalar de excelência, combinando inovação tecnológica, atendimento humanizado e gestão responsável para promover saúde e qualidade de vida a cada beneficiário.",
  },
  {
    Icon: IconVisao,
    num: "02",
    title: "Visão",
    hook: "Referência no RJ até 2030.",
    body: "Ser referência em saúde suplementar no Rio de Janeiro até 2030, reconhecida pela eficiência operacional, cuidado humanizado e uso inteligente de dados para transformar o modo como as pessoas cuidam da própria saúde.",
  },
  {
    Icon: IconValores,
    num: "03",
    title: "Valores",
    hook: "O que norteia cada decisão.",
    body: "A Amélia Saúde é guiada pela empatia, pela inovação com propósito e pela transparência em cada relação. Valorizamos o cuidado humano aliado à tecnologia, a excelência em cada atendimento e a sustentabilidade como compromisso com o futuro da saúde.",
  },
];

export function About() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-heading"
      className="scroll-mt-24 bg-white"
      style={{ padding: "clamp(5rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--amelia-purple)]/25 bg-[var(--amelia-purple)]/[0.07] px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--amelia-purple)]">
              <span className="size-1.5 rounded-full bg-[var(--amelia-purple)]" aria-hidden />
              Conheça a Amélia
            </span>
          </motion.div>

          <motion.h2
            id="sobre-heading"
            variants={fadeUp}
            className="font-display font-normal text-[var(--amelia-deep)]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Saúde completa com tecnologia inteligente e cuidado humanizado
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl font-sans font-light leading-relaxed text-[var(--amelia-body)]"
            style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}
          >
            Um projeto construído por profissionais com anos de experiência, unidos pelo propósito de
            criar uma operadora moderna, transparente e centrada nas pessoas.
          </motion.p>
        </motion.div>

        <motion.ul
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6"
          role="list"
        >
          {pillars.map(({ Icon, num, title, hook, body }) => (
            <motion.li key={title} variants={fadeUp} className="relative min-h-0">
              <article className="group flex h-full flex-col rounded-2xl border border-[var(--amelia-line)] bg-[var(--amelia-surface)] p-6 transition-colors duration-300 motion-safe:md:hover:border-[var(--amelia-purple)]/25 motion-safe:md:hover:bg-[var(--amelia-purple-faint)] lg:p-7">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div
                    aria-hidden
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--amelia-purple-faint)] text-[var(--amelia-purple)]"
                  >
                    <Icon className="size-5 shrink-0 stroke-[1.5]" />
                  </div>
                  <span
                    className="font-display text-2xl font-light leading-none text-[var(--amelia-purple)]/20"
                    aria-hidden
                  >
                    {num}
                  </span>
                </div>

                <h3 className="font-display text-[clamp(1.25rem,2.5vw,1.5rem)] font-normal tracking-wide text-[var(--amelia-deep)]">
                  {title}
                </h3>
                <p className="mt-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-[var(--amelia-purple)]">
                  {hook}
                </p>
                <div className="my-4 h-px w-full bg-[var(--amelia-line)]/50" aria-hidden />
                <p className="font-sans text-sm leading-relaxed text-[var(--amelia-muted)]">
                  {body}
                </p>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
