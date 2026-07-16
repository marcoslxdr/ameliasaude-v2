"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  revealLine,
  viewportConfig,
} from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { trackCtaClick } from "@/lib/analytics";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-svh lg:min-h-screen flex flex-col overflow-hidden"
    >
      <HeroBackground className="z-[1]" />

      {/* Decorative circles — behind photo, desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="absolute inset-0 hidden lg:block pointer-events-none z-[3]"
        aria-hidden
      >
        {/* Outer circle — glass body */}
        <div
          className="absolute rounded-full"
          style={{
            width: 620,
            height: 620,
            right: "8%",
            bottom: "11%",
            background: "color-mix(in srgb, var(--amelia-purple) 6%, transparent)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid color-mix(in srgb, var(--amelia-purple) 14%, transparent)",
          }}
        />
        {/* Mid circle — glass body, lighter */}
        <div
          className="absolute rounded-full"
          style={{
            width: 420,
            height: 420,
            right: "18%",
            bottom: "19%",
            background: "color-mix(in srgb, var(--amelia-white) 9%, transparent)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid color-mix(in srgb, var(--amelia-purple) 10%, transparent)",
          }}
        />
        {/* Small circle — glass accent */}
        <div
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            right: "42%",
            bottom: "59%",
            background: "color-mix(in srgb, var(--amelia-purple) 8%, transparent)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid color-mix(in srgb, var(--amelia-deep) 14%, transparent)",
          }}
        />
        {/* Dot punctuation */}
        <div
          className="absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            right: "40.2%",
            bottom: "63.6%",
            background: "color-mix(in srgb, var(--amelia-purple) 55%, transparent)",
          }}
        />
      </motion.div>

      {/* Person image — desktop: absolute grounded right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="absolute bottom-0 right-[14%] hidden lg:flex items-end pointer-events-none z-10"
        style={{ height: "91%" }}
        aria-hidden
      >
        <Image
          src="/maria-padilha-hero.png"
          alt=""
          width={941}
          height={1672}
          priority
          quality={100}
          className="h-full w-auto object-contain object-[72%_bottom] select-none"
          sizes="(max-width: 1024px) 0px, 600px"
          draggable={false}
        />
      </motion.div>

      {/* Person image — mobile: oversized to compensate for transparent PNG canvas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="absolute bottom-0 right-[-30vw] block lg:hidden pointer-events-none z-10"
        style={{ width: "148vw", height: "70vh" }}
        aria-hidden
      >
        <Image
          src="/maria-padilha-hero.png"
          fill
          alt=""
          priority
          quality={90}
          className="object-contain object-[right_bottom] select-none"
          sizes="148vw"
          draggable={false}
        />
      </motion.div>

      {/* Bottom fade — integra foto e próxima seção */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--amelia-white) 88%, transparent))",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-30 flex flex-col flex-1 w-full max-w-[1440px] mx-auto px-[clamp(1.5rem,6vw,7rem)] pt-24 sm:pt-28 lg:pt-36 pb-6 lg:pb-28 max-lg:pr-[44vw] sm:max-lg:pr-[40vw] md:max-lg:pr-[36vw]">
        <motion.div
          variants={staggerContainer(0.13, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-1 flex-col lg:my-auto lg:flex-none w-full lg:max-w-[48%]"
        >
          {/* Headline */}
          <motion.h1 variants={fadeUp} className="mb-5 lg:mb-7 tracking-tight">
            <span
              className="block font-sans font-normal text-[var(--amelia-deep)] leading-[1.15] mb-4 lg:mb-5"
              style={{
                fontSize: "clamp(1.35rem, 2.6vw, 2.1rem)",
                maxWidth: "min(100%, 520px)",
              }}
            >
              O Plano de saúde com gestão moderna, tecnologia inteligente e cuidado humanizado.
            </span>
            <span
              className="block font-display font-normal text-[var(--amelia-purple)] leading-[1.04] italic text-[1.65rem] min-[360px]:text-[1.75rem] min-[390px]:text-[1.85rem] sm:text-[2.25rem] lg:text-[clamp(2.85rem,5.6vw,4.9rem)]"
            >
              Amélia saúde!
            </span>
          </motion.h1>

          {/* Accent rule */}
          <motion.div
            variants={revealLine}
            className="mb-5 lg:mb-8 h-px w-16 origin-left"
            style={{ background: "var(--amelia-purple)" }}
          />

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="mb-5 w-full max-w-[229px] font-sans font-light leading-relaxed text-[var(--amelia-body)] lg:mb-10 lg:w-auto"
            style={{
              fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)",
              maxWidth: "430px",
            }}
          >
            <span className="lg:hidden">
              Planos que cuidam
              <br />
              de você de verdade.
            </span>
            <span className="hidden lg:inline">
              Planos que cuidam de você de verdade.
            </span>
          </motion.p>

          {/* CTAs — abaixo do subtexto; alinhados à esquerda, centralizados entre si */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center self-start gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-5"
          >
            <Button
              href="#experiencia-planos"
              variant="primary"
              size="sm"
              onClick={() => trackCtaClick("quero_meu_plano", "#experiencia-planos")}
            >
              Quero meu plano
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </Button>

            <Button
              href="#origem"
              variant="ghost-link"
              size="sm"
              onClick={() => trackCtaClick("conheca_a_amelia", "#origem")}
            >
              Conheça a Amélia
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[1.75]" />
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
