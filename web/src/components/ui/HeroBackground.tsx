"use client";

import { useId } from "react";

export type HeroBackgroundVariant =
  | "hero"
  | "origin"
  | "bloom"
  | "haze"
  | "veil";

type VariantConfig = {
  gradient: string;
  glowClassName: string;
  glowBackground: string;
  textureFade: string;
  weaveOpacity: number;
};

const VARIANTS: Record<HeroBackgroundVariant, VariantConfig> = {
  hero: {
    gradient:
      "linear-gradient(152deg, var(--amelia-white) 0%, var(--amelia-surface) 38%, var(--amelia-purple-mist) 100%)",
    glowClassName: "absolute top-0 right-0 h-[70%] w-[58%]",
    glowBackground:
      "radial-gradient(ellipse at 78% 12%, color-mix(in srgb, var(--amelia-purple) 22%, transparent) 0%, transparent 65%)",
    textureFade:
      "linear-gradient(105deg, transparent 0%, transparent 42%, color-mix(in srgb, var(--amelia-white) 55%, transparent) 100%)",
    weaveOpacity: 0.45,
  },
  origin: {
    gradient:
      "linear-gradient(198deg, var(--amelia-white) 0%, var(--amelia-surface) 44%, var(--amelia-purple-mist) 100%)",
    glowClassName: "absolute top-0 left-0 h-[68%] w-[54%]",
    glowBackground:
      "radial-gradient(ellipse at 22% 16%, color-mix(in srgb, var(--amelia-purple) 19%, transparent) 0%, transparent 63%)",
    textureFade:
      "linear-gradient(255deg, transparent 0%, transparent 40%, color-mix(in srgb, var(--amelia-white) 52%, transparent) 100%)",
    weaveOpacity: 0.42,
  },
  bloom: {
    gradient:
      "linear-gradient(168deg, var(--amelia-white) 0%, var(--amelia-surface) 36%, color-mix(in srgb, var(--amelia-purple-mist) 88%, var(--amelia-white)) 100%)",
    glowClassName: "absolute bottom-0 left-1/2 h-[62%] w-[72%] -translate-x-1/2",
    glowBackground:
      "radial-gradient(ellipse at 50% 88%, color-mix(in srgb, var(--amelia-purple) 16%, transparent) 0%, transparent 68%)",
    textureFade:
      "linear-gradient(180deg, transparent 0%, transparent 48%, color-mix(in srgb, var(--amelia-white) 48%, transparent) 100%)",
    weaveOpacity: 0.4,
  },
  haze: {
    gradient:
      "linear-gradient(142deg, var(--amelia-white) 0%, color-mix(in srgb, var(--amelia-surface) 92%, var(--amelia-white)) 46%, var(--amelia-surface) 100%)",
    glowClassName: "absolute top-0 left-1/2 h-[56%] w-[64%] -translate-x-1/2",
    glowBackground:
      "radial-gradient(ellipse at 50% 8%, color-mix(in srgb, var(--amelia-purple) 14%, transparent) 0%, transparent 70%)",
    textureFade:
      "linear-gradient(90deg, color-mix(in srgb, var(--amelia-white) 18%, transparent) 0%, transparent 35%, transparent 65%, color-mix(in srgb, var(--amelia-white) 18%, transparent) 100%)",
    weaveOpacity: 0.38,
  },
  veil: {
    gradient:
      "linear-gradient(172deg, var(--amelia-surface) 0%, var(--amelia-white) 32%, var(--amelia-purple-mist) 100%)",
    glowClassName: "absolute bottom-0 right-0 h-[58%] w-[50%]",
    glowBackground:
      "radial-gradient(ellipse at 82% 78%, color-mix(in srgb, var(--amelia-deep) 12%, transparent) 0%, transparent 66%)",
    textureFade:
      "linear-gradient(315deg, transparent 0%, transparent 38%, color-mix(in srgb, var(--amelia-white) 50%, transparent) 100%)",
    weaveOpacity: 0.44,
  },
};

type HeroBackgroundProps = {
  className?: string;
  variant?: HeroBackgroundVariant;
};

export function HeroBackground({
  className = "",
  variant = "hero",
}: HeroBackgroundProps) {
  const grainFilterId = `amelia-grain-${useId().replace(/:/g, "")}`;
  const config = VARIANTS[variant];

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{ background: config.gradient }}
      />

      <div
        className={config.glowClassName}
        style={{ background: config.glowBackground }}
      />

      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 5px,
                color-mix(in srgb, var(--amelia-purple) 6%, transparent) 5px,
                color-mix(in srgb, var(--amelia-purple) 6%, transparent) 6px
              ),
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 5px,
                color-mix(in srgb, var(--amelia-purple) 6%, transparent) 5px,
                color-mix(in srgb, var(--amelia-purple) 6%, transparent) 6px
              )
            `,
            opacity: config.weaveOpacity,
            mixBlendMode: "multiply",
          }}
        />

        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id={grainFilterId}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.72"
                numOctaves="4"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.482
                        0 0 0 0 0.427
                        0 0 0 0 0.698
                        0 0 0 0.12 0"
                in="noise"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter={`url(#${grainFilterId})`} />
        </svg>

        <div
          className="absolute inset-0"
          style={{ background: config.textureFade }}
        />
      </div>
    </div>
  );
}
