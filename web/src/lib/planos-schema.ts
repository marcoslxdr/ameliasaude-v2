/**
 * Structured data for planos pages.
 *
 * Uses schema.org Service (not Product) so we never emit a Product Offer
 * without a public price — health-plan pricing is commercial/proposal-only.
 * Aligns with Organization.makesOffer (Service) in StructuredData.tsx.
 */

const SITE_URL = "https://www.ameliasaude.com.br";

export type PlanoModality = "empresarial" | "adesao";

const MODALITIES: Record<
  PlanoModality,
  {
    name: string;
    description: string;
    category: string;
    path: string;
  }
> = {
  empresarial: {
    name: "Plano Empresarial Amélia Saúde",
    description:
      "Plano de saúde coletivo empresarial para empresas com 2 ou mais vidas no Rio de Janeiro.",
    category: "Plano de saúde empresarial",
    path: "/planos/empresarial",
  },
  adesao: {
    name: "Plano Coletivo por Adesão Amélia Saúde",
    description:
      "Plano de saúde coletivo por adesão via entidades de classe e categorias profissionais no Rio de Janeiro.",
    category: "Plano de saúde coletivo por adesão",
    path: "/planos/adesao",
  },
};

export function serviceSchema(modality: PlanoModality) {
  const m = MODALITIES[modality];
  const url = `${SITE_URL}${m.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: m.name,
    description: m.description,
    serviceType: m.category,
    category: m.category,
    url,
    provider: {
      "@type": "Organization",
      name: "Amélia Saúde",
      url: SITE_URL,
    },
    areaServed: { "@type": "City", name: "Rio de Janeiro" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      availableLanguage: "pt-BR",
    },
  };
}

export function planosItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Planos de saúde Amélia Saúde",
    description:
      "Planos de saúde empresariais e coletivos por adesão no Rio de Janeiro.",
    numberOfItems: 2,
    itemListElement: (["empresarial", "adesao"] as PlanoModality[]).map(
      (key, i) => {
        const service = serviceSchema(key);
        const { "@context": _c, ...item } = service;
        return {
          "@type": "ListItem",
          position: i + 1,
          item,
        };
      }
    ),
  };
}

/** Hub links for blog sidebar / post footers by content cluster. */
export function planosLinksForCategory(category: string): {
  href: string;
  label: string;
}[] {
  const c = category.toLowerCase();
  if (c.includes("empresarial")) {
    return [
      { href: "/planos/empresarial", label: "Plano empresarial" },
      { href: "/planos", label: "Todos os planos" },
    ];
  }
  if (c.includes("adesão") || c.includes("adesao")) {
    return [
      { href: "/planos/adesao", label: "Plano por adesão" },
      { href: "/planos", label: "Todos os planos" },
    ];
  }
  // Comparativos, regras, rede, marca, bem-estar genérico → hub dual
  return [
    { href: "/planos/empresarial", label: "Plano empresarial" },
    { href: "/planos/adesao", label: "Plano por adesão" },
    { href: "/planos", label: "Visão geral dos planos" },
  ];
}

export { SITE_URL };
