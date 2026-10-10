import { Building2, Users } from "lucide-react";
const COTACAO_HREF = "/cotacao";
export type ProductHubVariant = "empresarial" | "adesao";

export const products = [
  {
    id: "empresarial",
    badge: "Para empresas (CNPJ)",
    title: "Plano empresarial",
    subtitle: "Para sua empresa",
    description:
      "Plano de saúde coletivo empresarial para empresas com 2 ou mais vidas no Rio de Janeiro e Grande Rio. Ideal para MEI, micro, pequenas e médias empresas que querem oferecer benefício de saúde com contratação via CNPJ.",
    who: [
      "Empresas com CNPJ ativo",
      "A partir de 2 beneficiários",
      "MEI, PME e corporativo",
      "Dependentes conforme contrato",
    ],
    highlights: [
      "Contratação coletiva empresarial",
      "Rede no Rio de Janeiro e Grande Rio",
      "Condições negociadas por perfil de vidas",
      "Suporte comercial para o RH",
    ],
    ctaLabel: "Falar sobre plano empresarial",
    ctaHref: COTACAO_HREF,
    icon: Building2,
    href: "/planos/empresarial",
  },
  {
    id: "adesao",
    badge: "Por categoria profissional",
    title: "Plano coletivo por adesão",
    subtitle: "Pela sua categoria",
    description:
      "Plano de saúde coletivo por adesão via entidades de classe e categorias profissionais no Rio de Janeiro. Para quem tem vínculo com sindicato, conselho, associação ou entidade homologada.",
    who: [
      "Profissionais com vínculo de classe",
      "Sindicatos, conselhos e associações",
      "Você e sua família (conforme regras)",
      "Sem necessidade de CNPJ próprio",
    ],
    highlights: [
      "Contratação via entidade de classe",
      "Modalidade coletiva por adesão",
      "Elegibilidade conforme vínculo aceito",
      "Orientação sobre documentos e portabilidade",
    ],
    ctaLabel: "Falar sobre plano por adesão",
    ctaHref: COTACAO_HREF,
    icon: Users,
    href: "/planos/adesao",
  },
] as const;

export const compareRows = [
  {
    label: "Como contrata",
    empresarial: "Via CNPJ da empresa",
    adesao: "Via entidade de classe",
  },
  {
    label: "Quem é elegível",
    empresarial: "Sócios e colaboradores + dependentes",
    adesao: "Profissional vinculado + dependentes",
  },
  {
    label: "Mínimo típico",
    empresarial: "A partir de 2 vidas",
    adesao: "Conforme regras da entidade e produto",
  },
  {
    label: "Território",
    empresarial: "Rio de Janeiro e Grande Rio",
    adesao: "Rio de Janeiro e Grande Rio",
  },
] as const;

export const planDetailCopy: Record<
  ProductHubVariant,
  {
    badge: string;
    h1: string;
    lead: string;
    whoTitle: string;
    who: string[];
    diffs: string[];
    faqs: { q: string; a: string }[];
    ctaLabel: string;
    ctaHref: string;
    otherLabel: string;
    otherHref: string;
  }
> = {
  empresarial: {
    badge: "Plano coletivo empresarial",
    h1: "Plano de saúde empresarial Amélia Saúde | Rio de Janeiro",
    lead: "Modalidade coletiva empresarial para empresas com CNPJ no Rio de Janeiro e Grande Rio. A partir de 2 vidas, com condições alinhadas ao perfil do grupo e suporte para o RH.",
    whoTitle: "Quem pode contratar",
    who: [
      "Empresas com CNPJ ativo",
      "MEI, micro, pequenas e médias empresas",
      "Grupos a partir de 2 beneficiários",
      "Dependentes conforme regras do produto",
    ],
    diffs: [
      "Contratação via empresa (CNPJ)",
      "Rede e cobertura conforme proposta e contrato",
      "Orientação comercial para comparação de produtos",
      "Atendimento sem burocracia desnecessária",
    ],
    faqs: [
      {
        q: "A partir de quantas vidas?",
        a: "A referência institucional é a partir de 2 beneficiários. Confirme o mínimo e as condições na proposta vigente.",
      },
      {
        q: "Serve para MEI?",
        a: "Empresas com CNPJ, incluindo MEI, podem avaliar a modalidade empresarial. Elegibilidade e documentação dependem do produto.",
      },
      {
        q: "Posso incluir dependentes?",
        a: "Sim, conforme regras do contrato (cônjuge, filhos e demais graus aceitos no produto).",
      },
    ],
    ctaLabel: "Falar sobre plano empresarial",
    ctaHref: COTACAO_HREF,
    otherLabel: "Ver plano por adesão",
    otherHref: "/planos/adesao",
  },
  adesao: {
    badge: "Plano coletivo por adesão",
    h1: "Plano de saúde coletivo por adesão Amélia Saúde | Rio de Janeiro",
    lead: "Modalidade coletiva por adesão para profissionais vinculados a entidades de classe — sindicatos, conselhos e associações — no Rio de Janeiro e Grande Rio.",
    whoTitle: "Quem pode contratar",
    who: [
      "Profissionais com vínculo aceito pela entidade",
      "Associados a sindicatos, conselhos ou associações",
      "Você e dependentes, conforme regras do produto",
      "Sem necessidade de contratar via CNPJ próprio",
    ],
    diffs: [
      "Contratação mediada por entidade de classe",
      "Elegibilidade depende do vínculo e da entidade",
      "Orientação sobre documentos e portabilidade",
      "Rede e cobertura conforme proposta e contrato",
    ],
    faqs: [
      {
        q: "Preciso de CNPJ?",
        a: "Não para a modalidade por adesão. O caminho típico é o vínculo com uma entidade de classe homologada.",
      },
      {
        q: "Qualquer categoria profissional entra?",
        a: "Não. A elegibilidade depende das entidades e categorias aceitas no produto vigente.",
      },
      {
        q: "Posso levar a família?",
        a: "Dependentes podem ser incluídos conforme as regras do contrato e da entidade.",
      },
    ],
    ctaLabel: "Falar sobre plano por adesão",
    ctaHref: COTACAO_HREF,
    otherLabel: "Ver plano empresarial",
    otherHref: "/planos/empresarial",
  },
};
