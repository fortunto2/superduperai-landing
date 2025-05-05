import { ImageResponse } from 'next/og';

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

/**
 * Генерирует OG-изображение для страницы
 */
export async function generateOGImage({
  title,
  description,
  category,
  gradient = ['#3b82f6', '#8b5cf6'],
}: {
  title: string;
  description?: string;
  category?: string;
  gradient?: [string, string];
}) {
  // Обрезаем описание, если оно слишком длинное
  const shortDescription = description && description.length > 120 
    ? description.substring(0, 120) + '...' 
    : description;

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111827',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(to bottom right, ${gradient[0]}, ${gradient[1]})`,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 40,
            bottom: 40,
            fontSize: 24,
            fontWeight: 600,
            zIndex: 10,
          }}
        >
          SuperDuperAI
        </div>
        
        {category && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              marginBottom: 8,
              textAlign: 'center',
              position: 'relative',
              zIndex: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {category}
          </div>
        )}
        
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginBottom: shortDescription ? 32 : 0,
            textAlign: 'center',
            maxWidth: '80%',
            position: 'relative',
            zIndex: 10,
            textShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
          }}
        >
          {title}
        </div>
        
        {shortDescription && (
          <div
            style={{
              fontSize: 32,
              textAlign: 'center',
              maxWidth: '70%',
              position: 'relative',
              zIndex: 10,
              opacity: 0.9,
            }}
          >
            {shortDescription}
          </div>
        )}
      </div>
    ),
    OG_IMAGE_SIZE
  );
} 