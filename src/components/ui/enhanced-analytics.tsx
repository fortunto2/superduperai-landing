'use client';

import { useEffect } from 'react';
import { GoogleTagManager, sendGTMEvent } from '@next/third-parties/google';
import { getUserData } from '@/lib/user-identifier';

interface EnhancedAnalyticsProps {
  gtmId?: string;
  skipInDevelopment?: boolean;
}

/**
 * Enhanced Analytics component that consistently identifies users
 * through Google Tag Manager
 */
export default function EnhancedAnalytics({
  gtmId,
  skipInDevelopment = true,
}: EnhancedAnalyticsProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Получаем ID из пропса или переменной окружения
  const tagManagerId = gtmId || process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || '';
  
  // Skip if development mode and skipInDevelopment is true
  if (isDevelopment && skipInDevelopment) {
    if (tagManagerId) {
      console.info('Google Tag Manager skipped in development mode.');
    }
    return null;
  }

  // Return null if GTM is not configured
  if (!tagManagerId) {
    if (isDevelopment) {
      console.warn('Google Tag Manager ID not found. Set NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID in your environment variables.');
    }
    return null;
  }

  return <GTMWithUserIdentity gtmId={tagManagerId} />;
}

function GTMWithUserIdentity({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    const userData = getUserData();
    
    // Отправляем user_id в dataLayer согласно документации
    setTimeout(() => {
      sendGTMEvent({
        event: 'user_identified',
        user_id: userData.userId,
        user_properties: {
          is_returning_user: userData.isReturningUser,
          referrer: userData.referrer,
          initial_path: userData.initialPath
        }
      });
    }, 500);
  }, [gtmId]);
  
  // Создаем начальный dataLayer с данными о пользователе
  const userData = getUserData();
  const initialDataLayer = {
    user_id: userData.userId
  };
  
  return (
    <GoogleTagManager
      gtmId={gtmId}
      dataLayer={initialDataLayer}
    />
  );
} 