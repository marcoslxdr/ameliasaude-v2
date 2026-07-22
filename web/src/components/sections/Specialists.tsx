"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeUp, viewportConfig } from "@/lib/motion";
import { HeroBackground } from "@/components/ui/HeroBackground";

type SpecialtyVariant = "hero" | "compact";

const specialties: {
  id: string;
  name: string;
  photo: string;
  variant: SpecialtyVariant;
  imageClass?: string;
}[] = [
  {
    id: "clinico-geral",
    name: "Clínico Geral",
    variant: "compact",
    photo: "/clinico geral.jpg",
  },
  {
    id: "pediatra",
    name: "Pediatra",
    variant: "compact",
    photo: "/pediatra.jpeg",
    imageClass: "object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]",
  },
  {
    id: "cardiologista",
    name: "Cardiologista",
    variant: "hero",
    photo: "/gastroenterologista.jpeg",
  },
  {
    id: "medico-familia",
    name: "Médico da Família",
    variant: "compact",
    photo: "/cardiologista.jpeg",
  },
  {
    id: "ginecologista",
    name: "Ginecologista",
    variant: "compact",
    photo: "/ginecologista.jpeg",
  },
  {
    id: "otorrinolaringologista",
    name: "Otorrinolaringologista",
    variant: "hero",
    photo: "/otorrino.jpeg",
  },
  {
    id: "urologista",
    name: "Urologista",
    variant: "hero",
    photo: "/urologista.jpg",
  },
  {
    id: "ortopedista",
    name: "Ortopedista",
    variant: "hero",
    photo: "/ortopedista.jpeg",
  },
];

const glassCard =
  "rounded-[1.75rem] border border-white/55 bg-white/20 shadow-[0_8px_40px_rgba(94,73,133,0.07)] backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 supports-[backdrop-filter]:bg-white/18";

export function Specialists() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="especialistas-grid"
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ padding: "clamp(5rem, 12vh, 8rem) 0" }}
    >
      <HeroBackground variant="veil" />

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="mb-10 max-w-3xl">
          <p className="mb-4 font-sans text-[11px] font-normal tracking-[0.1em] text-[var(--amelia-purple)]">Especialidades</p>
          <h2 className="font-display text-4xl font-normal leading-tight text-[var(--amelia-deep)] sm:text-5xl">Profissionais especializados</h2>
          <p className="mt-4 max-w-2xl font-sans text-lg font-light leading-relaxed text-[var(--amelia-body)]">Profissionais especializados com agendamento digital para realização de Teleconsulta em até 7 dias.</p>
        </motion.div>
        {/* Bento: 12 colunas — destaques em faixa dupla */}
        <motion.div
          variants={staggerContainer(0.09, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {specialties.map((sp) => {
            const isHero = sp.variant === "hero";
            const colClass = isHero ? "lg:col-span-2" : "lg:col-span-1";

            return (
                <motion.article
                key={sp.id}
                variants={fadeUp}
                className={`group relative flex min-h-0 ${colClass} ${
                  isHero
                    ? "flex-col overflow-hidden lg:min-h-[376px] lg:flex-row"
                    : "flex-col overflow-hidden lg:min-h-[376px]"
                } ${glassCard} hover:border-white/75 hover:bg-white/30 hover:shadow-[0_16px_56px_rgba(123,107,178,0.12)]`}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -5,
                        transition: { type: "spring", stiffness: 380, damping: 26 },
                      }
                }
              >
                <div
                  className={`relative shrink-0 overflow-hidden bg-[var(--amelia-surface)] ${
                    isHero
                      ? "h-52 sm:h-60 lg:h-auto lg:w-1/2"
                      : "h-52 sm:h-56 lg:h-[248px]"
                  }`}
                >
                  <Image
                    src={sp.photo}
                    alt={`Especialista em ${sp.name}`}
                    fill
                    sizes={
                      isHero
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    }
                    className={
                      sp.imageClass ??
                      "object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    }
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.35)] via-transparent to-transparent opacity-80 lg:opacity-100 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[rgba(255,255,255,0.08)]"
                    aria-hidden
                  />
                </div>

                <div
                  className={`flex flex-1 flex-col justify-end border-t border-white/35 bg-gradient-to-br from-white/35 to-white/5 p-5 backdrop-blur-md sm:p-6 ${
                    isHero ? "lg:justify-center lg:border-l lg:border-t-0 lg:from-white/25 lg:to-white/[0.07]" : ""
                  }`}
                >
                  <p className="font-sans text-[10px] font-medium tracking-[0.06em] text-[var(--amelia-purple)]/90">
                    Especialidade
                  </p>
                  <h3 className="font-display mt-1 text-xl font-normal tracking-tight text-[var(--amelia-deep)] sm:text-[1.35rem]">
                    {sp.name}
                  </h3>
                  <div
                    className="mt-4 h-px w-12 bg-gradient-to-r from-[var(--amelia-purple)]/50 to-transparent"
                    aria-hidden
                  />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
