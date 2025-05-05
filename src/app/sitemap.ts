import { MetadataRoute } from 'next';
import { allTools, allCases, allPages } from '.contentlayer/generated';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'superduperai.co';
  const baseUrlWithProtocol = `https://${baseUrl}`;

  // Главная страница
  const homeUrl = {
    url: baseUrlWithProtocol,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  // Статические страницы
  const staticPages = [
    {
      url: `${baseUrlWithProtocol}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrlWithProtocol}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Маппинг всех страниц из ContentLayer
  const toolUrls = allTools.map((tool) => ({
    url: `${baseUrlWithProtocol}${tool.url}`,
    lastModified: new Date(tool.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const caseUrls = allCases.map((caseItem) => ({
    url: `${baseUrlWithProtocol}${caseItem.url}`,
    lastModified: new Date(caseItem.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const pageUrls = allPages.map((page) => ({
    url: `${baseUrlWithProtocol}${page.url}`,
    lastModified: new Date(page.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Объединяем все URL
  return [
    homeUrl,
    ...staticPages,
    ...toolUrls,
    ...caseUrls,
    ...pageUrls,
  ];
} 