"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "@/lib/motion";
import { HeroBackground } from "@/components/ui/HeroBackground";

/**
 * Video MUST stay outside any Framer Motion / CSS-transform ancestor.
 * iOS Safari will not paint <video> (nor poster) when a parent has transform.
 */
export function BrandOrigin() {
  return (
    <section
      id="origem"
      aria-labelledby="origem-heading"
      className="relative flex min-h-[max(800px,100vh)] min-h-[max(800px,100dvh)] items-center justify-center px-[clamp(1.5rem,5vw,5rem)] py-12 md:py-16"
    >
      <HeroBackground variant="origin" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1240px] items-center justify-center">
        {/* Plain grid — no motion transforms on this tree for the video column.
            Track 1 MUST be a definite rem width (not minmax(0,…)): percentage
            widths on the video box + min-w-0 collapse the column to 0×0. */}
        <div className="grid w-full max-w-5xl grid-cols-1 place-items-center items-center justify-items-center gap-14 md:gap-16 lg:max-w-none lg:grid-cols-[20rem_minmax(0,1fr)] lg:justify-items-center lg:gap-16 xl:grid-cols-[22rem_minmax(0,1fr)] xl:gap-20">
          {/* Video: static wrapper — no overflow-hidden, no mask-image, no transform.
               iOS Safari refuses to paint <video> inside a compositing context
               (mask-image, overflow:hidden+border-radius, transform, filter, will-change).
               Solution: border-radius directly on <video>, shadow + poster on wrapper. */}
          <div className="order-2 flex w-full max-w-[19rem] justify-center justify-self-center md:max-w-[21rem] lg:order-1 lg:w-full lg:max-w-none">
            <div
              className="relative aspect-[9/16] w-full shrink-0 bg-[var(--amelia-purple-faint)]"
              style={{
                borderRadius: "1.5rem",
                boxShadow:
                  "0 32px 88px -40px color-mix(in srgb, var(--amelia-deep) 44%, transparent)",
                // Poster as CSS fallback (background behind the <video>, visible while loading)
                backgroundImage: "url('/amelia-video-poster.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <video
                className="absolute inset-0 h-full w-full object-cover"
                width={720}
                height={1280}
                src="/amelia-video.mp4"
                poster="/amelia-video-poster.jpg"
                playsInline
                preload="metadata"
                muted
                disableRemotePlayback
                controls
                style={{
                  borderRadius: "1.5rem",
                  // Clip corners on the <video> itself — no compositing context on ancestors
                }}
                aria-label="Vídeo institucional da Amélia Saúde"
              />
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
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
              A Amélia Saúde nasceu para transformar o jeito de cuidar da saúde no{" "}
              <em className="font-light italic text-[var(--amelia-purple)]">Rio de Janeiro.</em>
            </h2>
            <p
              className="mx-auto mt-7 max-w-xl font-sans font-light leading-relaxed text-[var(--amelia-body)] md:mt-8"
              style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)" }}
            >
              Operadora carioca com gestão moderna, ampla rede credenciada e um time dedicado ao
              cuidado das pessoas. Oferecemos um atendimento humanizado que faz a diferença para a
              sua saúde.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
