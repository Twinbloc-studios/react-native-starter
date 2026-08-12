import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as Font from 'expo-font';

import { hydrateAuth } from '@/store/auth';

import { initI18n } from './i18n';
import { getStorage } from './utils/storage';

export const initApp = async () => {
  await Font.loadAsync({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // To use local fonts instead of @expo-google-fonts/inter:
    // 1) Place font files in assets/fonts (e.g. Inter-Regular.ttf).
    // 2) Replace the entries above with local mappings like:
    //    Inter_400Regular: require("@/assets/fonts/Inter-Regular.ttf"),
    //    Inter_500Medium: require("@/assets/fonts/Inter-Medium.ttf"),
    //    Inter_600SemiBold: require("@/assets/fonts/Inter-SemiBold.ttf"),
    //    Inter_700Bold: require("@/assets/fonts/Inter-Bold.ttf"),
    // 3) Full example:
    //    await Font.loadAsync({
    //      Inter_400Regular: require("@/assets/fonts/Inter-Regular.ttf"),
    //      Inter_500Medium: require("@/assets/fonts/Inter-Medium.ttf"),
    //      Inter_600SemiBold: require("@/assets/fonts/Inter-SemiBold.ttf"),
    //      Inter_700Bold: require("@/assets/fonts/Inter-Bold.ttf"),
    //    });
    // 4) Keep the font family names consistent with text.tsx mappings.
  });
  await getStorage();
  await initI18n();
  await hydrateAuth();
};
