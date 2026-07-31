import type { Metadata } from "next";
import { PlanosContent } from "@/components/planos/PlanosContent";

const SITE_URL = "https://www.ameliasaude.com.br";
const PAGE_URL = `${SITE_URL}/planos`;

export const metadata: Metadata = {
  title: "Planos de saúde no Rio de Janeiro: empresarial e por adesão",
  description:
    "Amélia Saúde oferece planos de saúde empresariais para empresas de todos os portes e planos coletivos por adesão via entidades de classe no Rio de Janeiro e Grande Rio.",
  alternates: {
    canonical: "/planos",
  },
  openGraph: {
    title: "Planos de saúde no Rio de Janeiro: empresarial e por adesão | Amélia",
    description:
      "Planos empresariais e coletivos por adesão no Rio de Janeiro. Compare modalidades e fale com a Amélia Saúde.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planos de saúde: empresarial e por adesão | Amélia Saúde",
    description:
      "Duas modalidades coletivas no Rio de Janeiro — empresarial (CNPJ) e por adesão (entidades de classe).",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Planos de saúde Amélia Saúde",
  description:
    "Planos de saúde empresariais e coletivos por adesão no Rio de Janeiro.",
  numberOfItems: 2,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        "@id": `${SITE_URL}/planos/empresarial#product`,
        name: "Plano Empresarial Amélia Saúde",
        description:
          "Plano de saúde coletivo empresarial para empresas com 2 ou mais vidas no Rio de Janeiro.",
        category: "Plano de saúde empresarial",
        brand: {
          "@type": "Brand",
          name: "Amélia Saúde",
        },
        url: `${SITE_URL}/planos/empresarial`,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/planos/empresarial`,
          areaServed: { "@type": "City", name: "Rio de Janeiro" },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        "@id": `${SITE_URL}/planos/adesao#product`,
        name: "Plano Coletivo por Adesão Amélia Saúde",
        description:
          "Plano de saúde coletivo por adesão via entidades de classe e categorias profissionais no Rio de Janeiro.",
        category: "Plano de saúde coletivo por adesão",
        brand: {
          "@type": "Brand",
          name: "Amélia Saúde",
        },
        url: `${SITE_URL}/planos/adesao`,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/planos/adesao`,
          areaServed: { "@type": "City", name: "Rio de Janeiro" },
        },
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Planos",
      item: PAGE_URL,
    },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: "Planos de saúde empresariais e por adesão no Rio de Janeiro",
  description:
    "Amélia Saúde oferece planos de saúde empresariais para empresas de todos os portes e planos coletivos por adesão via entidades de classe no Rio de Janeiro e Grande Rio.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: [
    { "@id": `${SITE_URL}/planos/empresarial#product` },
    { "@id": `${SITE_URL}/planos/adesao#product` },
  ],
  inLanguage: "pt-BR",
};

export default function PlanosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <PlanosContent />
    </>
  );
}
