import type { Metadata } from "next";
import { PlanosContent } from "@/components/planos/PlanosContent";
import { planosItemListSchema, SITE_URL } from "@/lib/planos-schema";

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

const itemListSchema = planosItemListSchema();

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
    { "@id": `${SITE_URL}/planos/empresarial#service` },
    { "@id": `${SITE_URL}/planos/adesao#service` },
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
