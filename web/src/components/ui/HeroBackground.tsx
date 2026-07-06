"use client";

import { useId } from "react";

type HeroBackgroundProps = {
  className?: string;
};

export function HeroBackground({ className = "" }: HeroBackgroundProps) {
  const grainFilterId = `amelia-grain-${useId().replace(/:/g, "")}`;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(152deg, var(--amelia-white) 0%, var(--amelia-surface) 38%, var(--amelia-purple-mist) 100%)",
        }}
      />

      <div
        className="absolute top-0 right-0 h-[70%] w-[58%]"
        style={{
          background:
            "radial-gradient(ellipse at 78% 12%, color-mix(in srgb, var(--amelia-purple) 22%, transparent) 0%, transparent 65%)",
        }}
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
            opacity: 0.45,
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
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, transparent 42%, color-mix(in srgb, var(--amelia-white) 55%, transparent) 100%)",
          }}
        />
      </div>
    </div>
  );
}
