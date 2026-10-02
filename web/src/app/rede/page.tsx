import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { NetworkDirectory } from "@/components/network/NetworkDirectory";

export const metadata: Metadata = {
  title: "Rede credenciada no Rio de Janeiro e Grande Rio",
  description:
    "Consulte prestadores, especialidades e serviços da rede credenciada Amélia Saúde por município e plano.",
  alternates: { canonical: "/rede" },
};

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-[#faf9fc]">
      <Navigation />
      <main className="pt-28 sm:pt-32">
        <header className="px-6 pb-12 pt-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1180px]">
            <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7b6bb2]">Amélia Saúde · Rio de Janeiro e Grande Rio</p>
            <h1 className="max-w-3xl font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.04] tracking-[-0.02em] text-[#382e4e]">Encontre um prestador da nossa rede</h1>
            <p className="mt-5 max-w-2xl font-sans text-[clamp(1rem,1.8vw,1.2rem)] font-light leading-relaxed text-[#625b70]">Pesquise por prestador, especialidade, município, tipo de atendimento ou rede do plano.</p>
          </div>
        </header>
        <NetworkDirectory />
      </main>
      <Footer />
    </div>
  );
}
