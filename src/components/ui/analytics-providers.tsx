'use client';

import { useEffect } from 'react';
import EnhancedAnalytics from './enhanced-analytics';

interface AnalyticsProvidersProps {
  skipInDevelopment?: boolean;
  gtmId?: string;
}

/**
 * Компонент для интеграции Google Tag Manager
 * 
 * - Поддерживает консистентную идентификацию пользователей через user_id
 * - Может быть отключен в режиме разработки
 * - Централизованно управляет analytics на всех страницах
 */
export default function AnalyticsProviders({ 
  skipInDevelopment = true,
  gtmId
}: AnalyticsProvidersProps = {}) {
  // Добавим логирование для отладки
  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const configuredGtmId = gtmId || process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
    
    if (isDevelopment) {
      console.log('📊 Google Tag Manager config:');
      console.log(`- GTM ID: ${configuredGtmId || 'Not configured'}`);
      console.log(`- Environment: ${process.env.NODE_ENV}`);
      console.log(`- Skip in development: ${skipInDevelopment}`);
      console.log(`- Status: ${configuredGtmId && !skipInDevelopment ? 'ENABLED' : 'DISABLED'}`);
      console.log('📊 Set NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID in .env.local to enable GTM');
    }
  }, [gtmId, skipInDevelopment]);

  return (
    <EnhancedAnalytics 
      skipInDevelopment={skipInDevelopment} 
      gtmId={gtmId}
    />
  );
} 