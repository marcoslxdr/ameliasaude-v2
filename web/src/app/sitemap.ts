import type { MetadataRoute } from "next";
import { getPostTimestamp, getPublishedPosts } from "@/data/blog";

const SITE_URL = "https://www.ameliasaude.com.br";

const STATIC_PATHS: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.85, changeFrequency: "weekly" },
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

  const blogEntries: MetadataRoute.Sitemap = getPublishedPosts().map((post) => {
    const ts = getPostTimestamp(post);
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: ts ? new Date(ts) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [...staticEntries, ...blogEntries];
}