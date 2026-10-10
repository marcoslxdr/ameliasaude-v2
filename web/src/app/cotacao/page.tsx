import type { Metadata } from "next";
import { App } from "@/rebranding/App.jsx";

export const metadata: Metadata = {
  title: "Cotação de plano de saúde | Amélia Saúde",
  description:
    "Simule seu plano de saúde Amélia Saúde: informe quantas vidas e as idades para receber uma proposta sob medida no Rio de Janeiro e Grande Rio.",
  alternates: {
    canonical: "/cotacao",
  },
};

export default function CotacaoPage() {
  return <App initialPath="/cotacao" />;
}
