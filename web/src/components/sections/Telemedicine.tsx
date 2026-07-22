"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, viewportConfig } from "@/lib/motion";
import telemedicinaPhone from "@/assets/telemedicina-1.webp";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { Button } from "@/components/ui/Button";

function Phone() {
  return (
    <div
      className="relative mx-auto w-full max-w-[min(100%,88vw)] lg:max-w-none
        [width:clamp(180px,56vw,320px)] lg:[width:clamp(200px,26vw,340px)]
        xl:[width:clamp(210px,24vw,360px)] justify-self-center origin-center">
      <Image
        src={telemedicinaPhone}
        alt="Consulta de telemedicina com Dra. Ana Silva"
        className="w-full h-auto
          drop-shadow-[0_32px_64px_rgba(26,26,26,0.18)]
          lg:drop-shadow-[0_48px_96px_rgba(26,26,26,0.22)]"
        sizes="(max-width: 1024px) 56vw, (max-width: 1280px) 26vw, 360px"
        priority
      />

      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-0.35rem] sm:right-[-0.75rem] top-[14%] font-sans text-xs sm:text-[13px] font-normal px-3 py-1.5 rounded-full z-10"
        style={{ background: "#7b6bb2", color: "white", border: "1px solid #7b6bb2", boxShadow: "0 6px 20px rgba(94,73,133,0.3)", whiteSpace: "nowrap" }}>
        Clínico Geral 24h
      </motion.div>
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute left-[-0.25rem] sm:left-[-0.65rem] bottom-[22%] font-sans text-xs sm:text-[13px] font-normal px-3 py-1.5 rounded-full z-10"
        style={{ background: "#7b6bb2", color: "white", boxShadow: "0 6px 20px rgba(123,107,178,0.3)", whiteSpace: "nowrap" }}>
        Pediatra 24h
      </motion.div>
    </div>
  );
}

const bullets = [
  { title: "94% de resolutividade na primeira consulta", desc: "A maioria dos casos resolvidos já no primeiro atendimento." },
  { title: "Prescrição eletrônica completa", desc: "Medicamentos, exames e atestados emitidos digitalmente." },
];

export function Telemedicine() {
  return (
    <section id="telemedicina" className="relative flex flex-col justify-center overflow-x-clip overflow-y-visible"
      style={{ padding: "clamp(5rem,12vh,8rem) clamp(1.25rem,4vw,4rem)" }}>
      <HeroBackground variant="origin" />
      <div className="relative z-10 max-w-[min(100%,1380px)] mx-auto w-full">
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
            gap-12 lg:gap-8 xl:gap-12 items-center
            lg:min-h-[min(56vh,600px)]">

          {/* Esquerda: título, subtítulo, CTAs */}
          <div className="relative z-10 flex min-h-0 flex-col justify-center lg:pr-2 xl:pr-4">
            <motion.div
              variants={staggerContainer(0.1, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -8% 0px", amount: 0.2 }}
            >
              <motion.p variants={fadeUp}
                className="font-sans text-[11px] font-normal tracking-[0.1em] text-[#7b6bb2] mb-5">
                Telemedicina
              </motion.p>
              <motion.h2 variants={fadeUp}
                className="font-display font-normal text-[var(--amelia-deep)] mb-4"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                Tenha um especialista Amélia disponível{" "}
                <em className="italic font-light text-[#7b6bb2]">a qualquer momento.</em>
              </motion.h2>
              <motion.p variants={fadeUp}
                className="mb-8 font-sans font-light leading-relaxed text-[var(--amelia-body)]"
                style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}>
                Seja atendido em até 7 minutos através da teleconsulta com praticidade e comodidade, sem necessidade de deslocamentos.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Button href="#plataforma" variant="purple">Acessar plataforma</Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Centro: mockup */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportConfig}
            className="flex justify-center lg:px-2">
            <Phone />
          </motion.div>

          {/* Direita: pontos */}
          <div className="relative z-10 flex min-h-0 flex-col justify-center lg:pl-2 xl:pl-4">
            <motion.ul
              className="flex flex-col gap-7"
              variants={staggerContainer(0.08, 0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -8% 0px", amount: 0.15 }}
            >
              {bullets.map((b, i) => (
                <motion.li key={b.title} variants={fadeUp}
                  transition={{ delay: 0.08 * i }}
                  className="flex items-start gap-5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "#7b6bb2" }}>
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="font-sans font-medium text-[var(--amelia-deep)] leading-snug"
                      style={{ fontSize: "clamp(1rem, 1.35vw, 1.2rem)" }}
                    >
                      {b.title}
                    </p>
                    {b.desc && <p
                      className="font-sans font-light text-[#8a8a8a] leading-relaxed mt-1.5"
                      style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}
                    >
                      {b.desc}
                    </p>}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
