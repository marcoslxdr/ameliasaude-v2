"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  fadeUp,
  staggerContainer,
  viewportConfig,
} from "@/lib/motion";

/** Atualize números/e-mail quando a operação confirmar os canais oficiais (espelhar Contact.tsx). */
const CONTACT = {
  whatsappDisplay: "(21) 97172-4757",
  whatsappHref: "https://wa.me/5521971724757",
  phoneDisplay: "(21) 2640-0777",
  phoneHref: "tel:+552126400777",
  sacDisplay: "0800 021 0777",
  sacHref: "tel:08000210777",
  email: "atendimento@ameliasaude.com.br",
  site: "https://ameliasaude.com.br/",
  instagram: "https://www.instagram.com/ameliasauderj/",
} as const;

const navLinks = [
  { label: "Sobre nós", href: "/#origem" },
  { label: "Planos", href: "/planos" },
  { label: "Rede", href: "/#rede" },
  { label: "Telemedicina", href: "/#telemedicina" },
  { label: "Fale conosco", href: "/#contato" },
  { label: "Saúde e bem estar", href: "/blog" },
] as const;

/** Destinos legais: rotas internas do site. */
const legalLinks = [
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Termos de Uso", href: "/termos" },
  { label: "Política de Cookies", href: "/cookies" },
  { label: "LGPD", href: "/lgpd" },
] as const;

const accent = "text-[#c9bcf0]";
const iconBox =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.08)] text-[#ede9fa]";

const linkMuted =
  "font-sans text-sm font-normal tracking-wide text-white/75 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--amelia-deep)] rounded-sm";

/** Ring-offset alinhado ao fundo roxo do rodapé (evitar concat dinâmica para o Tailwind ver a classe). */
const ringFooter =
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--amelia-deep)]";

const headingClass =
  "font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white";

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
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

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-x-8 xl:gap-x-12"
        >
          {/* Coluna institucional */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <a
              href="#hero"
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
            </a>
            <p className="max-w-[280px] font-sans text-sm leading-relaxed tracking-wide text-white/65">
              Operadora de planos de saúde com rede credenciada no Rio de Janeiro e Grande Rio — simples e sem burocracias.
            </p>
            <p className="max-w-[300px] font-sans text-xs leading-relaxed tracking-wide text-white/45">
              Baseada no Rio de Janeiro · Grande RJ — endereço para correspondência disponível pelos canais de atendimento.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,188,240,0.35)] text-[#d8cef7] transition-colors hover:border-[rgba(201,188,240,0.55)] hover:bg-[rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] ${ringFooter}`}
                aria-label="Amélia Saúde no Instagram"
              >
                <IconInstagram className="h-[18px] w-[18px]" />
              </a>
              <a
                href={CONTACT.site}
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

          {/* Contato */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <p className={headingClass}>Contato</p>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] ${ringFooter}`}
                >
                  <span className={iconBox}>
                    <IconWhatsApp className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${accent}`}>
                      WhatsApp
                    </span>
                    <span className="truncate font-sans text-sm text-white/85 group-hover:text-white">
                      {CONTACT.whatsappDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className={`group flex gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] ${ringFooter}`}
                >
                  <span className={iconBox}>
                    <IconMail className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${accent}`}>
                      E-mail
                    </span>
                    <span className="font-sans text-sm text-white/85 group-hover:text-white">
                      {CONTACT.email.includes("@") ? (
                        <>
                          {CONTACT.email.split("@")[0]}@
                          <wbr />
                          {CONTACT.email.split("@")[1]}
                        </>
                      ) : (
                        CONTACT.email
                      )}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className={`group flex gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] ${ringFooter}`}
                >
                  <span className={iconBox}>
                    <IconPhone className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${accent}`}>
                      Telefone
                    </span>
                    <span className="font-sans text-sm text-white/85 group-hover:text-white">{CONTACT.phoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.sacHref}
                  className={`group flex gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,188,240,0.45)] ${ringFooter}`}
                >
                  <span className={iconBox}>
                    <IconPhone className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${accent}`}>
                      SAC
                    </span>
                    <span className="font-sans text-sm text-white/85 group-hover:text-white">{CONTACT.sacDisplay}</span>
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Certificações */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:col-span-2 lg:col-span-2">
            <p className={headingClass}>Certificações</p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <Image
                  src="/faixa-registro-ans.png"
                  alt="Registro ANS da Amélia Saúde"
                  width={240}
                  height={71}
                  sizes="300px"
                  className="w-auto max-w-[220px] shrink-0 object-contain shadow-[0_4px_16px_rgba(0,0,0,0.25)] sm:max-w-[280px]"
                />
                <div className="flex w-fit min-w-0 flex-col justify-center gap-3">
                  <div className="flex items-center justify-center border border-white bg-black px-4 py-2 text-center">
                    <p className="whitespace-nowrap font-sans text-[13px] font-semibold leading-snug tracking-wide text-white">
                      ANS Nº 424277
                    </p>
                  </div>
                  <a
                    href="/privacidade"
                    className="flex items-center justify-center border border-white bg-black px-4 py-2 text-center font-sans text-[13px] leading-snug text-white transition-colors duration-300 hover:bg-[#262626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.5)]"
                  >
                    <span className="whitespace-nowrap">Política de Privacidade</span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4 border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-4 py-3 backdrop-blur-[2px]">
                <span className={`inline-block rounded px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider ${accent} ring-1 ring-[rgba(201,188,240,0.35)]`}>
                  Reclame Aqui
                </span>
                <Image
                  src="/reclame-aqui.jpeg"
                  alt="Amélia Saúde no Reclame Aqui"
                  width={320}
                  height={313}
                  sizes="110px"
                  className="ml-auto h-auto w-[92px] shrink-0 object-contain"
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
            <p className="shrink-0 text-white/55 tabular-nums">CNPJ: 57.395.677/0001-93</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
