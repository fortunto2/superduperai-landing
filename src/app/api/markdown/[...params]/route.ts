import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Функция для преобразования MDX в Markdown без выполнения кода
 * Использует регулярные выражения для извлечения текста из компонентов
 */
async function mdxToMarkdown(filePath: string): Promise<string> {
  // Читаем содержимое файла
  const content = fs.readFileSync(filePath, "utf8");

  // Сохраняем frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch
    ? `---\n${frontmatterMatch[1]}\n---\n\n`
    : "";

  // Удаляем импорты и экспорты
  let markdown = content
    .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, "")
    .replace(/^export\s+.*?$/gm, "");

  // Обрабатываем компоненты с атрибутами title и description
  markdown = markdown.replace(
    /<(\w+)[\s\S]*?title=["']([^"']*)["'][\s\S]*?description=["']([^"']*)["'][\s\S]*?\/?>/g,
    (_, name, title, description) => `### ${title}\n\n${description}\n\n`
  );

  // Обрабатываем секции компонентов
  markdown = markdown.replace(
    /<(\w+)[\s\S]*?>([\s\S]*?)<\/\1>/g,
    (_, name, content) => content
  );

  // Удаляем оставшиеся JSX теги
  markdown = markdown.replace(/<[^>]*\/?>/g, "");

  // Сохраняем код блоки и удаляем фигурные скобки только вне их
  const codeBlocks: string[] = [];
  let codeBlockIndex = 0;
  
  // Сохраняем код блоки
  markdown = markdown.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlockIndex++}__`;
  });
  
  // Удаляем фигурные скобки с выражениями только вне код блоков
  markdown = markdown.replace(/\{[^{}]*\}/g, "");
  
  // Восстанавливаем код блоки
  codeBlocks.forEach((block, index) => {
    markdown = markdown.replace(`__CODE_BLOCK_${index}__`, block);
  });

  // Удаляем лишние пустые строки
  markdown = markdown.replace(/\n{3,}/g, "\n\n");

  // Возвращаем frontmatter на место
  return frontmatter + markdown;
}

/**
 * API маршрут для получения исходного markdown файла
 * Путь: /api/markdown/[type]/[locale]/[slug].md
 * Где:
 * - type: тип контента (tool, case, page)
 * - locale: локаль (en, ru)
 * - slug: идентификатор документа
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    // Получаем параметры из пути
    const { params: urlParams } = await params;

    // Проверяем, что у нас есть все необходимые параметры
    if (urlParams.length < 3) {
      console.error(`Invalid params length: ${urlParams.length}`);
      return NextResponse.json(
        {
          error:
            "Invalid path format. Expected: /api/markdown/[type]/[locale]/[slug].md",
        },
        { status: 400 }
      );
    }

    // Извлекаем параметры из пути
    const type = urlParams[0]; // тип (tool, case, page)
    const locale = urlParams[1]; // локаль (en, ru)
    const slug = urlParams[2].replace(/\.md$/, ""); // slug без расширения .md

    // Проверяем допустимость типа
    const validTypes = ["tool", "case", "pages", "homes", "docs"];
    if (!validTypes.includes(type)) {
      console.error(`Invalid content type: ${type}`);
      return NextResponse.json(
        {
          error:
            "Invalid content type. Supported types: tool, case, pages, homes, docs",
        },
        { status: 400 }
      );
    }

    // Сначала проверяем, есть ли предварительно сгенерированный MD файл
    const preGeneratedPath = path.join(
      process.cwd(),
      "public",
      "markdown",
      type,
      locale,
      `${slug}.md`
    );

    let markdown;

    if (fs.existsSync(preGeneratedPath)) {
      // Если предварительно сгенерированный файл существует, используем его
      markdown = fs.readFileSync(preGeneratedPath, "utf8");
    } else {
      // Если нет, генерируем на лету

      // Строим путь к MDX файлу
      const filePath = path.join(
        process.cwd(),
        "src",
        "content",
        type,
        locale,
        `${slug}.mdx`
      );

      // Проверяем существование файла
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);

        // Проверяем существование директории
        const dirPath = path.join(
          process.cwd(),
          "src",
          "content",
          type,
          locale
        );
        const dirExists = fs.existsSync(dirPath);

        if (dirExists) {
          // Показываем файлы в директории для отладки
          const files = fs.readdirSync(dirPath);
          console.log(`Files in directory: ${JSON.stringify(files)}`);
        }

        return NextResponse.json(
          {
            error: "Markdown file not found",
            path: filePath,
            type,
            locale,
            slug,
          },
          { status: 404 }
        );
      }

      // Преобразуем MDX в чистый Markdown без выполнения кода
      markdown = await mdxToMarkdown(filePath);
    }

    // Устанавливаем заголовки для plaintext
    const headers = new Headers();
    headers.set("Content-Type", "text/markdown; charset=utf-8");
    headers.set("Content-Disposition", `inline; filename="${slug}.md"`);

    // Возвращаем содержимое файла
    return new NextResponse(markdown, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error serving markdown file:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve markdown file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
