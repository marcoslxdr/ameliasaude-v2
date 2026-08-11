"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp, viewportConfig } from "@/lib/motion";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { getButtonClassName } from "@/lib/button-styles";
import { trackContactClick, trackGoogleAdsConversion } from "@/lib/analytics";

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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

function IconLayers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12.83 2.18a2 2 0 00-1.66 0L2.6 6.08a1 1 0 000 1.83l8.58 3.91a2 2 0 001.66 0l8.58-3.9a1 1 0 000-1.83l-8.59-3.91z" />
      <path d="M2 12l10 4 10-4M2 17l10 4 10-4" />
    </svg>
  );
}

const channels = [
  {
    title: "WhatsApp",
    description: "Tire dúvidas e fale com nosso time pelo aplicativo.",
    action: "Abrir WhatsApp",
    href: "https://wa.me/5521971724757",
    external: true,
    Icon: IconWhatsApp,
  },
  {
    title: "Central de Atendimento",
    description: "Agendamentos, autorizações e suporte ao beneficiário.",
    action: "Ligar agora",
    href: "tel:+552126400777",
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
    title: "Prestador",
    description: "Canal exclusivo para rede credenciada e prestadores de serviço.",
    action: "Acessar portal",
    // Portal de prestadores ainda não existe — apontar para o WhatsApp da
    // operadora até a Amélia fornecer a URL oficial do portal.
    href: "https://wa.me/5521971724757",
    external: true,
    Icon: IconLayers,
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
          className="mx-auto grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-3"
          aria-label="Canais de atendimento"
        >
          {channels.map(({ title, description, action, href, external, Icon }) => (
            <motion.li key={title} variants={fadeUp} className="min-h-0">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => {
                  trackContactClick(title, href);
                  if (title === "WhatsApp") trackGoogleAdsConversion();
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
