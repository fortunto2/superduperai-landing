import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Проверяем, является ли это RSC запросом (имеет параметр _rsc)
  const isRscRequest = request.nextUrl.searchParams.has('_rsc');
  
  if (isRscRequest) {
    // Клонируем объект заголовков для модификации
    const headers = new Headers(request.headers);
    
    // Устанавливаем специальные заголовки для RSC запросов, 
    // чтобы Cloudflare не блокировал генерацию кода
    headers.set('x-nextjs-data', '1');
    
    // Возвращаем ответ с модифицированными заголовками
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }
  
  return NextResponse.next();
}

// Указываем, что middleware должен применяться только к определенным путям
export const config = {
  matcher: [
    // Применяем middleware к страницам контента
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
}; 