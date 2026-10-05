import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProviderSearch } from "@/components/network/ProviderSearch";
import { networkUpdatedAt, providers } from "@/data/provider-network";

export const metadata: Metadata = {
  title: "Rede credenciada",
  description: "Hospitais, Clínicas e Laboratórios disponíveis para o seu plano e sua região.",
  alternates: { canonical: "/rede-credenciada" },
  robots: { index: providers.length > 0, follow: providers.length > 0 },
};

export default function RedeCredenciadaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main id="main-content" className="flex-1 bg-white">
        <header className="bg-[var(--amelia-deep)] px-5 pb-32 pt-36 text-white sm:px-8 sm:pt-40 lg:px-12">
          <div className="mx-auto max-w-[1084px]">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-white/75">Serviços · Amélia Saúde</p>
            <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">Rede credenciada</h1>
            <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-white/90 sm:text-lg">Hospitais, Clínicas e Laboratórios disponíveis para o seu plano e sua região.</p>
            <p className="mt-5 text-xs text-white/75">Dados recebidos em {networkUpdatedAt}. Confirme a disponibilidade antes do atendimento.</p>
          </div>
        </header>
        <ProviderSearch />
      </main>
      <Footer />
    </div>
  );
}
