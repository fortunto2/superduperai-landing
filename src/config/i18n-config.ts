export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ru"],
  localeDetection: true, // автоматическое определение по заголовкам
  domains: undefined,
} as const;

export type Locale = (typeof i18n)["locales"][number];

// 新增的映射对象
export const localeMap = {
  en: "English",
  ru: "Russian",
} as const;
