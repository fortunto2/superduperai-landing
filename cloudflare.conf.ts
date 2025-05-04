// Настройка для Cloudflare Pages и Workers
// См. документацию: https://developers.cloudflare.com/pages/platform/functions/

const config = {
  // Опционально указываем каталоги, которые необходимо исключить из сборки
  // includeFiles: [],
  // excludeFiles: [],
  
  // Настройки для правильной обработки маршрутов
  build: {
    // Пропускаем проверку директивы content-security-policy
    bypassCSP: true,
    // Отключаем сжатие ответов, что помогает избежать проблем с RSC
    bypassCompression: true,
  },
  
  // Улучшаем кэширование для статических ресурсов
  caching: {
    // Включаем агрессивное кэширование для статики
    cacheControl: {
      // Настройка для статических ресурсов
      bypassCache: false,
      edgeTTL: 60 * 60 * 24 * 365, // 1 год для статики
      browserTTL: 60 * 60 * 24 * 30, // 30 дней для браузерного кэша
      // Используем stale-while-revalidate для улучшения производительности
      staleWhileRevalidate: 60 * 60 * 24, // 1 день
    },
  },
  
  // Отключаем сжатие для запросов RSC
  compatibilityFlags: ["NO_RESPONSE_COMPRESSION"],
};

export default config; 