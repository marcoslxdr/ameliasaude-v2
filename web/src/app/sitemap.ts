import type { MetadataRoute } from "next";

const SITE_URL = "https://www.ameliasaude.com.br";

const STATIC_PATHS: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/planos", priority: 0.95, changeFrequency: "monthly" },
  { path: "/rede-credenciada", priority: 0.9, changeFrequency: "weekly" },
  { path: "/planos/empresarial", priority: 0.9, changeFrequency: "monthly" },
  { path: "/planos/adesao", priority: 0.9, changeFrequency: "monthly" },
  { path: "/privacidade", priority: 0.4, changeFrequency: "yearly" },
  { path: "/termos", priority: 0.4, changeFrequency: "yearly" },
  { path: "/lgpd", priority: 0.4, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  return staticEntries;
}
