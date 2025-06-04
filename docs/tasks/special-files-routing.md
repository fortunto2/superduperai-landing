# Маршрутизация специальных файлов и расширенные возможности URL

## Обзор

В проекте SuperDuperAI Landing реализована расширенная маршрутизация для специальных файлов и дополнительные возможности URL для улучшения пользовательского опыта и SEO.

## Проблемы и решения

### 1. Обработка специальных файлов

**Проблема**: Файлы `sitemap.xml`, `robots.txt`, `llms.txt` и другие технические файлы должны быть доступны напрямую без языкового префикса, но стандартная маршрутизация Next.js перенаправляет все URL-пути на URL с префиксом локали.

**Решение**:

```typescript
// Список специальных файлов и путей, которые должны быть доступны без локали
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

### 2. Корректное перенаправление с корневых путей локали

**Проблема**: При переходе на `/en` или `/ru` должен происходить редирект на главную страницу (`/`), но это не работало корректно.

**Решение**:

```typescript
// Проверяем, является ли текущий путь корневым путем с локалью (например, /en, /ru)
const isLocaleRoot = i18n.locales.some((locale) => pathname === `/${locale}`);
if (isLocaleRoot) {
  // Редиректим с /locale на корень /
  return NextResponse.redirect(new URL("/", request.url));
}
```

### 3. Доступ к исходным markdown-файлам через URL

**Проблема**: Необходимо обеспечить возможность просмотра исходных markdown файлов через добавление `.md` к URL, например, `/ru/case/video-story.md`.

**Решение**:

1. **Обработка в middleware**:

```typescript
// Регулярное выражение для обнаружения Markdown-расширения в конце URL
const MD_EXTENSION_REGEX = /\.md$/;

if (MD_EXTENSION_REGEX.test(pathname)) {
  // Извлечение параметров и маппинг на API маршрут
  const apiUrl = new URL(
    `/api/markdown/${contentType}/${locale}/${slug}.md`,
    request.url
  );
  return NextResponse.rewrite(apiUrl);
}
```

2. **API маршрут для доступа к содержимому**:

```typescript
// Путь: /api/markdown/[type]/[locale]/[slug].md
export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  // Извлекаем параметры из пути
  const type = urlParams[0]; // тип (tool, case, page)
  const locale = urlParams[1]; // локаль (en, ru)
  const slug = urlParams[2].replace(/\.md$/, ""); // slug без расширения .md

  // Строим путь к файлу
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    type,
    locale,
    `${slug}.mdx`
  );

  // Читаем и возвращаем содержимое файла
  const content = fs.readFileSync(filePath, "utf8");

  const headers = new Headers();
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Content-Disposition", `inline; filename="${slug}.md"`);

  return new NextResponse(content, {
    status: 200,
    headers,
  });
}
```

### 4. Удобный доступ к исходным markdown через Ctrl+клик

**Проблема**: Нужен удобный способ для просмотра markdown-исходников без необходимости вручную добавлять `.md` к URL.

**Решение**: Расширенный компонент `OptimizedLink` с поддержкой Ctrl+клик:

```typescript
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
  // Обработка клика с учетом модификаторов (Ctrl/Cmd + клик)
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
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};
```

## Преимущества реализации

1. **Улучшенный SEO**:

   - Специальные файлы (`sitemap.xml`, `robots.txt`) доступны напрямую, что улучшает индексацию
   - Чистые URL без дублирования контента

2. **Улучшенный пользовательский опыт**:

   - Возможность просмотра исходных markdown файлов с помощью Ctrl+клик
   - Корректные редиректы с подрутов локали на корневые URL

3. **Гибкость разработки**:
   - Удобный доступ к исходным markdown файлам для разработчиков и контрибьюторов
   - Автоматическое определение типа контента и локали из URL

## Использование

### Доступ к исходным markdown файлам

Просмотр исходного markdown для любой страницы контента:

1. **Вручную**: добавьте `.md` в конце URL, например: `/ru/case/video-story.md`
2. **С помощью Ctrl+клик**: наведите курсор на любую ссылку на контент и нажмите Ctrl+клик (или Cmd+клик на Mac)

### Поддерживаемые типы контента

Система поддерживает доступ к markdown для следующих типов контента:

- Страницы инструментов: `/[locale]/tool/[slug].md`
- Кейсы: `/[locale]/case/[slug].md`
- Статические страницы: `/[locale]/about.md`, `/[locale]/pricing.md` и др.

## Техническая реализация

Реализация основана на компонентах:

1. **middleware.ts**: Обрабатывает URL-запросы и определяет маршрутизацию
2. **/api/markdown/[...params]/route.ts**: API маршрут для доступа к содержимому файлов
3. **components/ui/optimized-link.tsx**: Расширенный компонент Link с поддержкой Ctrl+клик

Компоненты спроектированы для обеспечения высокой производительности и максимальной совместимости с Next.js 15 и Cloudflare Workers.
