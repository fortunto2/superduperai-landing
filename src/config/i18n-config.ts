export const localeCookieName = "NEXT_LOCALE";

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ru", "tr", "es", "hi"],
  localeDetection: true, // автоматическое определение по заголовкам
  domains: undefined,
  cookieName: localeCookieName,
  cookieMaxAge: 31536000, // 1 год в секундах
  preserveRouteOnHome: true, // флаг для поддержки чистых URL на главной
} as const;

export type Locale = (typeof i18n)["locales"][number];

// Карта локализованных имен языков
export const localeMap = {
  en: "English",
  ru: "Russian",
  tr: "Turkish",
  es: "Spanish",
  hi: "Hindi",
} as const;
