# Документация по мультиязычности SuperDuperAI

## Обзор

Платформа SuperDuperAI поддерживает мультиязычность с использованием Next.js 15 на основе локализованных маршрутов и динамической загрузки контента. Система использует параметр `[locale]` в URL и автоматическое определение предпочтительного языка пользователя.

## Поддерживаемые языки

- English (en) - стандартный язык
- Русский (ru)

## Архитектура

### Маршрутизация

1. **Директория с локалью**: `/src/app/[locale]`

   - Все страницы находятся в этой директории, что обеспечивает единую точку входа для маршрутизации с учетом выбранного языка

2. **Middleware (src/middleware.ts)**

   - Перехватывает все запросы и перенаправляет на правильный URL с указанием локали
   - Определяет предпочтительный язык пользователя на основе:
     - Cookie `NEXT_LOCALE`
     - Заголовка `Accept-Language`
     - Значения по умолчанию (en)
   - **Чистые URL для главной страницы**: для корневой страницы используется rewrite вместо redirect, что позволяет сохранить чистый URL без указания локали

3. **Конфигурация i18n (src/config/i18n-config.ts)**

   - Содержит основные настройки и список доступных языков
   - Экспортирует типы для безопасной работы с локалями
   - Содержит дополнительные настройки для cookie и чистых URL

4. **Структура layouts**
   - **Корневой layout (src/app/layout.tsx)** - устанавливает базовый атрибут `lang="x-default"` для HTML
   - **Локализованный layout (src/app/[locale]/layout.tsx)** - клиентский компонент, который устанавливает правильный атрибут `lang` через JavaScript на стороне клиента
   - SEO-оптимизация через альтернативные ссылки

### Управление контентом

1. **Локализованный контент в ContentLayer2**

   - Структура директорий: `/src/content/homes/[locale]/home.mdx`
   - Каждая языковая версия контента хранится в отдельном файле MDX
   - Все MDX-файлы имеют обязательное поле `locale`

2. **Загрузка контента**
   - В компонентах используется фильтрация контента по локали:
     ```tsx
     const locale = await params.locale;
     const homeData = allHomes.find((home) => home.locale === locale);
     ```

### Переключение языка

1. **Компонент `LanguageSwitcher`** (src/components/landing/navbar.tsx)

   - Отображает выпадающий список с доступными языками
   - Реализовано на основе Radix UI Dropdown
   - Автоматически сохраняет выбранный язык в cookie
   - Перенаправляет на соответствующий URL с новым значением локали
   - **Чистые URL для главной страницы**: при переключении языка на главной странице сохраняется чистый URL (/)

2. **Логика переключения**
   - При выборе языка обновляется cookie `NEXT_LOCALE`
   - Происходит программная навигация с сохранением текущего пути
   - Для главной страницы используется прямое перенаправление на корневой URL

## Функционал "Чистого URL" для главной страницы

Для сохранения чистых URL (без указания локали) на главной странице реализован следующий механизм:

1. **В middleware.ts**:

   - Для запросов к корневому пути (`/`) используется `NextResponse.rewrite()` вместо `redirect()`
   - Это позволяет внутренне загружать контент с правильной локалью, но сохранять в браузере оригинальный URL

2. **В компоненте LanguageSwitcher**:

   - Добавлена специальная обработка для главной страницы
   - При переключении языка на главной странице выполняется:
     ```tsx
     window.location.href = "/";
     ```
   - Это обеспечивает перезагрузку страницы с чистым URL и сохранением выбранного языка в cookie

3. **Конфигурация в i18n-config**:
   - Добавлен флаг `preserveRouteOnHome: true` для управления этим поведением

## HTML-Атрибут lang

Для SEO и доступности правильная установка атрибута `lang` критически важна. В Next.js 15 это реализовано с помощью клиентского JavaScript:

### Корневой layout (src/app/layout.tsx)

