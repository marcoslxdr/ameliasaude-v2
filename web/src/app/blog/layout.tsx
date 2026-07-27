import type { Metadata } from "next";

const SITE_URL = "https://www.ameliasaude.com.br";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guias práticos sobre planos de saúde, coletivo por adesão, rede credenciada, carência e contratação no Rio de Janeiro — conteúdo da Amélia Saúde.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Amélia Saúde",
    description:
      "Conteúdo sobre planos de saúde, adesão, rede e direitos do beneficiário no Rio de Janeiro.",
    url: `${SITE_URL}/blog`,
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Amélia Saúde",
    description:
      "Conteúdo sobre planos de saúde, adesão, rede e direitos do beneficiário no Rio de Janeiro.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
