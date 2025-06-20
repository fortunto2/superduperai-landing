import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n, Locale } from "./config/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Список специальных файлов и путей, которые должны быть доступны без локали
const PUBLIC_FILES = ["/llms.txt", "/favicon.ico", "/robots.txt"];

// Регулярное выражение для обнаружения Markdown-расширения в конце URL
const MD_EXTENSION_REGEX = /\.md$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем API маршруты без изменений
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Специальная обработка для sitemap.xml - полностью пропускаем через middleware
  if (pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  // Пропускаем специальные файлы без изменений
  if (PUBLIC_FILES.some((file) => pathname === file)) {
    return NextResponse.next();
  }

  // Проверяем, содержит ли URL .md в конце
  if (MD_EXTENSION_REGEX.test(pathname)) {
    // Извлекаем путь без расширения .md
    const pathWithoutExtension = pathname.replace(MD_EXTENSION_REGEX, "");

    // Получаем сегменты пути для правильного маппинга
    const pathSegments = pathWithoutExtension.split("/").filter(Boolean);

    // Определяем, есть ли локаль в URL
    let locale: string = i18n.defaultLocale;
    let contentType: string = "";
    let slug: string = "";

    if (pathSegments.length > 0) {
      // Проверяем, является ли первый сегмент локалью
      if (i18n.locales.includes(pathSegments[0] as Locale)) {
        locale = pathSegments[0];

        // Если после локали есть тип и слаг
        if (pathSegments.length >= 3) {
          contentType = pathSegments[1];
          slug = pathSegments[2];
        }
        // Если после локали только один сегмент - это слаг для pages
        else if (pathSegments.length === 2) {
          contentType = "pages";
          slug = pathSegments[1];
        }
      }
      // Если первый сегмент не локаль
      else {
        // Для путей вида /tool/slug.md или /about.md
        if (pathSegments.length >= 2) {
          contentType = pathSegments[0];
          slug = pathSegments[1];
        } else {
          contentType = "pages";
          slug = pathSegments[0];
        }
      }
    }

    // Проверяем, имеем ли мы все необходимые данные
    if (contentType && slug) {
      // Преобразуем contentType для правильного маппинга на структуру файлов
      if (
        contentType === "about" ||
        contentType === "pricing" ||
        contentType === "privacy" ||
        contentType === "terms" ||
        contentType === "creators"
      ) {
        slug = contentType;
        contentType = "pages";
      }

      // Обработка возможных несоответствий слагов между языками
      if (contentType === "case" && slug.startsWith("ai-")) {
        const baseSlug = slug.replace(/^ai-/, "").replace(/-generator$/, "");

        // Пробуем более простой вариант слага, если baseSlug не пустой
        if (baseSlug) {
          slug = baseSlug;
        }
      }

      // Формируем URL для API маршрута
      const apiUrl = new URL(
        `/api/markdown/${contentType}/${locale}/${slug}.md`,
        request.url
      );

      // Перенаправляем запрос на API маршрут
      return NextResponse.rewrite(apiUrl);
    }
  }

  const isRscRequest = request.nextUrl.searchParams.has("_rsc");
  if (isRscRequest) {
    const headers = new Headers(request.headers);
    headers.set("x-nextjs-data", "1");
    return NextResponse.next({ request: { headers } });
  }

  // Проверяем, является ли текущий путь корневым путем с локалью (например, /en, /ru)
  const isLocaleRoot = i18n.locales.some((locale) => pathname === `/${locale}`);
  if (isLocaleRoot) {
    // Редиректим с /locale на корень /
    return NextResponse.redirect(new URL("/", request.url));
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request) || i18n.defaultLocale;

    // Используем rewrite для корневого пути, сохраняя чистый URL
    if (pathname === "/" && i18n.preserveRouteOnHome) {
      const url = new URL(`/${locale}${pathname}`, request.url);
      return NextResponse.rewrite(url);
    }

    // Для остальных путей используем обычный redirect
    const url = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function getLocale(request: NextRequest): string | undefined {
  // 1. Пробуем достать из куки
  const cookieLocale = request.cookies.get(i18n.cookieName)?.value;
  const availableLocales = [...i18n.locales] as string[];

  if (
    cookieLocale &&
    (i18n.locales as readonly string[]).includes(cookieLocale)
  ) {
    return cookieLocale;
  }

  // 2. Если куки нет, смотрим Accept-Language
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    availableLocales
  );

  return matchLocale(languages, i18n.locales, i18n.defaultLocale);
}

// Обновляем matcher, чтобы корректно обрабатывать все пути, кроме статических ресурсов
export const config = {
  matcher: [
    // Исключаем статические пути
    "/((?!_next|static|images|fonts).*)",
    // Но включаем sitemap.xml и llms.txt явно, так как они генерируются Next.js
    "/sitemap.xml",
    "/llms.txt",
    "/robots.txt",
  ],
};
