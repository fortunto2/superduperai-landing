import { MetadataRoute } from "next";
import {
  allTools,
  allCases,
  allPages,
  allBlogs,
  allHomes,
} from ".contentlayer/generated";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "superduperai.co";
  const site = `https://${baseUrl}`;

  type Entry = { path: string; locale: string; lastMod: Date };
  const entries: Entry[] = [];

  const push = (path: string, locale: string, date: Date) => {
    entries.push({ path, locale, lastMod: date });
  };

  // Собираем все страницы
  allHomes.forEach((home) => push("/", home.locale, new Date(home.date)));
  allPages.forEach((p) => push(p.url, p.locale, new Date(p.date)));
  allTools.forEach((t) => push(t.url, t.locale, new Date(t.date)));
  allCases.forEach((c) => push(c.url, c.locale, new Date(c.date)));
  allBlogs.forEach((b) => push(`/blog/${b.slug}`, b.locale, new Date(b.date)));

  // Группируем по пути
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = entry.path;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }

  // Создаем sitemap в формате Next.js
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const [path, list] of groups.entries()) {
    const canonical = `${site}${path}`;
    const lastmod = list.reduce(
      (latest, cur) => (cur.lastMod > latest ? cur.lastMod : latest),
      list[0].lastMod
    );

    sitemapEntries.push({
      url: canonical,
      lastModified: lastmod,
      changeFrequency: "weekly",
      priority: path === "/" ? 1.0 : 0.8,
    });
  }

  return sitemapEntries;
}
