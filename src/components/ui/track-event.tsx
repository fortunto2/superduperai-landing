'use client';

import { useCallback } from 'react';
import { sendGTMEvent } from '@next/third-parties/google';

/**
 * Компонент для отправки событий в Google Tag Manager
 * Использование:
 * 
 * <TrackEvent
 *   event="button_click"
 *   properties={{ button_id: 'hero_cta', page_section: 'hero' }}
 * >
 *   <button>Click Me</button>
 * </TrackEvent>
 */

interface TrackEventProps {
  children: React.ReactNode;
  event: string;
  properties?: Record<string, string | number | boolean>;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function TrackEvent({
  children,
  event,
  properties = {},
  className,
  onClick,
}: TrackEventProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Отправляем событие в GTM
    sendGTMEvent({
      event,
      ...properties,
    });

    // Вызываем дополнительный обработчик, если он предоставлен
    if (onClick) {
      onClick(e);
    }
  }, [event, properties, onClick]);

  return (
    <div 
      onClick={handleClick} 
      className={className}
      style={{ display: 'contents' }} // Не создаёт дополнительную обертку в DOM
    >
      {children}
    </div>
  );
} 