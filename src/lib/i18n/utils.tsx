import Constants from "expo-constants";
import type { TOptions } from "i18next";
import { changeLanguage as i18nChangeLanguage, dir, t } from "i18next";
import memoize from "lodash.memoize";
import { useCallback } from "react";
import { I18nManager, NativeModules, Platform } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import RNRestart from "react-native-restart";

import { STORAGE_KEY } from "@/store/auth/utils";

import { storageInstance } from "../utils/storage";
import type { Language, resources } from "./resources";
import type { RecursiveKeyOf } from "./types";

type DefaultLocale = typeof resources.en.translation;
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

export const LOCAL = STORAGE_KEY.LOCAL;

export const getLanguage = () => storageInstance?.getString(LOCAL);

export const translate = memoize(
  (key: TxKeyPath, options = undefined) => t(key, options) as unknown as string,
  (key: TxKeyPath, options: TOptions) =>
    options ? key + JSON.stringify(options) : key,
);

export const changeLanguage = (lang: Language) => {
  storageInstance?.set(LOCAL, lang);
  void i18nChangeLanguage(lang);
  const isRTL = dir(lang) === "rtl";
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
  if (Platform.OS === "ios" || Platform.OS === "android") {
    const isExpoGo = Constants.appOwnership === "expo";
    if (__DEV__ && NativeModules.DevSettings?.reload) {
      NativeModules.DevSettings.reload();
      return;
    }
    if (!isExpoGo) {
      try {
        RNRestart.restart();
      } catch {
        if (NativeModules.DevSettings?.reload) {
          NativeModules.DevSettings.reload();
        }
      }
    }
  } else if (Platform.OS === "web") {
    window.location.reload();
  }
};

export const useSelectedLanguage = () => {
  const [language, setLang] = useMMKVString(LOCAL, storageInstance);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLang(lang);
      if (lang !== undefined) changeLanguage(lang as Language);
    },
    [setLang],
  );

  return { language: language as Language, setLanguage };
};
