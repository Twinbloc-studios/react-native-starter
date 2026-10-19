import React from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { colors } from '@/components/utilities';
import { storageInstance } from '@/lib';
import { STORAGE_KEY } from '@/store/auth/utils';

type RNColorSchemeName = 'light' | 'dark' | 'unspecified';
export type ColorSchemeType = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  border: string;
  card: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: colors.primary[200],
    background: colors.charcoal[950],
    text: colors.charcoal[100],
    border: colors.charcoal[500],
    card: colors.charcoal[850],
  },
};

const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.primary[400],
    background: colors.white,
    text: colors.charcoal[950],
    border: colors.charcoal[200],
    card: colors.white,
  },
};

/**
 * Returns both the saved preference and the theme currently applied by the app.
 * `selectedTheme` stays `system` when the device setting controls the theme;
 * `appliedTheme` always resolves to `light` or `dark`.
 */
export const useSelectedTheme = () => {
  const [storedTheme, _setTheme] = useMMKVString(
    STORAGE_KEY.SELECTED_THEME,
    storageInstance,
  );
  const systemColorScheme = useColorScheme();

  const selectedTheme: ColorSchemeType =
    storedTheme === 'light' ||
    storedTheme === 'dark' ||
    storedTheme === 'system'
      ? storedTheme
      : 'system';
  const appliedTheme: 'light' | 'dark' =
    selectedTheme === 'system' ? (systemColorScheme ?? 'light') : selectedTheme;
  const isDark = appliedTheme === 'dark';

  const setSelectedTheme = React.useCallback(
    (theme: ColorSchemeType) => {
      const nativeTheme: RNColorSchemeName =
        theme === 'system' ? 'unspecified' : theme;
      Appearance.setColorScheme(nativeTheme);
      _setTheme(theme);
    },
    [_setTheme],
  );

  const theme = isDark ? DarkTheme : LightTheme;

  return {
    selectedTheme,
    setSelectedTheme,
    appliedTheme,
    isDark,
    theme,
  } as const;
};

/** Apply a saved preference before the first screen is rendered. */
export const loadSelectedTheme = () => {
  const selectedTheme = storageInstance.getString(STORAGE_KEY.SELECTED_THEME);
  Appearance.setColorScheme(
    selectedTheme === 'light' || selectedTheme === 'dark'
      ? selectedTheme
      : 'unspecified',
  );
};
