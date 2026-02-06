import { colorScheme, useColorScheme } from "nativewind";
import React from "react";
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
  const { setColorScheme } = useColorScheme();
  const [theme, _setTheme] = useMMKVString(
    STORAGE_KEY.SELECTED_THEME,
    storageInstance,
  );

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      _setTheme(t);
    },
    [setColorScheme, _setTheme],
  );

  const selectedTheme = (theme ?? "light") as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};
// to be used in the root file to load the selected theme from MMKV
export const loadSelectedTheme = () => {
  const theme = storageInstance?.getString(STORAGE_KEY.SELECTED_THEME);
  if (theme !== undefined) {
    colorScheme.set(theme as ColorSchemeType);
  }
};
