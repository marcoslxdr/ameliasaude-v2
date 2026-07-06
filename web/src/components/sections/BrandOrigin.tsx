"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/motion";
import { HeroBackground } from "@/components/ui/HeroBackground";

export function BrandOrigin() {
  return (
    <section
      id="origem"
      aria-labelledby="origem-heading"
      className="relative flex min-h-[max(800px,100svh)] items-center justify-center overflow-x-clip px-[clamp(1.5rem,5vw,5rem)] py-12 md:py-16"
    >
      <HeroBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-[1240px] items-center justify-center">
        <motion.div
          className="grid w-full max-w-5xl grid-cols-1 place-items-center items-center justify-items-center gap-14 md:gap-20 lg:max-w-none lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:justify-items-center lg:gap-24 xl:gap-28"
          variants={staggerContainer(0.12, 0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.div variants={fadeUp} className="order-2 flex min-w-0 justify-center lg:order-1">
            <div
              className="relative aspect-[9/16] h-[min(72svh,42rem)] w-auto max-w-[min(100%,24rem)] shrink-0 overflow-hidden rounded-[1.5rem] bg-[var(--amelia-purple-faint)] md:h-[min(78svh,46rem)] md:max-w-[min(100%,26rem)]"
              style={{
                boxShadow:
                  "0 32px 88px -40px color-mix(in srgb, var(--amelia-deep) 44%, transparent)",
              }}
            >
              <video
                className="h-full w-full object-cover"
                src="/amelia%20video.mp4"
                playsInline
                preload="metadata"
                controls
                aria-label="Vídeo institucional da Amélia Saúde"
              />
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="order-1 flex min-w-0 flex-col items-center justify-center text-center lg:order-2 lg:items-center lg:py-4 xl:py-6"
          >
            <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--amelia-purple)] md:mb-6">
              Nossa história
            </p>
            <h2
              id="origem-heading"
              className="max-w-2xl font-display font-normal text-[var(--amelia-deep)] lg:mx-auto"
              style={{
                fontSize: "clamp(2.5rem, 5.2vw, 4.25rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.028em",
              }}
            >
              A Amélia Saúde nasceu para transformar o cuidado com a saúde no{" "}
              <em className="font-light italic text-[var(--amelia-purple)]">Rio de Janeiro</em>
            </h2>
            <p
              className="mx-auto mt-7 max-w-xl font-sans font-light leading-relaxed text-[var(--amelia-body)] md:mt-8"
              style={{ fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)", lineHeight: 1.7 }}
            >
              Operadora carioca com gestão moderna, rede perto de você e um time dedicado a cuidar de
              pessoas.
              <br />
              Atendimento humanizado que faz diferença para o seu cuidado!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
