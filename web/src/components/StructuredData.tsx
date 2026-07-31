import React from "react";

const SITE_URL = "https://www.ameliasaude.com.br";

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs?: string[];
}

interface ArticleData {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: { name: string };
  publisher: { name: string; logo: string };
  url: string;
  articleSection?: string;
  keywords?: string;
}

interface BreadcrumbData {
  items: { name: string; url: string }[];
}

interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  image: string;
  priceRange: string;
  areaServed: string[];
}

type SchemaType = "Organization" | "Article" | "BreadcrumbList" | "LocalBusiness" | "FAQPage" | "WebSite" | "HealthAndBeautyBusiness";

interface Props {
  type: SchemaType;
  data: OrganizationData | ArticleData | BreadcrumbData | LocalBusinessData | Record<string, unknown>;
}

function buildSchema(type: SchemaType, data: Record<string, unknown>): Record<string, unknown> {
  const base = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case "Organization":
      return {
        ...base,
        ...data,
        "@id": `${SITE_URL}/#organization`,
      };
    case "Article":
      return {
        ...base,
        ...data,
        mainEntityOfPage: { "@type": "WebPage", "@id": (data.url as string) || SITE_URL },
      };
    case "BreadcrumbList": {
      const items = (data as unknown as BreadcrumbData).items;
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      };
    }
    default:
      return { ...base, ...data };
  }
}

export function StructuredData({ type, data }: Props) {
  const schema = buildSchema(type, data as Record<string, unknown>);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Pre-built Organization schema for Amélia Saúde — use in root layout */
export function OrganizationSchema() {
  const orgData = {
    name: "Amélia Saúde",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-amelia-site.png`,
    description:
      "Operadora de planos de saúde empresariais e por adesão no Rio de Janeiro. Planos para MEI, PMEs, sindicatos, conselhos e associações profissionais.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Rio Branco, 185 — Sala 1201",
      addressLocality: "Rio de Janeiro",
      addressRegion: "RJ",
      postalCode: "20040-007",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-21-xxxx-xxxx",
      contactType: "customer service",
      email: "contato@ameliasaude.com.br",
    },
    sameAs: [
      SITE_URL,
      "https://www.instagram.com/ameliasauderj/",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Plano de Saúde Empresarial",
          description:
            "Planos coletivos empresariais para empresas no Rio de Janeiro",
          url: `${SITE_URL}/planos/empresarial`,
          areaServed: { "@type": "City", name: "Rio de Janeiro" },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Plano de Saúde Coletivo por Adesão",
          description:
            "Planos coletivos por adesão via entidades de classe no Rio de Janeiro",
          url: `${SITE_URL}/planos/adesao`,
          areaServed: { "@type": "City", name: "Rio de Janeiro" },
        },
      },
    ],
  };

  return (
    <StructuredData type="Organization" data={orgData} />
  );
}

/** Pre-built WebSite schema for Amélia Saúde — use in root layout */
export function WebSiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "Amélia Saúde",
          description:
            "Operadora de planos de saúde empresariais e por adesão no Rio de Janeiro. Planos para MEI, PMEs, sindicatos, conselhos e associações profissionais.",
          inLanguage: "pt-BR",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }),
      }}
    />
  );
}

/** Pre-built LocalBusiness schema */
export function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HealthAndBeautyBusiness",
          "@id": `${SITE_URL}/#localbusiness`,
          name: "Amélia Saúde",
          description:
            "Operadora de planos de saúde empresariais e por adesão no Rio de Janeiro. Planos para MEI, PMEs, sindicatos, conselhos e associações profissionais.",
          url: SITE_URL,
          telephone: "+55-21-xxxx-xxxx",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Rio Branco, 185 — Sala 1201",
            addressLocality: "Rio de Janeiro",
            addressRegion: "RJ",
            postalCode: "20040-007",
            addressCountry: "BR",
          },
          image: `${SITE_URL}/logo-amelia-site.png`,
          priceRange: "$$",
          areaServed: [
            { "@type": "City", name: "Rio de Janeiro" },
            { "@type": "City", name: "Niterói" },
            { "@type": "City", name: "Nova Iguaçu" },
            { "@type": "City", name: "Petrópolis" },
            { "@type": "City", name: "São João de Meriti" },
            { "@type": "City", name: "Mesquita" },
          ],
          sameAs: [SITE_URL],
        }),
      }}
    />
  );
}
