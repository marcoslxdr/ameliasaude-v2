import type { Metadata } from "next";
import { ProductHubContent } from "@/components/planos/ProductHubContent";

const SITE_URL = "https://www.ameliasaude.com.br";
const PAGE_URL = `${SITE_URL}/planos/adesao`;

export const metadata: Metadata = {
  title: "Plano de saúde coletivo por adesão no Rio de Janeiro",
  description:
    "Plano de saúde coletivo por adesão Amélia Saúde via entidades de classe no Rio de Janeiro. Para profissionais e famílias elegíveis.",
  alternates: { canonical: "/planos/adesao" },
  openGraph: {
    title: "Plano coletivo por adesão | Amélia Saúde",
    description:
      "Modalidade por adesão via sindicatos, conselhos e associações no Rio de Janeiro e Grande Rio.",
    url: PAGE_URL,
    type: "website",
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${PAGE_URL}#product`,
  name: "Plano Coletivo por Adesão Amélia Saúde",
  description:
    "Plano de saúde coletivo por adesão via entidades de classe e categorias profissionais no Rio de Janeiro.",
  category: "Plano de saúde coletivo por adesão",
  brand: { "@type": "Brand", name: "Amélia Saúde" },
  url: PAGE_URL,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    url: PAGE_URL,
    areaServed: { "@type": "City", name: "Rio de Janeiro" },
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Planos", item: `${SITE_URL}/planos` },
    { "@type": "ListItem", position: 3, name: "Por adesão", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Preciso de CNPJ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não para a modalidade por adesão. O caminho típico é o vínculo com uma entidade de classe homologada.",
      },
    },
    {
      "@type": "Question",
      name: "Qualquer categoria profissional entra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. A elegibilidade depende das entidades e categorias aceitas no produto vigente.",
      },
    },
    {
      "@type": "Question",
      name: "Posso levar a família?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dependentes podem ser incluídos conforme as regras do contrato e da entidade.",
      },
    },
  ],
};

export default function PlanosAdesaoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ProductHubContent variant="adesao" />
    </>
  );
}
