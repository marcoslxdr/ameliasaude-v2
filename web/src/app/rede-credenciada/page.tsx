import type { Metadata } from "next";
import { App } from "@/rebranding/App.jsx";
import { providers } from "@/data/provider-network";

export const metadata: Metadata = {
  title: "Rede credenciada",
  description: "Hospitais, Clínicas e Laboratórios disponíveis para o seu plano e sua região.",
  alternates: { canonical: "/rede-credenciada" },
  robots: { index: providers.length > 0, follow: providers.length > 0 },
};

export default function RedeCredenciadaPage() {
  return <App initialPath="/rede-credenciada" />;
}
