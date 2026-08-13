import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CotacaoForm } from "@/components/sections/CotacaoForm";

export const metadata: Metadata = {
  title: "Cotação de plano de saúde | Amélia Saúde",
  description:
    "Simule seu plano de saúde Amélia Saúde: informe quantas vidas e as idades para receber uma proposta sob medida no Rio de Janeiro e Grande Rio.",
  alternates: {
    canonical: "/cotacao",
  },
};

export default function CotacaoPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <Navigation />
      <main id="main-content" className="min-h-0 flex-1">
        <CotacaoForm />
      </main>
      <Footer />
    </div>
  );
}
