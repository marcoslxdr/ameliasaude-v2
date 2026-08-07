"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const PURPLE = "#7b6bb2";
const ORBIT_RING_STROKE = "rgba(123,107,178,0.32)";
const ORBIT_RING_STROKE_OUTER = "rgba(123,107,178,0.18)";

const GOLDEN_ANGLE = 137.508; // 360 / φ²

/** Pedido do cliente: órbitas 1/3 menores (fator 2/3). Todos os raios derivam daqui. */
const ORBIT_SCALE = 2 / 3;

function archimedeanSpiralD(opts: {
  turns: number;
  maxR: number;
  steps?: number;
}): string {
  const { turns, maxR, steps = 96 } = opts;
  const maxAngle = turns * 2 * Math.PI;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxAngle;
    const r = Math.max(0.15, (i / steps) * maxR);
    const x = r * Math.cos(t - Math.PI / 2);
    const y = r * Math.sin(t - Math.PI / 2);
    d += (i === 0 ? "M" : "L") + `${x.toFixed(3)},${y.toFixed(3)}`;
  }
  return d;
}

const cities: { name: string; src: string }[] = [
  {
    name: "Rio de Janeiro",
    src: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=160&h=160&fit=crop&q=80",
  },
  {
    name: "Nova Iguaçu",
    src: "/nova-iguacu.webp",
  },
  {
    name: "Nilópolis",
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=160&h=160&fit=crop&q=80",
  },
  {
    name: "Belford Roxo",
    src: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=160&h=160&fit=crop&q=80",
  },
  {
    name: "São Gonçalo",
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=160&h=160&fit=crop&q=80",
  },
  {
    name: "Niterói",
    src: "/niteroi.webp",
  },
  {
    name: "São João de Meriti",
    src: "/sao-joao-de-meriti.jpg",
  },
  {
    name: "Duque de Caxias",
    src: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=160&h=160&fit=crop&q=80",
  },
  {
    name: "Magé",
    src: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=160&h=160&fit=crop&q=80",
  },
  {
    name: "Mesquita",
    src: "/mesquita.jpg",
  },
];

type OrbitNode = {
  city: (typeof cities)[number];
  left: number;
  top: number;
  zIndex: number;
};

/**
 * Ajustes em coordenadas polares (mesmo espaço que left/top %: centro em 50,50).
 * - dRadius: positivo = para fora, encostando na linha do anel externo.
 * - dAngleDeg: rotação em torno do centro (afasta aproxima vizinhos no arco).
 * - dz: empilhamento quando dois marcadores se cruzam.
 */
const ORBIT_POLAR_TWEAKS: Record<
  string,
  { dAngleDeg?: number; dRadius?: number; dz?: number }
> = {
  // Magé: leve afino no anel; Niterói / Nilópolis / Mesquita são reposicionadas depois
  "Magé": { dAngleDeg: -5, dRadius: 0.85 * ORBIT_SCALE },
};

/**
 * Âncora no centro do avatar. Label fica `absolute` (fora do fluxo).
 * O translate precisa estar no box com tamanho explícito (h/w do avatar):
 * pai com width:0 faz `translate(-50%)` no X virar 0 e empurra o círculo pra direita.
 */
function orbitAvatarAnchorClass(): string {
  return "relative h-10 w-10 -translate-x-1/2 -translate-y-1/2 sm:h-[3.75rem] sm:w-[3.75rem] md:h-[4.25rem] md:w-[4.25rem]";
}

/** Label mais estreito (wrap) — só no texto, nunca no container do avatar. */
const MARKER_COMPACT = new Set(["São Gonçalo", "Nova Iguaçu"]);

/** Quebra forçada do label (órbita intacta — só texto). */
const MARKER_LABEL_LINES: Record<string, string[]> = {
  "São João de Meriti": ["São João", "de Meriti"],
};

function orbitLabelLines(name: string): string[] {
  return MARKER_LABEL_LINES[name] ?? [name];
}
function buildDoubleOrbit(
  innerRadius: number,
  outerRadius: number
): OrbitNode[] {
  const n = cities.length;
  const perOrbit = Math.ceil(n / 2);
  const innerCities = cities.slice(0, perOrbit);
  const outerCities = cities.slice(perOrbit);

  const nodes: OrbitNode[] = [];

  innerCities.forEach((city, i) => {
    const angleDeg = (i * (360 / innerCities.length)) - 90; // start from top
    const rad = (angleDeg * Math.PI) / 180;
    nodes.push({
      city,
      left: 50 + innerRadius * Math.cos(rad),
      top: 50 + innerRadius * Math.sin(rad),
      zIndex: Math.round(50 - innerRadius),
    });
  });

  outerCities.forEach((city, i) => {
    const angleDeg = (i * (360 / outerCities.length)) - 90 + 36; // offset by 36deg for visual balance
    const rad = (angleDeg * Math.PI) / 180;
    nodes.push({
      city,
      left: 50 + outerRadius * Math.cos(rad),
      top: 50 + outerRadius * Math.sin(rad),
      zIndex: Math.round(50 - outerRadius),
    });
  });

  return nodes.sort((a, b) => b.zIndex - a.zIndex);
}

