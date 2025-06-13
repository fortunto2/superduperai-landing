import { MetadataRoute } from "next";
import {
  allTools,
  allCases,
  allPages,
  allBlogs,
} from ".contentlayer/generated";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "superduperai.co";
  const baseUrlWithProtocol = `https://${baseUrl}`;

  // Поддерживаемые локали
  // const locales = Object.keys(localeMap) || ["en", "ru", "tr", "hi", "es"];
  const locales = ["en", "ru", "tr", "hi", "es"];

  // Главная страница для всех локалей
  const homeUrls = [
    {
      url: baseUrlWithProtocol,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...locales.map((locale) => ({
      url: `${baseUrlWithProtocol}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    })),
  ];

  // Статические страницы для всех локалей
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrlWithProtocol}/${locale}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrlWithProtocol}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  // Маппинг всех страниц из ContentLayer с учетом локали
  const toolUrls = allTools.map((tool) => ({
    url: `${baseUrlWithProtocol}/${tool.locale}${tool.url}`,
    lastModified: new Date(tool.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const caseUrls = allCases.map((caseItem) => ({
    url: `${baseUrlWithProtocol}/${caseItem.locale}${caseItem.url}`,
    lastModified: new Date(caseItem.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const pageUrls = allPages.map((page) => ({
    url: `${baseUrlWithProtocol}/${page.locale}${page.url}`,
    lastModified: new Date(page.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogUrls = allBlogs.map((blog) => ({
    url: `${baseUrlWithProtocol}/${blog.locale}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Объединяем все URL
  return [
    ...homeUrls,
    ...staticPages,
    ...toolUrls,
    ...caseUrls,
    ...pageUrls,
    ...blogUrls,
  ];
}
