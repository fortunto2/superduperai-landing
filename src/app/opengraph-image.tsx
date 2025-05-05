import { allHomes, allPages } from '.contentlayer/generated';
import { generateOGImage, OG_IMAGE_SIZE } from '@/lib/generate-og-image';
import { GRADIENTS, PageType } from '@/lib/metadata';

export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

/**
 * Универсальный генератор OG-изображений для любой страницы
 * Определяет тип страницы по URL и генерирует соответствующее изображение
 */
export default async function Image({ params }: { params?: { slug?: string } }) {
  // Определяем тип страницы и содержимое по URL
  let pageType: PageType = 'home';
  let title = 'SuperDuperAI';
  let description: string | undefined;
  let category: string | undefined;
  
  // Если URL корневой - это главная страница
  if (!params?.slug) {
    const home = allHomes[0];
    if (home) {
      pageType = 'home';
      title = home.title;
      description = home.description;
    }
  } 
  // Если URL - динамическая страница
  else {
    const slug = params.slug;
    
    // Проверяем, это статическая страница?
    const page = allPages.find((p) => p.slug === slug);
    if (page) {
      pageType = 'page';
      title = page.title;
      description = page.description;
      // Формируем категорию из слага
      category = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  // Получаем градиент для типа страницы
  const gradient = GRADIENTS[pageType];

  // Генерируем изображение
  return generateOGImage({
    title,
    description,
    category,
    gradient
  });
}

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: OG_IMAGE_SIZE,
      alt: 'SuperDuperAI',
      id: 'og',
    },
  ];
} 