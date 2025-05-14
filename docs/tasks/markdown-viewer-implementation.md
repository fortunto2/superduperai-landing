# Реализация просмотра исходных Markdown файлов

## Обзор

В проекте SuperDuperAI Landing реализована система для просмотра исходных markdown-файлов через веб-интерфейс без необходимости прямого доступа к репозиторию. Эта функциональность полезна как для редакторов контента, так и для разработчиков.

## Возможности системы

1. **Просмотр исходного markdown через URL**: добавление `.md` к любому URL с контентом открывает исходный markdown файл
2. **Удобный доступ через Ctrl+клик**: использование модификатора Ctrl (или Cmd на Mac) при клике на ссылку
3. **Поддержка всех типов контента**: инструменты, кейсы, статические страницы

## Техническая реализация

### 1. API для доступа к markdown файлам

Создан специальный API-маршрут для обслуживания исходных markdown файлов:

```typescript
// src/app/api/markdown/[...params]/route.ts

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  // Извлекаем параметры из пути
  const { params: urlParams } = params;

  const type = urlParams[0]; // тип (tool, case, pages)
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

  // Читаем содержимое файла
  const content = fs.readFileSync(filePath, "utf8");

  // Настраиваем заголовки для корректного отображения markdown
  const headers = new Headers();
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Content-Disposition", `inline; filename="${slug}.md"`);

  return new NextResponse(content, {
    status: 200,
    headers,
  });
}
```

### 2. Обработка URL с расширением .md в Middleware

В middleware.ts добавлена логика для обнаружения и обработки URL с расширением .md:

```typescript
// Регулярное выражение для обнаружения Markdown-расширения
const MD_EXTENSION_REGEX = /\.md$/;

if (MD_EXTENSION_REGEX.test(pathname)) {
  // Извлекаем путь без расширения .md
  const pathWithoutExtension = pathname.replace(MD_EXTENSION_REGEX, "");

  // Получаем сегменты пути
  const pathSegments = pathWithoutExtension.split("/").filter(Boolean);

  // Логика определения локали, типа контента и слага из URL
  let locale: string = i18n.defaultLocale;
  let contentType: string = "";
  let slug: string = "";

  // Код определения параметров из сегментов URL...

  // Формируем URL для API маршрута
  const apiUrl = new URL(
    `/api/markdown/${contentType}/${locale}/${slug}.md`,
    request.url
  );

  // Перенаправляем запрос на API маршрут
  return NextResponse.rewrite(apiUrl);
}
```

### 3. OptimizedLink для удобного доступа через Ctrl+клик

Создан компонент OptimizedLink, который расширяет стандартный Next.js Link с поддержкой Ctrl+клик для просмотра исходного markdown:

```typescript
// src/components/ui/optimized-link.tsx

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
      title={title}
      target={target}
      rel={rel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};
```

## Поддерживаемые типы контента

Система поддерживает просмотр исходных markdown файлов для следующих типов контента:

1. **Инструменты**:

   - URL формат: `/[locale]/tool/[slug].md`
   - Путь к файлу: `src/content/tool/[locale]/[slug].mdx`

2. **Кейсы**:

   - URL формат: `/[locale]/case/[slug].md`
   - Путь к файлу: `src/content/case/[locale]/[slug].mdx`

3. **Статические страницы**:
   - URL формат: `/[locale]/[page-name].md`
   - Путь к файлу: `src/content/pages/[locale]/[page-name].mdx`

## Преимущества реализации

1. **Прозрачность контента**:

   - Возможность быстро просмотреть исходный markdown без доступа к репозиторию
   - Упрощение обнаружения ошибок в разметке

2. **Удобство редактирования**:

   - Редакторы могут легко увидеть исходный код для внесения изменений
   - Возможность копирования частей markdown для новых страниц

3. **Техническая гибкость**:
   - Система автоматически определяет тип контента, локаль и слаг из URL
   - Унифицированный доступ к различным типам контента

## Руководство по использованию

### Просмотр исходного markdown

Существует два способа просмотра исходного markdown файла:

1. **Добавление .md в URL**:

   - Добавьте `.md` в конце любого URL с контентом, например: `/ru/case/video-story.md`
   - Браузер отобразит исходный markdown файл

2. **Использование Ctrl+клик**:
   - Наведите курсор на любую ссылку на контентную страницу
   - Удерживая Ctrl (или Cmd на Mac), кликните на ссылку
   - Исходный markdown откроется в новой вкладке

### Примеры URL для просмотра markdown

```
# Инструменты
/ru/tool/ai-text-generator.md
/en/tool/ai-image-generator.md

# Кейсы
/ru/case/video-story.md
/en/case/content-creation.md

# Статические страницы
/ru/about.md
/en/privacy.md
```

## Обработка ошибок

Система включает обработку различных ошибочных сценариев:

1. **Файл не найден**:

   - Если запрошенный файл не существует, возвращается ошибка 404
   - Предоставляется дополнительная информация о проблеме для отладки

2. **Некорректный путь**:

   - При недостаточном количестве параметров возвращается ошибка 400
   - Указываются ожидаемый формат и полученные параметры

3. **Обработка несоответствий слагов**:
   - Автоматическая нормализация слагов для улучшения совместимости между языками
   - Обработка специальных случаев (например, конвертация `ai-video-generator` в `video`)

## Выводы

Реализация просмотра исходных markdown файлов через веб-интерфейс значительно упрощает работу с контентом в проекте SuperDuperAI Landing. Эта функциональность особенно полезна в контексте многоязычного сайта, где необходимо поддерживать согласованность контента между различными языковыми версиями.

Система спроектирована с учетом масштабируемости и может быть легко расширена для поддержки дополнительных типов контента в будущем.
