import type { Metadata } from "next";
import { App } from "@/rebranding/App.jsx";

export const metadata: Metadata = {
  title: "LGPD — Amélia Saúde",
  description:
    "Conheça seus direitos sob a Lei Geral de Proteção de Dados (LGPD) e entenda como a Amélia Saúde os garante.",
  robots: "index, follow",
  alternates: { canonical: "/lgpd" },
};

export default function LgpdPage() {
  return <App initialPath="/lgpd" />;
}
