import en from "@/config/dictionaries/en.json";
import ru from "@/config/dictionaries/ru.json";
import tr from "@/config/dictionaries/tr.json";
import es from "@/config/dictionaries/es.json";
import hi from "@/config/dictionaries/hi.json";
import { Locale } from "@/config/i18n-config";
import type { TranslationDictionary } from "@/types/translation";

const dictionaries: Record<Locale, TranslationDictionary> = { en, ru, tr, es, hi };

function getNested(obj: unknown, path: string | string[]) {
  const keys = Array.isArray(path) ? path : path.split(".");
  return keys.reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function useTranslation(locale: Locale) {
  const dict = dictionaries[locale] || dictionaries.en;

  function t<T = string>(key: string, fallback?: T): T {
    const value = getNested(dict, key);
    if (value !== undefined) return value as T;
    if (fallback !== undefined) return fallback;
    return key as unknown as T;
  }

  return { t };
}
