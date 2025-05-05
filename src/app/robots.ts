import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'superduperai.com';
  
  // Стандартный robots с расширенными правилами disallow
  const robotsConfig: MetadataRoute.Robots = {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/llms.txt',
          '/api/llms-txt',
          '/api/markdown/',
        ],
      },
    ],
    sitemap: `https://${baseUrl}/sitemap.xml`,
  };

  // Custom toString метод для добавления LLMsHost
  const originalToString = robotsConfig.toString;
  robotsConfig.toString = function() {
    // Получаем стандартный robots.txt
    let output = (originalToString ? originalToString.call(this) : '') as string;

    // Добавляем директиву LLMsHost
    output += `\n# LLMs.txt reference\nLLMsHost: https://${baseUrl}/llms.txt\n`;

    return output;
  };

  return robotsConfig;
} 