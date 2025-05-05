import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { generateOGImage, OG_IMAGE_SIZE } from '@/lib/generate-og-image';
import { GRADIENTS, PageType } from '@/lib/metadata';

export const runtime = 'edge';

// Определяем допустимые размеры изображений - используем локальную переменную, не экспортируем
const size = OG_IMAGE_SIZE;

/**
 * API маршрут для генерации OG-изображений
 * 
 * Пример использования:
 * /api/og?title=Hello+World&description=This+is+a+test&pageType=home
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Получаем базовые параметры
    const title = searchParams.get('title') || 'SuperDuperAI';
    const description = searchParams.get('description') || undefined;
    const category = searchParams.get('category') || undefined;
    
    // Проверяем тип страницы и получаем соответствующий градиент
    const pageType = (searchParams.get('pageType') || 'home') as PageType;
    const gradient = GRADIENTS[pageType] || GRADIENTS.home;
    
    // Генерируем изображение
    return generateOGImage({
      title,
      description,
      category,
      gradient
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Возвращаем простое изображение с ошибкой
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111827',
            color: 'white',
            fontSize: 32,
            fontWeight: 'bold',
          }}
        >
          Error generating image
        </div>
      ),
      {
        width: size.width,
        height: size.height,
      }
    );
  }
} 