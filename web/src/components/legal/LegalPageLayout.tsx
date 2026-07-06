"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getButtonClassName } from "@/lib/button-styles";

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  summary: string[];
  lastUpdated: string;
  children: React.ReactNode;
}

const LEGAL_NAV = [
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Termos de Uso", href: "/termos" },
  { label: "Política de Cookies", href: "/cookies" },
  { label: "LGPD", href: "/lgpd" },
] as const;

export function LegalPageLayout({
  title,
  subtitle,
  summary,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Hero / Header */}
        <section
          className="bg-white border-b border-[var(--amelia-line)]"
          style={{ padding: "clamp(5rem, 12vh, 7rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 5vh, 3rem)" }}
        >
          <div className="mx-auto max-w-[780px]">
            <h1
              className="font-display font-normal text-[#7b6bb2]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 font-sans font-light text-[#5c5470] text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed max-w-[600px]">
                {subtitle}
              </p>
            )}

            {/* Summary box */}
            <div className="mt-8 rounded-r-xl border-l-[3px] border-[#7b6bb2] bg-[rgba(123,107,178,0.06)] px-6 py-5">
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#7b6bb2]">
                Resumo para você
              </p>
              <ul className="flex flex-col gap-2">
                {summary.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#7b6bb2]" />
                    <span className="font-sans text-sm leading-relaxed text-[#4a4a4a]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Legal nav tabs */}
        <nav
          className="sticky top-[72px] z-30 border-b border-[var(--amelia-line)] bg-white/95 backdrop-blur-md"
          aria-label="Navegação entre políticas legais"
        >
          <div className="mx-auto flex max-w-[780px] gap-1 overflow-x-auto px-[clamp(1.5rem,5vw,5rem)] py-3">
            {LEGAL_NAV.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getButtonClassName(
                    isActive ? "pagination-active" : "pagination",
                    "md",
                    "shrink-0 font-medium",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main legal content */}
        <article
          className="mx-auto max-w-[780px] px-[clamp(1.5rem,5vw,5rem)]"
          style={{ paddingTop: "clamp(2rem,5vh,3rem)", paddingBottom: "clamp(3rem,8vh,5rem)" }}
        >
          <div className="prose-legal">{children}</div>

          <p className="mt-12 border-t border-[var(--amelia-line)] pt-6 font-sans text-xs text-[#8a8a8a]">
            Última atualização: {lastUpdated}
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
