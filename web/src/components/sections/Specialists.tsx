"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeUp, viewportConfig } from "@/lib/motion";
import { HeroBackground } from "@/components/ui/HeroBackground";

type SpecialtyVariant = "hero" | "compact";

const specialties: {
  name: string;
  photo: string;
  variant: SpecialtyVariant;
}[] = [
  {
    name: "Clínico Geral",
    variant: "compact",
    photo: "/clinico geral.jpg",
  },
  {
    name: "Pediatra",
    variant: "compact",
    photo:
      "https://images.unsplash.com/photo-1632052999447-e542d08d4f7d?w=400&h=480&fit=crop&crop=faces",
  },
  {
    name: "Cardiologista",
    variant: "hero",
    photo:
      "https://images.unsplash.com/photo-1460672985063-6764ac8b9c74?w=800&h=560&fit=crop&crop=faces",
  },
  {
    name: "Gastroenterologista",
    variant: "compact",
    photo:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=480&fit=crop&crop=faces",
  },
  {
    name: "Ginecologista",
    variant: "compact",
    photo:
      "https://images.unsplash.com/photo-1637059824899-a441006a6875?w=400&h=480&fit=crop&crop=faces",
  },
  {
    name: "Otorrinolaringologista",
    variant: "hero",
    photo:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&h=560&fit=crop&crop=faces",
  },
  {
    name: "Urologista",
    variant: "hero",
    photo: "/urologista.jpg",
  },
  {
    name: "Ortopedista",
    variant: "hero",
    photo:
      "https://images.unsplash.com/photo-1597764690472-ec054f1c8637?w=800&h=560&fit=crop&crop=faces",
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
      <HeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6">
        {/* Bento: 12 colunas — destaques em faixa dupla */}
        <motion.div
          variants={staggerContainer(0.09, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5"
        >
          {specialties.map((sp) => {
            const isHero = sp.variant === "hero";
            const colClass = isHero ? "lg:col-span-6" : "lg:col-span-3";

            return (
              <motion.article
                key={sp.name}
                variants={fadeUp}
                className={`group relative flex min-h-0 ${colClass} ${
                  isHero
                    ? "flex-col overflow-hidden lg:min-h-[280px] lg:flex-row"
                    : "flex-col overflow-hidden lg:min-h-[320px]"
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
                      ? "h-52 sm:h-60 lg:h-auto lg:w-1/2 lg:min-h-[240px]"
                      : "h-52 sm:h-56"
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
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
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
