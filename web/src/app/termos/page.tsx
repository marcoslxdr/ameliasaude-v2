import type { Metadata } from "next";
import { App } from "@/rebranding/App.jsx";

export const metadata: Metadata = {
  title: "Termos de Uso — Amélia Saúde",
  description:
    "Condições gerais de uso do site e dos serviços digitais da Amélia Saúde. Leia atentamente antes de navegar.",
  robots: "index, follow",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return <App initialPath="/termos" />;
}
