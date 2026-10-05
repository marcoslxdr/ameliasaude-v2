"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  fadeUp,
  staggerContainer,
  viewportConfig,
} from "@/lib/motion";

const SOCIAL_LINKS = {
  site: "https://ameliasaude.com.br/",
  instagram: "https://www.instagram.com/ameliasauderj/",
} as const;

const navLinks = [
  { label: "Sobre nós", href: "/#origem" },
  { label: "Planos", href: "/planos" },
  { label: "Rede", href: "/rede-credenciada" },
  { label: "Telemedicina", href: "/#telemedicina" },
  { label: "Fale conosco", href: "/#contato" },
] as const;

/** Destinos legais: rotas internas do site. */
const legalLinks = [
  { label: "Termos de Uso", href: "/termos" },
  { label: "Política de Cookies", href: "/cookies" },
  { label: "LGPD", href: "/lgpd" },
] as const;

const accent = "text-[#c9bcf0]";
const linkMuted =
  "font-sans text-sm font-normal tracking-wide text-white/75 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--amelia-deep)] rounded-sm";

/** Ring-offset alinhado ao fundo roxo do rodapé (evitar concat dinâmica para o Tailwind ver a classe). */
const ringFooter =
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--amelia-deep)]";

const headingClass =
  "font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      id="rodape"
      className="relative mt-auto overflow-hidden bg-[var(--amelia-deep)]"
      style={{
        backgroundImage:
          "linear-gradient(165deg, rgba(74, 54, 118, 0.95) 0%, var(--amelia-deep) 42%, rgba(123, 109, 178, 0.88) 100%), radial-gradient(ellipse 90% 55% at 50% -15%, rgba(255, 255, 255, 0.14), transparent 55%), radial-gradient(ellipse 65% 45% at 100% 110%, rgba(45, 34, 85, 0.45), transparent 50%)",
      }}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Rodapé — Amélia Saúde
      </h2>

      <div className="relative z-10 mx-auto max-w-[1440px] px-[clamp(1.5rem,5vw,5rem)] pt-[clamp(2.75rem,6vh,4.25rem)] pb-[clamp(1.5rem,3vh,2.25rem)]">
        <motion.div
          variants={staggerContainer(0.05, 0.04)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-8 xl:gap-x-12"
        >
          {/* Coluna institucional */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className={`inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.5)] ${ringFooter} rounded-sm`}
              aria-label="Amélia Saúde — voltar ao início"
            >
              <Image
                src="/logo-amelia-site-branca.png"
                alt=""
                width={200}
                height={56}
                sizes="200px"
                className="h-14 w-auto object-contain mix-blend-screen contrast-[1.05]"
              />
            </Link>
            <p className="max-w-[280px] font-sans text-sm leading-relaxed tracking-wide text-white/65">
              Operadora de planos de saúde com rede credenciada no Rio de Janeiro e Grande Rio — simples e sem burocracias.
            </p>
            <p className="max-w-[300px] font-sans text-xs leading-relaxed tracking-wide text-white/45">
              Baseada no Rio de Janeiro · Grande RJ — endereço para correspondência disponível pelos canais de atendimento.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,188,240,0.35)] text-[#d8cef7] transition-colors hover:border-[rgba(201,188,240,0.55)] hover:bg-[rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] ${ringFooter}`}
                aria-label="Amélia Saúde no Instagram"
              >
                <IconInstagram className="h-[18px] w-[18px]" />
              </a>
              <a
                href={SOCIAL_LINKS.site}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,188,240,0.35)] text-[#d8cef7] transition-colors hover:border-[rgba(201,188,240,0.55)] hover:bg-[rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] ${ringFooter}`}
                aria-label="Amélia Saúde no LinkedIn"
              >
                <IconLinkedIn className="h-[18px] w-[18px]" />
              </a>
            </div>
          </motion.div>

          {/* Navegação */}
          <motion.nav variants={fadeUp} className="flex flex-col gap-4" aria-label="Navegação do site">
            <p className={headingClass}>Navegação</p>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className={linkMuted}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Legal */}
          <motion.nav variants={fadeUp} className="flex flex-col gap-4" aria-label="Informações legais">
            <p className={headingClass}>Legal</p>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={linkMuted}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Certificações */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:col-span-2 lg:col-span-2">
            <p className={headingClass}>Certificações</p>
            <ul className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2">
              <li className="flex min-h-[71px] items-center justify-center">
                <Image
                  src="/faixa-registro-ans.png"
                  alt="Agência Nacional de Saúde Suplementar"
                  width={240}
                  height={71}
                  sizes="(min-width: 640px) 240px, 100vw"
                  className="h-auto w-full max-w-[240px] object-contain shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                />
              </li>
              <li className="flex min-h-[71px] w-full max-w-[240px] items-center justify-between gap-3 border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-3 py-2 backdrop-blur-[2px] justify-self-center sm:justify-self-end">
                <span className={`font-sans text-[10px] font-semibold uppercase tracking-wider ${accent}`}>
                  Reclame Aqui
                </span>
                <Image
                  src="/reclame-aqui.jpeg"
                  alt="Amélia Saúde no Reclame Aqui"
                  width={320}
                  height={313}
                  sizes="52px"
                  className="h-auto w-[52px] shrink-0 object-contain"
                />
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-12 border-t border-white/[0.08] pt-8"
        >
          <div className="flex flex-col gap-3 font-sans text-xs leading-relaxed tracking-wide text-white/45 md:flex-row md:items-center md:justify-between md:gap-6">
            <p className="max-w-3xl">
              © {new Date().getFullYear()} Amelia Operadora de Planos de Saude S.A. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-white/55">
              <p className="whitespace-nowrap tabular-nums">CNPJ: 57.395.677/0001-93</p>
              <div
                className="relative h-5 w-[92px] shrink-0 overflow-hidden"
                role="img"
                aria-label="Registro ANS da Amélia Saúde, número 42.427-7"
              >
                <Image
                  src="/ans-registro-amelia.png"
                  alt=""
                  width={930}
                  height={500}
                  sizes="127px"
                  className="absolute left-[-18px] top-[-24px] h-[68px] w-[127px] max-w-none"
                  draggable={false}
                />
              </div>
              <Link
                href="/privacidade"
                className={`whitespace-nowrap font-sans text-xs text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] ${ringFooter} rounded-sm`}
              >
                Política de Privacidade
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
