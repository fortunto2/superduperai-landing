import { Locale } from "@/config/i18n-config";

export function getValidLocale(input: unknown): Locale {
  const locale =
    typeof input === "string" ? input : Array.isArray(input) ? input[0] : "en";
  return locale === "ru" ? "ru" : "en";
}
