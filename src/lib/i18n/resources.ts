import ar from '@/translations/ar.json';
import en from '@/translations/en.json';
import es from '@/translations/es.json';
import fr from '@/translations/fr.json';

export const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  fr: {
    translation: fr,
  },
  es: {
    translation: es,
  },
};

// Sample usage:
// translate("common.appName") or useTranslation().t("counter.reset")
// To add a new language:
// 1) add a new JSON file under src/translations
// 2) import it here and add it to resources
// 3) ensure the Language type is updated by the new key

export type Language = keyof typeof resources;
