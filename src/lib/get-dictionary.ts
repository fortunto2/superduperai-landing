import 'server-only';
import type { Locale } from '@/config/i18n-config';
import type { TranslationDictionary } from '@/types/translation';

import en from '@/config/dictionaries/en.json';
import ru from '@/config/dictionaries/ru.json';
import tr from '@/config/dictionaries/tr.json';
import es from '@/config/dictionaries/es.json';
import hi from '@/config/dictionaries/hi.json';

const dictionaries: Record<Locale, TranslationDictionary> = {
  en: en as TranslationDictionary,
  ru: ru as TranslationDictionary,
  tr: tr as TranslationDictionary,
  es: es as TranslationDictionary,
  hi: hi as TranslationDictionary,
};

export const getDictionary = async (locale: Locale): Promise<TranslationDictionary> => {
  return dictionaries[locale] ?? dictionaries.en;
};
