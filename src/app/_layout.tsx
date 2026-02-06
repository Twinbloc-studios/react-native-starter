import "../../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";

import Providers from "@/components/providers";
import { initApp } from "@/lib/app-initializer";

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
void SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  const [ready, setReady] = React.useState(false);

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  React.useEffect(() => {
    let active = true;
    void initApp()
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setReady(true);
          void hideSplash();
        }
      });
    return () => {
      active = false;
    };
  }, [hideSplash]);

  if (!ready) {
    return null;
  }

  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="(main)"
      >
        <Stack.Screen name="(main)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </Providers>
  );
}
