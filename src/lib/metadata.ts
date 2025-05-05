import { Metadata } from 'next';
import { OG_IMAGE_SIZE } from './generate-og-image';

// Определение типов данных для каждого типа страницы
export type PageType = 'home' | 'page' | 'tool' | 'case';

// Интерфейс для метаданных страницы
export interface PageMeta {
  pageType?: PageType;
  category?: string;
  gradient?: [string, string];
}

// Интерфейс для содержимого страницы
export interface PageContent {
  title: string;
  description?: string;
  slug?: string;
  image?: string;
  category?: string;
}

// Определение градиентов для разных типов страниц
export const GRADIENTS: Record<PageType, [string, string]> = {
  home: ['#f43f5e', '#8b5cf6'],   // Красно-пурпурный для главной
  page: ['#4f46e5', '#ec4899'],   // Сине-розовый для статических страниц
  tool: ['#3b82f6', '#8b5cf6'],   // Сине-фиолетовый для инструментов
  case: ['#10b981', '#3b82f6']    // Зелено-синий для кейсов
};

/**
 * Генерирует URL для OG-изображения
 */
function generateOGImageUrl(
  title: string, 
  description: string, 
  meta?: PageMeta
): string {
  const params = new URLSearchParams();
  
  // Добавляем базовые параметры
  params.append('title', title);
  if (description) params.append('description', description);
  
  // Добавляем доп. параметры из meta
  if (meta?.pageType) params.append('pageType', meta.pageType);
  if (meta?.category) params.append('category', meta.category);
  
  // Возвращаем URL с параметрами
  return `/api/og?${params.toString()}`;
}

/**
 * Генерирует метаданные для страницы
 */
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  url,
  ogImage,
  type = 'website',
  meta,
}: {
  title: string;
  description: string;
  keywords?: string[];
  url: string;
  ogImage?: string;
  type?: 'website' | 'article';
  meta?: PageMeta;
}): Metadata {
  // Получаем изображение для OG - сначала пытаемся использовать переданное,
  // а если его нет, генерируем динамически
  const image = ogImage || generateOGImageUrl(title, description, meta);

  // Добавляем дополнительную информацию для серверного API
  const customMeta: Record<string, string> = {};
  if (meta) {
    if (meta.pageType) customMeta['x-page-type'] = meta.pageType;
    if (meta.category) customMeta['x-category'] = meta.category;
    if (meta.gradient) customMeta['x-gradient'] = meta.gradient.join(',');
  }

  return {
    title,
    description,
    keywords,
    metadataBase: new URL('https://superduperai.co'),
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: 'SuperDuperAI',
      images: [
        {
          url: image,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: customMeta
  };
} 