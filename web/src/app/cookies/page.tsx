import type { Metadata } from "next";
import { App } from "@/rebranding/App.jsx";

export const metadata: Metadata = {
  title: "Política de Cookies — Amélia Saúde",
  description:
    "Entenda como usamos cookies para melhorar sua experiência, garantir a segurança e personalizar nossos serviços.",
  robots: "index, follow",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return <App initialPath="/cookies" />;
}
