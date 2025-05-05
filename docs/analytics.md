# Интеграция Google Tag Manager

В проекте реализована интеграция с Google Tag Manager через официальную библиотеку Next.js [@next/third-parties](https://nextjs.org/docs/app/guides/third-party-libraries).

## Основные компоненты

1. **AnalyticsProviders** - основной компонент для подключения аналитики, размещен в `src/components/ui/analytics-providers.tsx`
2. **EnhancedAnalytics** - компонент с расширенными возможностями аналитики, включая идентификацию пользователей
3. **user-identifier.ts** - библиотека для управления идентификаторами пользователей, обеспечивает консистентность ID между сессиями

## Идентификация пользователей

Система аналитики автоматически поддерживает консистентную идентификацию пользователей через:

- Генерацию UUID для каждого нового пользователя
- Хранение ID в localStorage и cookies
- Отправку user_id в dataLayer для всех событий
- Отслеживание возвращающихся пользователей

## Использование компонента TrackEvent

Для удобной отправки событий в Google Tag Manager создан компонент `TrackEvent`:

```tsx
import TrackEvent from '@/components/ui/track-event';

export default function HeroSection() {
  return (
    <TrackEvent 
      event="hero_button_click" 
      properties={{ 
        button_type: 'cta',
        section: 'hero'
      }}
    >
      <button className="btn-primary">Попробовать бесплатно</button>
    </TrackEvent>
  );
}
```

## Конфигурация GTM

Для работы Google Tag Manager необходимо указать ID контейнера в переменной окружения:

```
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXXX
```

## Отключение в режиме разработки

По умолчанию GTM отключен в режиме разработки, чтобы не искажать статистику. Для включения аналитики в dev-режиме передайте параметр `skipInDevelopment={false}` в компонент `AnalyticsProviders`.

## Дополнительные инструменты аналитики

Рекомендуется настраивать дополнительные аналитические сервисы (MS Clarity, Hotjar) через интерфейс Google Tag Manager, а не добавлять их напрямую в код.

## Отладка

В режиме разработки в консоль выводится подробная информация о конфигурации GTM.

В браузере можно использовать [расширение Google Tag Assistant](https://chrome.google.com/webstore/detail/google-tag-assistant-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) для проверки работы тегов. 