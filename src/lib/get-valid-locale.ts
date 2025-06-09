import { i18n, type Locale } from "@/config/i18n-config";

export function getValidLocale(input: unknown): Locale {
  const potentialLocale = typeof input === 'string' ? input : Array.isArray(input) ? input[0] : i18n.defaultLocale;
  if ((i18n.locales as readonly string[]).includes(potentialLocale)) {
    return potentialLocale as Locale;
  }
  return i18n.defaultLocale;
}
