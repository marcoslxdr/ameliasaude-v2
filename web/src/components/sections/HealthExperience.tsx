"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { staggerContainer, fadeUp, viewportConfig } from "@/lib/motion";
import { Shield, Wallet, Zap, Users, Building, Landmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";

const items = [
  {
    image: "/ampla-cobertura.jpeg",
    title: "Ampla cobertura",
    body: "Planos com cobertura total para consultas, exames, internações e cirurgias.",
  },
  {
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    title: "Preços competitivos",
    body: "O melhor custo benefício do mercado, com preços que cabem no seu orçamento.",
  },
  {
    image: "/doctor-patient-consultation.jpg",
    title: "Atendimento ágil",
    body: "Eficiente, resolutivo e sem burocracias, com foco total na sua saúde.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
    title: "Planos coletivo por adesão",
    body: "Planos para você e sua família através de entidades de classe com diversas categorias profissionais.",
  },
  {
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
    title: "Planos empresariais",
    body: "Planos para micro e pequenas empresas a partir de 2 beneficiários.",
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    title: "Planos corporativos",
    body: "Planos para empresas de médio e grande porte em condições diferenciadas a partir de 100 beneficiários.",
  },
];

export function HealthExperience() {
  return (
    <section
      id="experiencia-planos"
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ padding: "clamp(5.25rem, 11vh, 8.5rem) clamp(1.5rem, 5vw, 5rem)" }}
    >
      <HeroBackground variant="bloom" />
      <div className="relative z-10 mx-auto w-full max-w-[1140px]">
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col items-center text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex rounded-full border border-[var(--amelia-line)] bg-[var(--amelia-soft)] px-5 py-2.5 font-sans text-[11px] font-normal tracking-[0.1em] text-[var(--amelia-deep)] shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          >
            Planos de saúde feitos para você
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="w-full font-display font-normal tracking-tight text-[var(--amelia-deep)] whitespace-normal"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            A MELHOR EXPERIÊNCIA EM PLANOS DE SAÚDE
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-2xl font-sans font-light leading-relaxed text-[var(--amelia-body)]"
            style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}
          >
            O cuidado que você quer está aqui.
          </motion.p>
        </motion.div>

        <motion.ul
          variants={staggerContainer(0.07, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-16 grid list-none grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
        >
          {items.map(({ image, title, body }) => (
            <motion.li
              key={title}
              variants={fadeUp}
              className="group flex flex-col overflow-hidden rounded-[1.35rem] border border-[var(--amelia-line)] bg-white shadow-[0_14px_40px_-20px_rgba(36,24,53,0.12)] transition-all duration-400 hover:-translate-y-1.5 hover:border-[rgba(94,73,133,0.22)] hover:shadow-[0_22px_48px_-18px_rgba(36,24,53,0.22)]"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col flex-1 p-8">
                <h3 className="font-display text-[1.35rem] font-bold tracking-[0.01em] text-[var(--amelia-deep)]">
                  {title}
                </h3>
                <p className="mt-3.5 font-sans text-[0.95rem] font-light leading-relaxed tracking-normal text-[#5c5470]">
                  {body}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-14 flex justify-center"
        >
          <Button href="#contato" variant="primary">
            Fazer orçamento
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
