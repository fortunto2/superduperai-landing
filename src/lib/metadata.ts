import { Metadata } from 'next';
import { OG_IMAGE_SIZE } from './generate-og-image';
import { i18n } from '@/config/i18n-config';
import { siteConfig } from '@/config/site';

// Определение типов данных для каждого типа страницы
export type PageType = 'home' | 'page' | 'tool' | 'case' | 'blog';

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
  case: ['#10b981', '#3b82f6'],   // Зелено-синий для кейсов
  blog: ['#8b5cf6', '#f43f5e']    // Фиолетово-красный для блога
};

// Статический баннер для главной страницы
export const HOME_BANNER_PATH = '/images/og/home-banner.webp';

/**
 * Генерирует URL для OG-изображения
 */
function generateOGImageUrl(
  title: string, 
  description: string, 
  meta?: PageMeta
): string {
  // Если это главная страница - используем статический баннер
  if (meta?.pageType === 'home') {
    return HOME_BANNER_PATH;
  }
  
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

function generateAlternates(url: string) {
  const languages: Record<string, string> = {};
  for (const locale of i18n.locales) {
    const suffix = url === '/' ? '' : url;
    languages[locale] = `${siteConfig.url}/${locale}${suffix}`;
  }
  languages['x-default'] = `${siteConfig.url}${url}`;
  return {
    canonical: `${siteConfig.url}${url}`,
    languages,
  };
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
  // а если его нет, генерируем динамически или берем статический баннер для главной
  const image = ogImage || generateOGImageUrl(title, description, meta);

  // Добавляем дополнительную информацию для серверного API
  const customMeta: Record<string, string> = {};
  if (meta) {
    if (meta.pageType) customMeta['x-page-type'] = meta.pageType;
    if (meta.category) customMeta['x-category'] = meta.category;
    if (meta.gradient) customMeta['x-gradient'] = meta.gradient.join(',');
  }

  // Определяем размеры изображения
  // Для статического баннера главной страницы могут быть свои размеры
  const width = meta?.pageType === 'home' ? 1200 : OG_IMAGE_SIZE.width;
  const height = meta?.pageType === 'home' ? 630 : OG_IMAGE_SIZE.height;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteConfig.url),
    alternates: generateAlternates(url),
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: 'SuperDuperAI',
      images: [
        {
          url: image,
          width,
          height,
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