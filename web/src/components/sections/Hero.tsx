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
import { useCotacao } from "@/components/CotacaoModal";

type HeroProps = {
  /** Hero person image (default: look atual em produção). */
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Mobile: distância do topo até a caixa da foto (ancora a cabeça perto do
   *  headline; px/rem → acompanha o título em qualquer altura de tela). */
  mobilePhotoTop?: string;
  /** Mobile: quanto a foto sangra pra fora da borda direita (ex. "-24vw"). */
  mobilePhotoRight?: string;
  /** Mobile: padding-right reservado no copy p/ texto não colidir com a foto. */
  mobileCopyPad?: string;
  /** Outer content shell. */
  contentClassName?: string;
  /** Lead title classes. */
  headlineClassName?: string;
};

const DEFAULT_HERO_IMAGE = {
  src: "/maria-padilha-hero.png",
  width: 941,
  height: 1672,
} as const;

const DEFAULT_CONTENT =
  "relative z-20 flex min-h-0 w-full max-w-[1440px] flex-1 flex-col mx-auto px-[clamp(1.5rem,6vw,7rem)] pt-24 sm:pt-28 lg:absolute lg:inset-0 lg:z-30 lg:pb-28 lg:pt-36 lg:pointer-events-none";
const DEFAULT_HEADLINE =
  "mb-3 w-full max-w-none shrink-0 tracking-tight lg:mb-7";

export function Hero({
  imageSrc = DEFAULT_HERO_IMAGE.src,
  imageWidth = DEFAULT_HERO_IMAGE.width,
  imageHeight = DEFAULT_HERO_IMAGE.height,
  mobilePhotoTop = "11rem",
  mobilePhotoRight = "-18vw",
  mobileCopyPad = "44vw",
  contentClassName = DEFAULT_CONTENT,
  headlineClassName = DEFAULT_HEADLINE,
}: HeroProps = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const { open } = useCotacao();

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative flex h-svh flex-col overflow-hidden lg:min-h-screen"
      style={{ ["--copy-pad" as string]: mobileCopyPad }}
    >
      <HeroBackground className="z-[1]" />

      {/* Decorative circles — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="absolute inset-0 z-[3] hidden pointer-events-none lg:block"
        aria-hidden
      >
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

      {/* Person — desktop absolute */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="absolute bottom-0 right-[14%] z-10 hidden items-end pointer-events-none lg:flex"
        style={{ height: "91%" }}
        aria-hidden
      >
        <Image
          src={imageSrc}
          alt=""
          width={imageWidth}
          height={imageHeight}
          priority
          quality={90}
          className="h-full w-auto object-contain object-[72%_bottom] select-none"
          sizes="(max-width: 1024px) 0px, 600px"
          draggable={false}
        />
      </motion.div>

      {/* Person — mobile: absolute à section. Caixa com largura própria
          (mobilePhotoWidth) e object-contain ancorado à direita: a pessoa
          nunca é cortada nem distorcida, e a sobra (se houver) vira buffer
          à ESQUERDA, longe do texto — nunca sobrepõe. Sangra um pouco pra
          fora à direita; esse único limite é suavizado por fade (mask) →
          sem linha dura. Top ancora a cabeça com folga do headline. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="absolute bottom-0 z-[8] pointer-events-none lg:hidden"
        style={{
          top: mobilePhotoTop,
          aspectRatio: `${imageWidth} / ${imageHeight}`,
          right: mobilePhotoRight,
          WebkitMaskImage:
            "linear-gradient(to right, #000 82%, transparent 100%)",
          maskImage: "linear-gradient(to right, #000 82%, transparent 100%)",
        }}
        aria-hidden
      >
        <Image
          src={imageSrc}
          fill
          alt=""
          priority
          quality={90}
          sizes="90vw"
          draggable={false}
          className="object-contain object-bottom select-none"
        />
      </motion.div>

      <div className={contentClassName}>
        <motion.div
          variants={staggerContainer(0.13, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex min-h-0 w-full flex-1 flex-col lg:my-auto lg:max-w-[48%] lg:flex-none lg:pointer-events-auto"
        >
          {/* Lead — mobile: full width ACIMA da foto; desktop: fluxo normal */}
          <motion.h1 variants={fadeUp} className={headlineClassName}>
            <span
              className="mb-0 block w-full max-w-none font-sans font-normal leading-[1.15] text-[var(--amelia-deep)] lg:mb-5 lg:max-w-[520px]"
              style={{
                fontSize: "clamp(1.35rem, 2.6vw, 2.1rem)",
              }}
            >
              O plano de saúde com gestão moderna, tecnologia inteligente e
              cuidado humanizado.
            </span>
            {/* Desktop no h1; mobile: sr-only (visual na coluna ao lado da foto). */}
            <span className="sr-only lg:hidden">Amélia saúde!</span>
            <span className="mt-0 hidden font-display font-normal italic leading-[1.04] text-[var(--amelia-purple)] lg:block lg:text-[clamp(2.85rem,5.6vw,4.9rem)]">
              Amélia saúde!
            </span>
          </motion.h1>

          {/* Copy — mobile: coluna esquerda, pr reserva espaço p/ não colidir com foto */}
          <div
            className="relative z-20 flex min-h-0 flex-1 flex-col pt-2 pr-[var(--copy-pad)] lg:z-auto lg:flex-none lg:pt-0 lg:pr-0"
          >
            <p
              className="mb-4 block whitespace-nowrap font-display font-normal italic leading-[1.04] text-[var(--amelia-purple)] lg:hidden"
              style={{ fontSize: "clamp(1.5rem, 6.2vw, 2.25rem)" }}
              aria-hidden
            >
              Amélia saúde!
            </p>

            <motion.div
              variants={revealLine}
              className="mb-5 h-px w-16 origin-left lg:mb-8"
              style={{ background: "var(--amelia-purple)" }}
            />

            <motion.p
              variants={fadeUp}
              className="mb-5 font-sans font-light leading-relaxed text-[var(--amelia-body)] lg:mb-10 lg:w-auto"
              style={{
                fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)",
                maxWidth: "430px",
              }}
            >
              <span className="lg:hidden">
                <span className="block whitespace-nowrap">Planos feitos para cuidar</span>
                <span className="block whitespace-nowrap">de você de verdade.</span>
              </span>
              <span className="hidden lg:inline">
                Planos feitos para cuidar de você de verdade.
              </span>
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex w-fit flex-col items-stretch gap-3 self-start lg:flex-row lg:flex-wrap lg:items-center lg:gap-5"
            >
              <Button
                href="/cotacao"
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  trackCtaClick("quero_meu_plano", "/cotacao");
                  open();
                }}
              >
                Quero meu plano
                <ArrowRight className="h-3 w-3 stroke-[2.5] sm:h-3.5 sm:w-3.5" />
              </Button>

              <Button
                href="#origem"
                variant="ghost-link"
                size="sm"
                onClick={() => trackCtaClick("conheca_a_amelia", "#origem")}
              >
                Conheça a Amélia
                <ArrowRight className="h-3 w-3 stroke-[1.75] sm:h-3.5 sm:w-3.5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-28"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--amelia-white) 88%, transparent))",
        }}
        aria-hidden
      />
    </section>
  );
}
