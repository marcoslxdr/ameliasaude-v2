"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp, viewportConfig } from "@/lib/motion";

import Image from "next/image";

export function FamilyPlan() {
  return (
    <section
      id="beneficiarios"
      className="relative flex flex-col min-h-[100svh] overflow-hidden bg-white
                 justify-end items-start
                 md:justify-center md:items-center"
    >
      {/* Background image — optimized with next/image */}
      <div className="absolute inset-0 z-0" style={{ transform: "translateZ(0)" }}>
        <Image
          src="/familia-bg.webp"
          alt="Família feliz"
          fill
          priority
          quality={100}
          className="object-cover 
                     object-[32%_20%]
                     md:scale-x-100 md:object-[center_20%]"
          style={{ 
            imageRendering: "auto",
            filter: "contrast(1.04) brightness(1.02)"
          }}
          sizes="(max-width: 768px) 100vw, 100vw"
        />
      </div>

      {/* Gradient overlay — roxo suavizado para evitar ruído/banding */}
      <div
        className="absolute inset-0 z-0
                   bg-[linear-gradient(to_top,rgba(123,107,178,0.6)_0%,rgba(123,107,178,0.35)_35%,rgba(123,107,178,0)_85%)]
                   md:bg-gradient-to-t md:from-[#7b6bb2]/50 md:via-[#7b6bb2]/20 md:to-transparent"
        aria-hidden
      />

      <div
        className="relative z-10 w-full max-w-[1200px] mx-auto
                   px-[clamp(1.5rem,5vw,2rem)]
                   pb-[clamp(2.5rem,5vh,5rem)] pt-[clamp(3rem,10vh,6rem)]"
      >
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex max-w-3xl flex-col
                     items-start text-left
                     md:items-center md:text-center md:mx-auto"
        >
          <motion.span
            variants={fadeUp}
            className="mb-3 block font-sans text-[12px] font-medium tracking-[0.15em] uppercase text-white/70"
          >
            Plano Carioca 10
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mb-4 font-display font-normal text-white"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 4.2rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            Cuidado de verdade
            <br />
            <em className="font-light italic text-white/85">
              para os cariocas
            </em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mb-8 max-w-2xl font-sans text-white/80"
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.15rem)",
              lineHeight: 1.5,
              marginTop: "0.5rem"
            }}
          >
            Acreditamos que cuidar vai além de tratar: é acompanhar, orientar e estar presente em cada momento da vida dos nossos clientes.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
