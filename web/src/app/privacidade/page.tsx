import type { Metadata } from "next";
import { App } from "@/rebranding/App.jsx";

export const metadata: Metadata = {
  title: "Política de Privacidade — Amélia Saúde",
  description:
    "Saiba como a Amélia Saúde coleta, protege e utiliza seus dados pessoais. Transparência e segurança em cada etapa.",
  robots: "index, follow",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return <App initialPath="/privacidade" />;
}
