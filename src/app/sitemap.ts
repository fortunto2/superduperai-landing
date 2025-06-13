import { allTools, allCases, allPages, allBlogs, allHomes } from '.contentlayer/generated';
import { i18n } from '@/config/i18n-config';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'superduperai.co';
  const site = `https://${baseUrl}`;

  type Entry = { path: string; locale: string; lastMod: Date };
  const entries: Entry[] = [];

  const push = (path: string, locale: string, date: Date) => {
    entries.push({ path, locale, lastMod: date });
  };

  allHomes.forEach(home => push('/', home.locale, new Date(home.date)));
  allPages.forEach(p => push(p.url, p.locale, new Date(p.date)));
  allTools.forEach(t => push(t.url, t.locale, new Date(t.date)));
  allCases.forEach(c => push(c.url, c.locale, new Date(c.date)));
  allBlogs.forEach(b => push(`/blog/${b.slug}`, b.locale, new Date(b.date)));

  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = entry.path;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

  for (const [path, list] of groups.entries()) {
    const canonical = `${site}${path}`;
    const lastmod = list.reduce((latest, cur) => cur.lastMod > latest ? cur.lastMod : latest, list[0].lastMod);
    xml += '<url>';
    xml += `<loc>${canonical}</loc>`;
    for (const locale of i18n.locales) {
      const suffix = path === '/' ? '' : path;
      xml += `<xhtml:link rel="alternate" hreflang="${locale}" href="${site}/${locale}${suffix}"/>`;
    }
    xml += `<xhtml:link rel="alternate" hreflang="x-default" href="${canonical}"/>`;
    xml += `<lastmod>${lastmod.toISOString()}</lastmod>`;
    xml += '</url>';
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