function applyOrbitPolarTweaks(nodes: OrbitNode[]): OrbitNode[] {
  return nodes.map((node) => {
    const tw = ORBIT_POLAR_TWEAKS[node.city.name];
    if (!tw) return node;

    const dx = node.left - 50;
    const dy = node.top - 50;
    let r = Math.hypot(dx, dy);
    let ang = Math.atan2(dy, dx);
    ang += ((tw.dAngleDeg ?? 0) * Math.PI) / 180;
    r += tw.dRadius ?? 0;

    return {
      ...node,
      left: 50 + r * Math.cos(ang),
      top: 50 + r * Math.sin(ang),
      zIndex: node.zIndex + (tw.dz ?? 0),
    };
  });
}

/** Niterói no mesmo anel de Magé, parte superior. Duque espelha Niterói por par vertical. */
function placeNiteroiBesideSaoGoncalo(nodes: OrbitNode[]): OrbitNode[] {
  const mage = nodes.find((n) => n.city.name === "Magé");
  const niteroi = nodes.find((n) => n.city.name === "Niterói");
  if (!mage || !niteroi) return nodes;

  const mageRadius = Math.hypot(mage.left - 50, mage.top - 50);
  const targetTop = 50 - mageRadius * 0.75;
  const verticalOffset = targetTop - 50;
  const horizontalOffset = Math.sqrt(
    Math.max(mageRadius * mageRadius - verticalOffset * verticalOffset, 0)
  );
  const zIndex = niteroi.zIndex + 4;

  return nodes.map((node) =>
    node.city.name === "Niterói"
      ? {
          ...node,
          left: 50 - horizontalOffset,
          top: targetTop,
          zIndex,
        }
      : node
  );
}

/** Par (direita, esquerda): a cidade da direita espelha a âncora da esquerda no eixo vertical. */
const ORBIT_MIRROR_PAIRS: [string, string][] = [
  ["Nova Iguaçu", "São Gonçalo"],
  ["Nilópolis", "Belford Roxo"],
  ["Duque de Caxias", "Niterói"],
  ["São João de Meriti", "Magé"],
];

/** Espelha o lado direito com base nas posições finais do lado esquerdo (mesmo raio do anel). */
function applyOrbitVerticalMirror(nodes: OrbitNode[]): OrbitNode[] {
  return nodes.map((node) => {
    const pair = ORBIT_MIRROR_PAIRS.find(([right]) => right === node.city.name);
    if (!pair) return node;

    const anchor = nodes.find((n) => n.city.name === pair[1]);
    if (!anchor) return node;

    const r = Math.hypot(anchor.left - 50, anchor.top - 50);
    const ang = Math.atan2(anchor.top - 50, anchor.left - 50);
    const mirroredAng = Math.PI - ang;

    return {
      ...node,
      left: 50 + r * Math.cos(mirroredAng),
      top: 50 + r * Math.sin(mirroredAng),
    };
  });
}

/** Mesquita espelha Rio no eixo vertical: mesmo raio/anel, 6h alinhado a 12h. */
function placeMesquitaMirrorOfRio(nodes: OrbitNode[]): OrbitNode[] {
  const rio = nodes.find((n) => n.city.name === "Rio de Janeiro");
  if (!rio) return nodes;

  return nodes.map((node) =>
    node.city.name === "Mesquita"
      ? {
          ...node,
          left: 50,
          top: 50 + ORBIT_OUTER_RADIUS,
        }
      : node
  );
}

/**
 * Subir levemente os marcadores marcados com pontos verdes no slide do
 * cliente (áudio WhatsApp 00: "Sobe só um pouquinho, até onde está o ponto").
 * dy negativo = para cima no espaço de coordenadas % (left/top).
 */
const ORBIT_LIFT: Record<string, number> = {
  "Magé": -3.5 * ORBIT_SCALE,
  "São João de Meriti": -3.5 * ORBIT_SCALE,
  "Mesquita": -3.5 * ORBIT_SCALE,
};

function applyOrbitLift(nodes: OrbitNode[]): OrbitNode[] {
  return nodes.map((node) => {
    const lift = ORBIT_LIFT[node.city.name];
    if (!lift) return node;
    return { ...node, top: node.top + lift };
  });
}

const SONAR_WAVES = 3;
const SONAR_DURATION = 3.2;
const SPIRAL_TURNS = 2.35;
const SPIRAL_MAX_R = 40 * ORBIT_SCALE; // ≈26.67 (era 40)

const ORBIT_INNER_RADIUS = 28 * ORBIT_SCALE; // ≈18.67 (era 28)
const ORBIT_OUTER_RADIUS = 43 * ORBIT_SCALE; // ≈28.67 (era 43)