```tsx
// Устанавливает базовый атрибут для страниц
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="x-default"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        {/* Альтернативные ссылки для SEO */}
        {i18n.locales.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`https://superduperai.co/${locale}`}
          />
        ))}
        {/* ... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Локализованный layout (src/app/[locale]/layout.tsx)

```tsx
"use client";

import React, { useEffect, useState } from "react";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // В Next.js 15 параметры маршрута стали асинхронными
  const [locale, setLocale] = useState<string>("");

  useEffect(() => {
    // Получаем locale асинхронно и обновляем состояние
    const getLocale = async () => {
      const localeValue = await params.locale;
      setLocale(localeValue);
    };

    getLocale();
  }, [params.locale]);

  // Обновляем атрибут lang только когда locale получен
  useEffect(() => {
    if (!locale) return;

    const htmlTag = document.documentElement;
    if (htmlTag.lang !== locale) {
      htmlTag.lang = locale;
    }
  }, [locale]);

  return <>{children}</>;
}
```

**Преимущества этого подхода:**

- Избегает проблем гидратации между сервером и клиентом
- Правильно устанавливает атрибут lang для каждого языка
- Предоставляет альтернативные ссылки для SEO
- Работает с асинхронными параметрами маршрута в Next.js 15

## Асинхронные параметры в Next.js 15

С версии Next.js 15 параметры маршрута (`params`) стали асинхронными, и их нужно ожидать перед использованием:

### В серверных компонентах:

```tsx
export default async function Page({ params }: { params: { locale: string } }) {
  // Ждем получения параметра locale
  const locale = await params.locale;

  // Теперь можно безопасно использовать locale
  const data = await fetchDataForLocale(locale);

  return <div>{/* ... */}</div>;
}
```

### В клиентских компонентах:

```tsx
"use client";

