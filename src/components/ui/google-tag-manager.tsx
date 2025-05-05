import { GoogleTagManager } from '@next/third-parties/google'

interface GoogleTagManagerProps {
  gtmId?: string;
  skipInDevelopment?: boolean;
}

export default function CustomGoogleTagManager({ 
  gtmId, 
  skipInDevelopment = true 
}: GoogleTagManagerProps) {
  // Проверяем, находимся ли мы в режиме разработки
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Получаем ID из пропса или переменной окружения
  const tagManagerId = gtmId || process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || '';

  // Если ID не найден
  if (!tagManagerId) {
    // В режиме разработки просто выводим предупреждение в консоль
    if (isDevelopment) {
      console.warn('Google Tag Manager ID not found. Set NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID in your environment variables.');
    }
    return null;
  }

  // Если режим разработки и установлен флаг skipInDevelopment, не выполняем загрузку GTM
  if (isDevelopment && skipInDevelopment) {
    console.info('Google Tag Manager skipped in development mode.');
    return null;
  }

  // В производственном режиме или если skipInDevelopment=false, загружаем GTM
  return <GoogleTagManager gtmId={tagManagerId} />;
} 