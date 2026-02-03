import { getLocales } from "expo-localization";
import i18n, { dir } from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import { getStorage, storageInstance } from "../utils/storage";
import { resources } from "./resources";
import { LOCAL } from "./utils";

const locale = getLocales()[0]?.languageCode ?? "en";
export * from "./utils";

export const initI18n = async () => {
  // Sample usage:
  // import { translate } from "@/lib/i18n";
  // translate("common.appName");
  // import { useTranslation } from "react-i18next";
  // const { t } = useTranslation();
  // t("counter.reset");
  await getStorage();
  const storedLanguage = storageInstance.getString(LOCAL);
  const language = storedLanguage || locale;

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: language,
      fallbackLng: "en",
      compatibilityJSON: "v4",
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      supportedLngs: Object.keys(resources),
    });
  } else {
    await i18n.changeLanguage(language);
  }

  const isRTL = dir(language) === "rtl";
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);

  return i18n;
};

export const isRTL = () => dir() === "rtl";

export default i18n;
