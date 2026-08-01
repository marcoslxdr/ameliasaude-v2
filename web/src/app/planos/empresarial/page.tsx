import type { Metadata } from "next";
import { ProductHubContent } from "@/components/planos/ProductHubContent";
import { serviceSchema, SITE_URL } from "@/lib/planos-schema";

const PAGE_URL = `${SITE_URL}/planos/empresarial`;

export const metadata: Metadata = {
  title: "Plano de saúde empresarial no Rio de Janeiro",
  description:
    "Plano de saúde coletivo empresarial Amélia Saúde para empresas com 2 ou mais vidas no Rio de Janeiro e Grande Rio. Contratação via CNPJ.",
  alternates: { canonical: "/planos/empresarial" },
  openGraph: {
    title: "Plano de saúde empresarial | Amélia Saúde",
    description:
      "Modalidade coletiva empresarial no Rio de Janeiro — a partir de 2 vidas, com orientação comercial para o RH.",
    url: PAGE_URL,
    type: "website",
  },
};

const serviceJsonLd = serviceSchema("empresarial");

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Planos", item: `${SITE_URL}/planos` },
    { "@type": "ListItem", position: 3, name: "Empresarial", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "A partir de quantas vidas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A referência institucional é a partir de 2 beneficiários. Confirme o mínimo e as condições na proposta vigente.",
      },
    },
    {
      "@type": "Question",
      name: "Serve para MEI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Empresas com CNPJ, incluindo MEI, podem avaliar a modalidade empresarial. Elegibilidade e documentação dependem do produto.",
      },
    },
    {
      "@type": "Question",
      name: "Posso incluir dependentes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, conforme regras do contrato (cônjuge, filhos e demais graus aceitos no produto).",
      },
    },
  ],
};

export default function PlanosEmpresarialPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ProductHubContent variant="empresarial" />
    </>
  );
}
