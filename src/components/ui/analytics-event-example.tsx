'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import { getUserData } from '@/lib/user-identifier';

/**
 * Пример компонента для отправки событий в Google Tag Manager
 * Используйте этот пример для отслеживания действий пользователя
 */
export function SendAnalyticsEvent({ 
  eventName, 
  eventParams = {} 
}: { 
  eventName: string; 
  eventParams?: Record<string, string | number | boolean>;
}) {
  const handleClick = () => {
    const userData = getUserData();
    
    // Отправляем событие в GTM
    sendGTMEvent({
      event: eventName,
      user_id: userData.userId,
      ...eventParams,
    });
    
    console.log(`📊 Event "${eventName}" sent to GTM with user_id: ${userData.userId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
    >
      Отправить событие: {eventName}
    </button>
  );
}

/**
 * Пример использования:
 * 
 * import { SendAnalyticsEvent } from '@/components/ui/analytics-event-example';
 * 
 * // В вашем компоненте:
 * <SendAnalyticsEvent 
 *   eventName="button_click" 
 *   eventParams={{ 
 *     button_location: "hero",
 *     button_text: "Get Started" 
 *   }} 
 * />
 */ 