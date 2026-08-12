import { useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { colors } from '@/components/utilities/';
import { STORAGE_KEY } from '@/store/auth/utils';

import { storageInstance } from '../../lib/utils/storage';

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

export function useTheme() {
  const colorScheme = useColorScheme();
  const [selectedTheme] = useMMKVString(
    STORAGE_KEY.SELECTED_THEME,
    storageInstance,
  );
  const resolvedTheme =
    selectedTheme && selectedTheme !== 'system' ? selectedTheme : colorScheme;

  if (resolvedTheme === 'dark') return DarkTheme;

  return LightTheme;
}
