import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Amélia Saúde",
  description:
    "Acompanhe as novidades, dicas de saúde e informações sobre planos de saúde no Rio de Janeiro. Conteúdo atualizado pela equipe Amélia Saúde.",
  alternates: {
    canonical: "https://www.ameliasaude.com.br/blog",
  },
  openGraph: {
    title: "Blog — Amélia Saúde",
    description:
      "Acompanhe as novidades, dicas de saúde e informações sobre planos de saúde no Rio de Janeiro.",
    url: "https://www.ameliasaude.com.br/blog",
    siteName: "Amélia Saúde",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Amélia Saúde",
    description:
      "Acompanhe as novidades, dicas de saúde e informações sobre planos de saúde no Rio de Janeiro.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
