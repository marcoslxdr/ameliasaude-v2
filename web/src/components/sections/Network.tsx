"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUpFast } from "@/lib/motion";
import { CoverageOrbital } from "@/components/sections/CoverageOrbital";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";

export function Network() {
  return (
    <section id="rede" className="relative flex flex-col justify-center overflow-x-clip overflow-y-visible"
      style={{ padding: "clamp(5rem,10vh,7rem) clamp(1.5rem,5vw,5rem)" }}>
      <HeroBackground />
      <div className="relative z-10 max-w-[min(100%,1400px)] mx-auto w-full">
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-16 lg:gap-6 xl:gap-10 items-start lg:items-center"
          style={{ minHeight: "min(61.2vh,765px)" }}
        >

          {/* Esquerda — título e subtítulo sempre legíveis (acima do CTA) */}
          <div className="relative z-10 flex min-h-0 flex-col justify-center lg:min-h-[min(61.2vh,765px)] lg:max-w-xl lg:py-4">
            <motion.div
              variants={staggerContainer(0.04, 0)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-160px 0px -60px 0px" }}
            >
              <motion.p
                variants={fadeUpFast}
                className="mb-5 font-sans text-[11px] font-normal tracking-[0.1em] text-[var(--amelia-purple)]"
              >
                Cobertura
              </motion.p>
              <motion.h2
                variants={fadeUpFast}
                className="mb-5 font-display font-normal text-[var(--amelia-deep)]"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Ampla rede credenciada pertinho de você
              </motion.h2>
              <motion.p
                variants={fadeUpFast}
                className="mb-8 max-w-md font-sans font-light leading-relaxed text-[var(--amelia-body)]"
                style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}
              >
                Rede eficiente, presente em mais de 10 municípios com diversos hospitais no Rio e Grande Rio.
              </motion.p>
              <motion.div variants={fadeUpFast}>
                <Button
                  variant="outline"
                  aria-label="Conheça nossa rede (em breve: lista de hospitais)"
                >
                  Conheça nossa rede
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Direita — espiral orbital com cidades */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-120px 0px -60px 0px" }}
            transition={{ duration: 0.4 }}
            className="relative flex min-h-[min(88vw,640px)] items-center justify-center lg:min-h-[min(62vh,680px)]"
          >
            <CoverageOrbital />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
