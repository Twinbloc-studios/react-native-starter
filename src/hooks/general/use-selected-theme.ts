import { Appearance, useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { storageInstance } from '@/lib';
import { STORAGE_KEY } from '@/store/auth/utils';

type RNColorSchemeName = 'light' | 'dark' | 'unspecified';
export type ColorSchemeType = 'light' | 'dark' | 'system';
/**
 * Sample usage:
 * const { selectedTheme, setSelectedTheme } = useSelectedTheme();
 * setSelectedTheme("dark");
 */
export const useSelectedTheme = () => {
  const [storedTheme, _setTheme] = useMMKVString(
    STORAGE_KEY.SELECTED_THEME,
    storageInstance,
  );
  const systemColorScheme = useColorScheme();

  const setSelectedTheme = (t: ColorSchemeType) => {
    if (t === 'system') {
      Appearance.setColorScheme('unspecified');
    } else {
      Appearance.setColorScheme(t as RNColorSchemeName);
    }
    _setTheme(t);
  };

  // Resolve the actual theme: if stored theme is "system" or not set, use system color scheme
  const selectedTheme = (
    storedTheme && storedTheme !== 'system'
      ? storedTheme
      : (systemColorScheme ?? 'light')
  ) as ColorSchemeType;

  return { selectedTheme, setSelectedTheme } as const;
};
