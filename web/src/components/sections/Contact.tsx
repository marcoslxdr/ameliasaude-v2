"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp, viewportConfig } from "@/lib/motion";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { getButtonClassName } from "@/lib/button-styles";
import { trackContactClick } from "@/lib/analytics";

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function IconHeadset({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 18v-6a9 9 0 0118 0v6" />
      <path d="M21 19a2 2 0 01-2 2h-1v-5h3v3zM3 19a2 2 0 002 2h1v-5H3v3z" />
    </svg>
  );
}

function IconMegaphone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 11l18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
    </svg>
  );
}

const channels = [
  {
    title: "Central de Atendimento",
    description: "Agendamentos, autorizações e suporte ao beneficiário.",
    action: "Ligar agora",
    // Pedido 12/08: central é o 0800 (SAC). O 2640-0777 é o telefone administrativo.
    href: "tel:08000210777",
    external: false,
    Icon: IconHeadset,
  },
  {
    title: "Ouvidoria",
    description: "Críticas, sugestões e reclamações com canal dedicado.",
    action: "Enviar e-mail",
    href: "mailto:ouvidoria@ameliasaude.com.br",
    external: false,
    Icon: IconMegaphone,
  },
  {
    title: "Assessoria de Imprensa",
    description: "Informações, press releases e contato para a mídia.",
    action: "Falar com assessoria",
    href: "mailto:imprensa@ameliasaude.com.br",
    external: false,
    Icon: IconPhone,
  },
] as const;

export function Contact() {
  return (
    <section
      id="contato"
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ padding: "clamp(5rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem) clamp(4rem, 8vh, 6rem)" }}
    >
      <HeroBackground variant="bloom" />

      <div className="relative z-[1] mx-auto w-full max-w-[1100px]">
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-12 text-center sm:mb-14"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-sans text-[11px] font-normal tracking-[0.12em] text-[var(--amelia-purple)]"
          >
            Contato
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-5 font-display font-normal uppercase text-[var(--amelia-deep)]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Precisa falar com a Amélia?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-[36rem] font-sans font-light leading-relaxed text-[var(--amelia-body)]"
            style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}
          >
            Entre em contato através de um de nossos canais abaixo.
          </motion.p>
        </motion.div>

        <motion.ul
          variants={staggerContainer(0.06, 0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mx-auto grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Canais de atendimento"
        >
          {channels.map(({ title, description, action, href, external, Icon }) => (
            <motion.li key={title} variants={fadeUp} className="min-h-0">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => {
                  trackContactClick(title, href);
                }}
                className="group flex h-full flex-col rounded-2xl border border-[var(--amelia-line)] bg-white/80 px-5 py-6 shadow-[0_1px_0_rgba(26,26,26,0.04)] backdrop-blur-[2px] transition-[border-color,box-shadow,transform] duration-200 hover:border-[rgba(123,109,178,0.35)] hover:shadow-[0_18px_40px_rgba(94,73,133,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--amelia-purple)]"
              >
                <span
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--amelia-deep)] transition-colors duration-200 group-hover:bg-[rgba(123,109,178,0.12)]"
                  style={{ background: "rgba(123,109,178,0.08)" }}
                >
                  <Icon className="h-[22px] w-[22px]" />
                </span>
                <span className="font-sans text-[15px] font-medium text-[#1a1a1a]">{title}</span>
                <span className="mt-2 flex-1 font-sans text-[13px] font-light leading-relaxed text-[#6b6b6b]">
                  {description}
                </span>
                <span
                  className={`${getButtonClassName("primary", "sm")} mt-5 w-full sm:w-fit`}
                >
                  {action}
                  <span className="translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
