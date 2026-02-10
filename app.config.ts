import type { ConfigContext, ExpoConfig } from "expo/config";

import { ClientEnv, Env } from "./root-env.js";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  slug: Env.SLUG,
  version: Env.VERSION,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: Env.SCHEME,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.BUNDLE_ID,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: Env.PACKAGE,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  extra: {
    ...ClientEnv,
    ...(Env.EAS_PROJECT_ID ? { eas: { projectId: Env.EAS_PROJECT_ID } } : {}),
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