export function CoverageOrbital() {
  const reduceMotion = useReducedMotion();

  const nodes = useMemo(() => {
    const base = applyOrbitPolarTweaks(
      buildDoubleOrbit(ORBIT_INNER_RADIUS, ORBIT_OUTER_RADIUS)
    );
    return applyOrbitLift(
      applyOrbitVerticalMirror(
        placeNiteroiBesideSaoGoncalo(placeMesquitaMirrorOfRio(base))
      )
    );
  }, []);

  const spiralD = useMemo(
    () => archimedeanSpiralD({ turns: SPIRAL_TURNS, maxR: SPIRAL_MAX_R }),
    []
  );

  return (
    <div
      className="relative mx-auto w-full max-w-[min(100%,min(96vw,920px))] aspect-square select-none overflow-visible [container-type:size]"
      aria-hidden
    >
      {/* Anéis de fundo — rotação lenta */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={
          reduceMotion
            ? { rotate: 0 }
            : { rotate: 360, scale: [1, 1.015, 1] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                rotate: { duration: 120, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "52%",
            height: "52%",
            boxShadow:
              "0 0 60px 20px rgba(123,107,178,0.06), 0 0 120px 40px rgba(123,107,178,0.03)",
          }}
          animate={reduceMotion ? {} : { opacity: [0.3, 0.7, 0.3] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* Órbitas onde as cidades ficam posicionadas */}
        {[0.56 * ORBIT_SCALE, 0.86 * ORBIT_SCALE].map((scale, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              border: `1.5px solid ${i === 0 ? ORBIT_RING_STROKE : ORBIT_RING_STROKE_OUTER}`,
            }}
          />
        ))}
      </motion.div>

      {/* Ondas sonar */}
      <div className="pointer-events-none absolute inset-0 z-[12] flex items-center justify-center">
        <svg
          className="h-[92%] w-[92%] max-h-[min(92vw,820px)] max-w-[min(92vw,820px)] overflow-visible"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <g transform="translate(50,50)">
            {Array.from({ length: SONAR_WAVES }, (_, i) => (
              <motion.g
                key={i}
                initial={false}
                animate={
                  reduceMotion
                    ? { scale: 0.72, opacity: 0.08 }
                    : {
                        scale: [0.28, 1.06],
                        opacity: [0.32, 0],
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: SONAR_DURATION,
                        repeat: Infinity,
                        ease: [0.22, 1, 0.36, 1],
                        delay: (i * SONAR_DURATION) / SONAR_WAVES,
                      }
                }
                style={{ transformOrigin: "0px 0px" }}
              >
                <path
                  d={spiralD}
                  fill="none"
                  stroke={PURPLE}
                  strokeOpacity={0.48}
                  strokeWidth={0.45}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </motion.g>
            ))}
          </g>
        </svg>
      </div>

      {/* Hub — logo Amélia */}
      <div
        className="absolute left-1/2 top-1/2 z-20 flex min-h-[min(20%,96px)] min-w-[min(20%,96px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_6px_28px_rgba(123,107,178,0.18),0_2px_8px_rgba(0,0,0,0.05)] sm:min-h-[min(22%,110px)] sm:min-w-[min(22%,110px)]"
        style={{ border: `1.5px solid ${PURPLE}2a` }}
      >
        <div className="relative h-10 w-[4.5rem] sm:h-12 sm:w-20">
          <Image
            src="/logo-amelia-site.png"
            alt="Amélia Saúde"
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>
      </div>

      {/* Cidades posicionadas nas órbitas */}
      {nodes.map(({ city, left, top, zIndex }, i) => {
        const compact = MARKER_COMPACT.has(city.name);
        const labelLines = orbitLabelLines(city.name);
        const stackedLabel = labelLines.length > 1;

        const labelClass = [
          "absolute left-1/2 top-full mt-1.5 -translate-x-1/2 text-center font-sans text-[9px] font-normal leading-tight tracking-wide text-[var(--amelia-deep)] sm:text-[11px] md:text-xs",
          stackedLabel
            ? "max-w-[min(14cqi,4.75rem)] whitespace-normal sm:leading-tight"
            : "sm:leading-none whitespace-normal sm:whitespace-nowrap",
          compact
            ? "max-w-[min(11cqi,3.25rem)] text-balance sm:max-w-[min(13cqi,4.25rem)]"
            : !stackedLabel && "max-w-[4.25rem] sm:max-w-none",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={city.name}
            className="pointer-events-none absolute overflow-visible"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              zIndex: 5 + zIndex,
              width: 0,
              height: 0,
            }}
          >
            {/*
              Translate no box com tamanho do avatar (não no pai width:0).
              Framer scale/opacity ficam no motion interno pra não sobrescrever o translate.
            */}
            <div className={orbitAvatarAnchorClass()}>
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.04 + i * 0.07,
                  type: "spring",
                  stiffness: 200,
                  damping: 22,
                }}
                className="h-full w-full origin-center"
              >
                <motion.div
                  animate={
                    reduceMotion ? { y: 0 } : { y: [0, -3, 0] }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 5 + i * 0.1,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.14,
                        }
                  }
                  className="relative h-full w-full"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[rgba(123,107,178,0.28)] shadow-[0_4px_16px_rgba(94,73,133,0.2)]">
                    <Image
                      src={city.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 40px, 68px"
                    />
                  </div>
                  <span className={labelClass}>
                    {stackedLabel
                      ? labelLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))
                      : city.name}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
