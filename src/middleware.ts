import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n, Locale } from "./config/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Список специальных файлов и путей, которые должны быть доступны без локали
const PUBLIC_FILES = ["/llms.txt", "/favicon.ico", "/robots.txt"];

// Регулярное выражение для обнаружения Markdown-расширения в конце URL
const MD_EXTENSION_REGEX = /\.md$/;

// SECURITY: Global rate limiting for API routes
const globalRateLimit = new Map<string, { count: number; resetTime: number }>();
const GLOBAL_RATE_LIMIT = 100; // requests per window
const GLOBAL_RATE_WINDOW = 60 * 1000; // 1 minute

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // API specific security
  if (response.url.includes('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }
  
  return response;
}

function checkGlobalRateLimit(req: NextRequest): boolean {
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  
  const clientData = globalRateLimit.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    globalRateLimit.set(clientIP, { count: 1, resetTime: now + GLOBAL_RATE_WINDOW });
    return true;
  } else if (clientData.count >= GLOBAL_RATE_LIMIT) {
    return false;
  } else {
    clientData.count++;
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Global rate limiting for all requests
  if (!checkGlobalRateLimit(request)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Пропускаем API маршруты без изменений, но добавляем security headers
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Специальная обработка для sitemap.xml - полностью пропускаем через middleware
  if (pathname === "/sitemap.xml") {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Пропускаем специальные файлы без изменений
  if (PUBLIC_FILES.some((file) => pathname === file)) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
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
      const response = NextResponse.rewrite(apiUrl);
      return addSecurityHeaders(response);
    }
  }

  const isRscRequest = request.nextUrl.searchParams.has("_rsc");
  if (isRscRequest) {
    const headers = new Headers(request.headers);
    headers.set("x-nextjs-data", "1");
    const response = NextResponse.next({ request: { headers } });
    return addSecurityHeaders(response);
  }

  // Проверяем, является ли текущий путь корневым путем с локалью (например, /en, /ru)
  const isLocaleRoot = i18n.locales.some((locale) => pathname === `/${locale}`);
  if (isLocaleRoot) {
    // Редиректим с /locale на корень /
    const response = NextResponse.redirect(new URL("/", request.url));
    return addSecurityHeaders(response);
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request) || i18n.defaultLocale;

    // Используем rewrite для корневого пути, сохраняя чистый URL
    if (pathname === "/" && i18n.preserveRouteOnHome) {
      const url = new URL(`/${locale}${pathname}`, request.url);
      const response = NextResponse.rewrite(url);
      return addSecurityHeaders(response);
    }

    // Для остальных путей используем обычный redirect
    const url = new URL(`/${locale}${pathname}`, request.url);
    const response = NextResponse.redirect(url);
    return addSecurityHeaders(response);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
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