export default function ClientComponent({ params }) {
  const [locale, setLocale] = useState("");

  useEffect(() => {
    // Асинхронно получаем значение locale
    const getLocale = async () => {
      const value = await params.locale;
      setLocale(value);
    };

    getLocale();
  }, [params.locale]);

  // Используем locale из состояния
  return <div>Текущий язык: {locale}</div>;
}
```

Этот подход необходим для совместимости с параллельной маршрутизацией и другими новыми функциями Next.js 15.

## Реализация на странице

### Использование в компонентах

1. **Получение текущей локали в клиентских компонентах**

   ```tsx
   "use client";
   import { useParams } from "next/navigation";
   import { useEffect, useState } from "react";

   const MyComponent = () => {
     const params = useParams();
     const [locale, setLocale] = useState("");

     useEffect(() => {
       const getLocale = async () => {
         const value = await params.locale;
         setLocale(value);
       };

       getLocale();
     }, [params.locale]);

     // Использование локали из состояния
     return <div>Текущий язык: {locale}</div>;
   };
   ```

2. **Получение локали в серверных компонентах**

   ```tsx
   export default async function ServerComponent({
     params,
   }: {
     params: { locale: string };
   }) {
     // Ожидаем получение локали
     const locale = await params.locale;

     return <div>Language: {locale}</div>;
   }
   ```

### SEO для мультиязычных страниц

1. **Метаданные**

   - Для каждой локали генерируются отдельные метаданные
   - В функции `generateMetadata` учитывается параметр локали:

   ```tsx
   export async function generateMetadata({
     params,
   }: {
     params: { locale: string };
   }): Promise<Metadata> {
     // Ожидаем получение параметра
     const locale = await params.locale;

     const home = allHomes.find((home) => home.locale === locale);
     // ...генерация метаданных
   }
   ```

2. **Правила для SEO**
   - Базовый атрибут `lang="x-default"` в корневом layout
   - Динамическое обновление атрибута lang на стороне клиента
   - Альтернативные ссылки с атрибутом `hrefLang` для указания языковых альтернатив
   - Чистые URL для главной страницы улучшают SEO

## Руководство по добавлению нового языка

1. **Обновите конфигурацию i18n**

   ```ts
   // src/config/i18n-config.ts
   export const i18n = {
     defaultLocale: "en",
     locales: ["en", "ru", "NEW_LOCALE"],
     // ...
   } as const;

   export const localeMap = {
     en: "English",
     ru: "Russian",
     NEW_LOCALE: "New Language Name",
   } as const;
   ```

2. **Добавьте языковой вариант в компонент LanguageSwitcher**

   ```tsx
   // src/components/landing/navbar.tsx
   const LANGUAGES = [
     { value: "en", label: "English" },
     { value: "ru", label: "Русский" },
     { value: "NEW_LOCALE", label: "New Language Name" },
   ];
   ```

3. **Создайте локализованный контент**

   - Создайте директорию `/src/content/homes/NEW_LOCALE/`
   - Скопируйте и переведите файл `home.mdx`
   - Установите правильное значение поля `locale: "NEW_LOCALE"`

4. **Переведите интерфейс**

   - Обновите все статические строки в компонентах UI

5. **Обновите альтернативные ссылки**
   - Добавьте новую локаль в список альтернативных ссылок в корневом layout

## Последние изменения в ветке

1. **Добавлен компонент `LanguageSwitcher`**

   - Интегрирован в навигационное меню (navbar.tsx)
   - Доступен как на десктопной, так и на мобильной версии сайта

2. **Улучшена логика определения языка в middleware.ts**

   - Поддержка языковых предпочтений из cookie
   - Резервный механизм использования заголовка Accept-Language
   - Корректная обработка RSC-запросов

3. **Добавлена структура локализованного контента**

   - Созданы директории для каждого языка в src/content/homes/
   - Добавлены переведенные версии MDX-файлов

4. **Обновлена конфигурация i18n**

   - Добавлена поддержка русского языка
   - Создан словарь названий языков для отображения в интерфейсе

5. **Реализованы чистые URL для главной страницы**

   - Обновлен middleware для использования rewrite вместо redirect
   - Модифицирован LanguageSwitcher для сохранения чистого URL
   - Добавлены настройки в i18n конфигурацию

6. **Правильная установка атрибута lang**

   - Базовый атрибут `lang="x-default"` в корневом layout
   - Клиентский JavaScript для установки правильного атрибута lang
   - Альтернативные ссылки для SEO-оптимизации

7. **Поддержка асинхронных параметров в Next.js 15**
   - Обновлены компоненты для работы с асинхронными `params`
   - Добавлен `await` перед использованием `params.locale` в серверных компонентах
   - Реализована асинхронная обработка в клиентских компонентах через `useState` и `useEffect`

## Рекомендации и ограничения

1. **Проблемы, которых следует избегать**

   - Не используйте строковые литералы для языковых элементов в компонентах
   - Не пытайтесь устанавливать атрибут `lang` в нескольких layout-файлах одновременно
   - Не обращайтесь к `params.locale` без `await` в Next.js 15

2. **Производительность**

   - Middleware оптимизирован, но избегайте тяжелых вычислений при определении языка
   - ContentLayer обеспечивает быструю загрузку контента без повторной компиляции

3. **Тестирование локализации**
   - Протестируйте автоматическое определение языка в разных браузерах
   - Проверьте корректность перенаправлений
   - Убедитесь, что SEO-атрибуты правильно установлены для каждого языка
   - Проверьте, что чистые URL для главной страницы корректно работают во всех браузерах
   - Удостоверьтесь, что атрибут lang правильно обновляется при навигации

## Примеры использования

1. **Создание локализованной страницы**

   ```tsx
   // src/app/[locale]/example/page.tsx
   export default async function ExamplePage({
     params,
   }: {
     params: { locale: string };
   }) {
     // Получение локализованного контента с учетом асинхронности
     const locale = await params.locale;

     const content = allExamples.find((example) => example.locale === locale);

     return (
       <div>
         <h1>{content?.title}</h1>
         <div>{content?.description}</div>
         {/* ... */}
       </div>
     );
   }
   ```

2. **Локализованные ссылки**

   ```tsx
   "use client";

   import { useParams } from "next/navigation";
   import Link from "next/link";
   import { useEffect, useState } from "react";
   import { i18n } from "@/config/i18n-config";

   export function LocalizedLink({ href, children }) {
     const params = useParams();
     const [locale, setLocale] = useState("");

     useEffect(() => {
       const getLocale = async () => {
         const value = await params.locale;
         setLocale(value);
       };

       getLocale();
     }, [params.locale]);

     // Для ссылки на главную можно использовать чистый URL
     if (href === "/" && i18n.preserveRouteOnHome) {
       return (
         <Link
           href="/"
           title={children}
         >
           {children}
         </Link>
       );
     }

     // Только отображаем после получения locale
     if (!locale) return null;

     return (
       <Link
         href={`/${locale}${href}`}
         title={children}
       >
         {children}
       </Link>
     );
   }
   ```

## Заключение

Система мультиязычности SuperDuperAI построена на механизме маршрутизации Next.js 15 и интеграции с ContentLayer2, что обеспечивает:

- Высокую производительность и SEO-оптимизацию
- Простую масштабируемость при добавлении новых языков
- Удобный интерфейс для переключения между языками
- Автоматическое определение предпочтительного языка пользователя
- Чистые URL для главной страницы без указания локали
- Корректные HTML атрибуты lang с использованием клиентского JavaScript
- Поддержку асинхронных параметров маршрута в Next.js 15

Для поддержки работайте напрямую с файлами в `/src/config/i18n-config.ts`, `/src/middleware.ts`, `/src/app/layout.tsx`, `/src/app/[locale]/layout.tsx` и компонентом `LanguageSwitcher`.

## Исправления в системе локализации

В рамках последних доработок были выявлены и исправлены проблемы в работе системы локализации:

### 1. Исправление механизма редиректов

**Проблема**: Специальные файлы (`sitemap.xml`, `robots.txt`, `llms.txt`) некорректно обрабатывались middleware, что приводило к недоступности этих файлов при обращении без локали.

**Решение**:

```typescript
// Список специальных файлов, доступных без локали
const PUBLIC_FILES = [
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/favicon.ico",
];

