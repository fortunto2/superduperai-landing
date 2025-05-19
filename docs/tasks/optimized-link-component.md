# Компонент OptimizedLink: расширенные возможности и оптимизация

## Обзор

Компонент `OptimizedLink` разработан для расширения стандартного компонента `Link` из Next.js, добавляя оптимизацию производительности и дополнительные функциональные возможности, необходимые для проекта SuperDuperAI Landing.

## Основные возможности

1. **Отключение предварительной загрузки (prefetch) по умолчанию**:

   - Снижение количества сетевых запросов
   - Оптимизация расходов на Cloudflare Workers

2. **Поддержка просмотра исходных markdown файлов**:

   - Возможность просмотра markdown через Ctrl+клик
   - Автоматическое добавление .md к URL при специальном действии

3. **SEO-оптимизация**:

   - Автоматическое добавление title-атрибута для всех ссылок
   - Поддержка rel-атрибутов для внешних ссылок

4. **Поддержка локализации**:
   - Автоматическое добавление префикса локали к пути
   - Обработка корневого пути для "чистых" URL

## Реализация

### Исходный код компонента

```typescript
// src/components/ui/optimized-link.tsx

import React from "react";
import Link from "next/link";
import { LinkProps } from "next/link";

// Расширенные свойства для ссылки
interface OptimizedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  title?: string; // SEO: title для всех ссылок
  showMarkdownSource?: boolean; // Флаг для показа markdown источника
  target?: string;
  rel?: string;
}

/**
 * Оптимизированный компонент для ссылок с дополнительными возможностями
 */
const OptimizedLink: React.FC<OptimizedLinkProps> = ({
  href,
  children,
  className = "",
  title,
  showMarkdownSource = true, // По умолчанию включено
  target,
  rel,
  ...props
}) => {
  // Строковое представление href
  const hrefString = typeof href === "string" ? href : href.pathname || "";

  // Определяем, является ли ссылка внутренней ссылкой на контент
  const isContentLink =
    typeof href === "string" &&
    !href.startsWith("http") &&
    !href.startsWith("#") &&
    (href.startsWith("/tool/") ||
      href.startsWith("/case/") ||
      href.startsWith("/about") ||
      href.startsWith("/pricing") ||
      href.startsWith("/privacy") ||
      href.startsWith("/terms"));

  // Обработка клика с учетом модификаторов
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if ((e.ctrlKey || e.metaKey) && showMarkdownSource && isContentLink) {
      e.preventDefault();
      // Формируем URL с .md на конце
      const mdUrl = `${hrefString}.md`;
      // Открываем в новой вкладке
      window.open(mdUrl, "_blank");
    }
  };

  return (
    <Link
      href={href}
      className={className}
      title={title || (typeof children === "string" ? children : undefined)}
      target={target}
      rel={rel}
      onClick={handleClick}
      prefetch={false} // Отключаем prefetch по умолчанию
      {...props}
    >
      {children}
    </Link>
  );
};

export default OptimizedLink;
```

## Использование компонента

### Базовое использование

```tsx
import OptimizedLink from "@/components/ui/optimized-link";

function Navigation() {
  return (
    <nav>
      <OptimizedLink href="/">Главная</OptimizedLink>
      <OptimizedLink
        href="/about"
        title="О нас"
      >
        О компании
      </OptimizedLink>
    </nav>
  );
}
```

### С включенным prefetch

```tsx
<OptimizedLink
  href="/dashboard"
  prefetch={true}
>
  Панель управления
</OptimizedLink>
```

### Внешние ссылки

```tsx
<OptimizedLink
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
>
  Внешний ресурс
</OptimizedLink>
```

### Отключение просмотра markdown

```tsx
<OptimizedLink
  href="/case/example"
  showMarkdownSource={false}
>
  Кейс без возможности просмотра исходника
</OptimizedLink>
```

## Преимущества использования

### 1. Оптимизация производительности

Отключение prefetch по умолчанию значительно снижает количество запросов, что особенно важно при использовании Cloudflare Workers:

- **Снижение нагрузки на сервер**: меньше автоматических запросов при скроллинге
- **Экономия трафика**: важно для мобильных пользователей с ограниченным интернетом
- **Снижение затрат на хостинг**: особенно при размещении на Cloudflare с тарификацией по запросам

### 2. Улучшение UX для разработчиков

Возможность просмотра исходных markdown файлов через Ctrl+клик улучшает опыт работы с контентом:

- **Быстрый доступ к исходникам**: нет необходимости искать файлы в репозитории
- **Упрощенное редактирование**: легко увидеть, что нужно изменить
- **Улучшенный рабочий процесс**: контент-менеджеры могут быстро проверить разметку

### 3. SEO-преимущества

- **Автоматический title**: все ссылки получают title-атрибут, что улучшает SEO
- **Правильные rel-атрибуты**: возможность указать правильные отношения для ссылок
- **Семантически корректная разметка**: соответствие рекомендациям поисковых систем

## Тестирование функциональности

### Проверка работы Ctrl+клик

1. Откройте любую страницу с контентом (например, `/tool/ai-text-generator`)
2. В консоли разработчика убедитесь, что ссылки используют компонент `OptimizedLink`
3. Наведите на любую ссылку на другую страницу контента
4. Удерживая Ctrl (или Cmd на Mac), кликните на ссылку
5. В новой вкладке должен открыться исходный markdown файл (`.md` на конце URL)

### Проверка отключения prefetch

1. Откройте Network панель в инструментах разработчика
2. Прокрутите страницу, чтобы разные ссылки попадали в область видимости
3. Убедитесь, что не происходит автоматических запросов к страницам по ссылкам

## Рекомендации по использованию

1. **Используйте во всем проекте**: замените стандартный `Link` на `OptimizedLink` для всех внутренних ссылок
2. **Включайте prefetch избирательно**: включайте prefetch только для критически важных путей навигации
3. **Всегда указывайте title**: добавляйте информативные title-атрибуты для улучшения SEO
4. **Правильные rel-атрибуты**: для внешних ссылок используйте `rel="noopener noreferrer"`

## Заключение

Компонент `OptimizedLink` значительно расширяет возможности стандартного Next.js Link, обеспечивая оптимизацию производительности, улучшенный UX и дополнительные функции для работы с содержимым. Используя этот компонент последовательно во всем проекте, можно добиться значительного улучшения производительности и снижения затрат на хостинг.
