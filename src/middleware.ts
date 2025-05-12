import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./config/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export function middleware(request: NextRequest) {
  // Проверяем, является ли это RSC запросом (имеет параметр _rsc)

  const { pathname } = request.nextUrl;

  const isRscRequest = request.nextUrl.searchParams.has("_rsc");

  if (isRscRequest) {
    // Клонируем объект заголовков для модификации
    const headers = new Headers(request.headers);

    // Устанавливаем специальные заголовки для RSC запросов,
    // чтобы Cloudflare не блокировал генерацию кода
    headers.set("x-nextjs-data", "1");

    // Возвращаем ответ с модифицированными заголовками
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  const pathnameHasLocale = i18n.locales.some((locale) =>
    pathname.startsWith(`/${locale}`)
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request) || i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales = Array.from(i18n.locales);
  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  return matchLocale(languages, locales, i18n.defaultLocale);
}

// Указываем, что middleware должен применяться только к определенным путям
export const config = {
  matcher: [
    // Применяем middleware к страницам контента
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