// Пропускаем специальные файлы без изменений
if (PUBLIC_FILES.some((file) => pathname === file)) {
  return NextResponse.next();
}
```

### 2. Корректная работа переключения языков

**Проблема**: При переходе на корневые пути с локалью (например, `/en` или `/ru`) не происходил редирект на главную страницу.

**Решение**:

```typescript
// Проверяем, является ли текущий путь корневым путем с локалью
const isLocaleRoot = i18n.locales.some((locale) => pathname === `/${locale}`);
if (isLocaleRoot) {
  // Редиректим с /locale на корень /
  return NextResponse.redirect(new URL("/", request.url));
}
```

### 3. Унификация слагов между языками

**Проблема**: Слаги в MDX-файлах разных языков не соответствовали друг другу, что приводило к некорректной работе переключения языков.

**Решение**:

1. Исправлены слаги в MDX-файлах, чтобы они совпадали между разными языками
2. Добавлена обработка несоответствий слагов в middleware для правильного маппинга:

```typescript
// Обработка возможных несоответствий слагов между языками
if (contentType === "case" && slug.startsWith("ai-")) {
  const baseSlug = slug.replace(/^ai-/, "").replace(/-generator$/, "");
  if (baseSlug) {
    slug = baseSlug;
  }
}
```

### 4. Исправление форматирования frontmatter в MDX-файлах

**Проблема**: Некорректное форматирование frontmatter в MDX-файлах приводило к ошибкам при обработке контента.

**Было (с ошибками)**:

```yaml
locale: ru
seo:
title: "..."
keywords: - ключевое слово - другое ключевое слово
```

**Стало (правильно)**:

```yaml
locale: "ru"
seo:
  title: "..."
  keywords:
    - ключевое слово
    - другое ключевое слово
```

### 5. Оптимизированный компонент для ссылок

Был доработан компонент `OptimizedLink` для улучшения работы с локализованными ссылками и добавления возможности просмотра исходных markdown файлов:

```typescript
const OptimizedLink: React.FC<OptimizedLinkProps> = ({
  href,
  children,
  className = "",
  title,
  showMarkdownSource = true,
  target,
  rel,
  ...props
}) => {
  // Обработка клика с учетом модификаторов (Ctrl/Cmd + клик)
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if ((e.ctrlKey || e.metaKey) && showMarkdownSource && isContentLink) {
      e.preventDefault();
      // Формируем URL с .md на конце для просмотра исходного markdown
      const mdUrl = `${hrefString}.md`;
      window.open(mdUrl, "_blank");
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};
```

### Результат исправлений

После внесения всех исправлений:

1. Специальные файлы (`sitemap.xml`, `robots.txt`, `llms.txt`) теперь доступны напрямую без редиректов
2. Переключение языков корректно работает для всех страниц, включая кейсы
3. Переход на `/ru` или `/en` корректно редиректит на главную страницу
4. Унифицированы слаги в MDX-файлах, что обеспечивает согласованность между языковыми версиями
5. Исправлено форматирование frontmatter в MDX-файлах
6. Добавлена возможность просмотра исходных markdown файлов через добавление `.md` в конце URL или через Ctrl+клик

Эти изменения значительно улучшили работу системы локализации и сделали процесс управления многоязычным контентом более удобным.
