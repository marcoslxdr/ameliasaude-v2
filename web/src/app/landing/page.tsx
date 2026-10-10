import type { Metadata } from "next";
import { App } from "@/rebranding/App.jsx";

const PAGE_URL = "https://www.ameliasaude.com.br/landing";

export const metadata: Metadata = {
  title: "Planos feitos para cuidar de você de verdade",
  description:
    "Conheça os planos de saúde empresariais e por adesão da Amélia Saúde, a rede de hospitais no Rio e Grande Rio e solicite sua cotação.",
  alternates: { canonical: "/landing" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Planos feitos para cuidar de você de verdade | Amélia Saúde",
    description:
      "Planos empresariais e por adesão, rede de hospitais no Rio e Grande Rio e cotação com a Amélia Saúde.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planos feitos para cuidar de você de verdade | Amélia Saúde",
    description:
      "Conheça os planos empresariais e por adesão da Amélia Saúde e solicite sua cotação.",
  },
};

export default function LandingPage() {
  return <App initialPath="/landing" />;
}
