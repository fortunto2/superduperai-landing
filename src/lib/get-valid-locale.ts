import { Locale, i18n } from "@/config/i18n-config";

export function getValidLocale(input: unknown): Locale {
  const value =
    typeof input === "string"
      ? input
      : Array.isArray(input)
        ? input[0]
        : i18n.defaultLocale;

  return i18n.locales.includes(value as Locale)
    ? (value as Locale)
    : i18n.defaultLocale;
}
