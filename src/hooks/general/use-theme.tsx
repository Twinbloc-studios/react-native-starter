import { colors } from "@/components/utilities/";
import type { Theme } from "@react-navigation/native";
import { DarkTheme as _DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { useMMKVString } from "react-native-mmkv";
import { Appearance } from "react-native";
import { storageInstance } from "../../lib/utils/storage";
import { STORAGE_KEY } from "@/store/auth/utils";

/**
 * Sample usage:
 * const theme = useTheme();
 * return <NavigationContainer theme={theme}>...</NavigationContainer>;
 */
const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.primary[200],
    background: colors.charcoal[950],
    text: colors.charcoal[100],
    border: colors.charcoal[500],
    card: colors.charcoal[850],
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[400],
    background: colors.white,
  },
};

export function useTheme() {
  const { colorScheme } = useColorScheme();
  const [selectedTheme] = useMMKVString(STORAGE_KEY.SELECTED_THEME, storageInstance);
  const resolvedTheme = selectedTheme && selectedTheme !== "system" ? selectedTheme : colorScheme;

  if (resolvedTheme === "dark") return DarkTheme;

  return LightTheme;
}
const selectedTheme = storageInstance?.getString(STORAGE_KEY.SELECTED_THEME) as "light" | "dark" | "system" | undefined;
const systemIsDark = Appearance.getColorScheme() === "dark";
export const isDark: boolean = selectedTheme === "dark" ? true : selectedTheme === "light" ? false : !!systemIsDark;
