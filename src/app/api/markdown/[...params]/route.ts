import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
    const validTypes = ["tool", "case", "pages", "homes"];
    if (!validTypes.includes(type)) {
      console.error(`Invalid content type: ${type}`);
      return NextResponse.json(
        {
          error:
            "Invalid content type. Supported types: tool, case, pages, homes",
        },
        { status: 400 }
      );
    }

    // Строим путь к файлу
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
      const dirPath = path.join(process.cwd(), "src", "content", type, locale);
      const dirExists = fs.existsSync(dirPath);
      console.log(`Directory ${dirPath} exists: ${dirExists}`);

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

    // Читаем содержимое файла
    const content = fs.readFileSync(filePath, "utf8");
    console.log(`File read successfully, content length: ${content.length}`);

    // Устанавливаем заголовки для plaintext
    const headers = new Headers();
    headers.set("Content-Type", "text/markdown; charset=utf-8");
    headers.set("Content-Disposition", `inline; filename="${slug}.md"`);

    // Возвращаем содержимое файла
    return new NextResponse(content, {
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
