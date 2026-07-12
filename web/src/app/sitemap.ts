import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";

const SITE_URL = "https://www.ameliasaude.com.br";

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.85, changeFrequency: "weekly" },
  { path: "/privacidade", priority: 0.4, changeFrequency: "yearly" },
  { path: "/termos", priority: 0.4, changeFrequency: "yearly" },
  { path: "/lgpd", priority: 0.4, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

const MONTH_MAP: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

function parseBlogDate(date: string): Date {
  const [day, mon, year] = date.split(" ");
  const month = MONTH_MAP[mon];
  if (day && month && year) {
    return new Date(`${year}-${month}-${day.padStart(2, "0")}T12:00:00.000Z`);
  }
  return new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: parseBlogDate(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}