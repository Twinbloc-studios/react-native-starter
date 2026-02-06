import React from "react";
import { Appearance } from "react-native";
import { useMMKVString } from "react-native-mmkv";

import { storageInstance } from "@/lib";
import { STORAGE_KEY } from "@/store/auth/utils";

export type ColorSchemeType = "light" | "dark" | "system";
/**
 * Sample usage:
 * const { selectedTheme, setSelectedTheme } = useSelectedTheme();
 * setSelectedTheme("dark");
 */
export const useSelectedTheme = () => {
  const [theme, _setTheme] = useMMKVString(
    STORAGE_KEY.SELECTED_THEME,
    storageInstance,
  );

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      if (t === "system") {
        Appearance.setColorScheme(null);
      } else {
        Appearance.setColorScheme(t);
      }
      _setTheme(t);
    },
    [_setTheme],
  );

  const selectedTheme = (theme ?? "light") as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};
// to be used in the root file to load the selected theme from MMKV
export const loadSelectedTheme = () => {
  const theme = storageInstance?.getString(STORAGE_KEY.SELECTED_THEME);
  if (theme !== undefined && theme !== "system") {
    Appearance.setColorScheme(theme as "light" | "dark");
  } else {
    Appearance.setColorScheme(null);
  }
};
