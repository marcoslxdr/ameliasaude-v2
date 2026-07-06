/**
 * Amélia Saúde — estilos de botão (padrão: CTA "Quero meu plano" — pill / rounded-full).
 * Usar via `<Button />` ou `getButtonClassName()` em Links externos ao componente.
 */

export type ButtonVariant =
  | "primary"
  | "purple"
  | "outline"
  | "ghost-white"
  | "ghost-purple"
  | "ghost-link"
  | "pagination"
  | "pagination-active";

export type ButtonSize = "sm" | "md";

export const buttonBase =
  "inline-flex items-center justify-center gap-1.5 sm:gap-2 font-sans tracking-wide cursor-pointer transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-full whitespace-nowrap";

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "text-[11px] sm:text-xs font-semibold px-4 py-2 sm:px-5 sm:py-2.5",
  md: "text-sm font-normal px-8 py-3.5",
};

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--amelia-deep)] text-white shadow-lg hover:bg-[#4a3a6b] focus-visible:outline-[var(--amelia-deep)]",
  purple:
    "bg-[var(--amelia-purple)] text-white border border-[var(--amelia-purple)] hover:bg-[var(--amelia-deep)] hover:border-[var(--amelia-deep)] focus-visible:outline-[var(--amelia-purple)]",
  outline:
    "bg-transparent text-[var(--amelia-purple)] border border-[var(--amelia-purple)] hover:bg-[var(--amelia-purple)] hover:text-white focus-visible:outline-[var(--amelia-purple)]",
  "ghost-white":
    "bg-transparent text-white border border-white/40 hover:bg-white hover:text-[var(--amelia-deep)] hover:border-white focus-visible:outline-white",
  "ghost-purple":
    "bg-transparent text-[var(--amelia-purple)] border-0 px-0 py-2 hover:text-[var(--amelia-deep)] underline-offset-4 hover:underline focus-visible:outline-[var(--amelia-purple)]",
  "ghost-link":
    "bg-transparent border-0 px-0 py-2 text-[var(--amelia-deep)]/60 hover:text-[var(--amelia-deep)] font-normal text-xs sm:text-sm focus-visible:outline-[var(--amelia-deep)]",
  pagination:
    "text-sm text-gray-600 border border-[#e4dcf5] px-4 py-2 hover:bg-[var(--amelia-purple)] hover:text-white hover:border-[var(--amelia-purple)] focus-visible:outline-[var(--amelia-purple)]",
  "pagination-active":
    "text-sm bg-[var(--amelia-purple)] text-white px-4 py-2 focus-visible:outline-[var(--amelia-purple)]",
};

export const buttonMotionHover = {
  scale: 1.03,
  boxShadow:
    "0 20px 48px color-mix(in srgb, var(--amelia-deep) 35%, transparent)",
} as const;

export const buttonMotionTap = { scale: 0.97 } as const;

export const buttonMotionTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

export function getButtonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
): string {
  const sizeClass =
    variant === "ghost-purple" || variant === "ghost-link"
      ? ""
      : variant.startsWith("pagination")
        ? ""
        : buttonSizes[size];

  return [buttonBase, sizeClass, buttonVariants[variant], className]
    .filter(Boolean)
    .join(" ");
}
