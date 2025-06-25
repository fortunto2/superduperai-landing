import {
  allTools,
  allCases,
  allPages,
  allHomes,
  allBlogs,
  allDocs,
} from ".contentlayer/generated";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
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
  allDocs.forEach((d) => push(d.url, d.locale, new Date(d.date)));

  // Группируем по пути для создания языковых кластеров
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = entry.path;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }

  // Создаем XML sitemap с правильным международным форматированием
  const xmlLines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const [path, list] of groups.entries()) {
    // Находим последнюю дату модификации для всех языковых версий
    const lastmod = list.reduce(
      (latest, cur) => (cur.lastMod > latest ? cur.lastMod : latest),
      list[0].lastMod
    );

    // Создаем ОДИН URL entry на группу языков (согласно рекомендациям Google)
    // Используем английскую версию как основной URL в <loc>
    const mainLocale = "en";
    const mainPrefix = mainLocale === "en" ? "" : `/${mainLocale}`;
    const mainUrl = `${site}${mainPrefix}${path === "/" ? "" : path}`;

    xmlLines.push("  <url>");
    xmlLines.push(`    <loc>${mainUrl}</loc>`);

    // Добавляем hreflang ссылки для всех доступных языковых версий
    for (const langEntry of list) {
      const langLocale = langEntry.locale;
      const langPrefix = langLocale === "en" ? "" : `/${langLocale}`;
      const langUrl = `${site}${langPrefix}${path === "/" ? "" : path}`;

      xmlLines.push(
        `    <xhtml:link rel="alternate" hreflang="${langLocale}" href="${langUrl}" />`
      );
    }

    // Добавляем x-default ссылку (английская версия)
    xmlLines.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${mainUrl}" />`
    );
    
    xmlLines.push(`    <lastmod>${lastmod.toISOString()}</lastmod>`);
    xmlLines.push(`    <changefreq>weekly</changefreq>`);
    xmlLines.push(`    <priority>${path === "/" ? "1.0" : "0.8"}</priority>`);
    xmlLines.push("  </url>");
  }

  xmlLines.push("</urlset>");

  // Соединяем с переносами строк
  const xml = xmlLines.join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
