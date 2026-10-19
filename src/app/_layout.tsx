import '../global.css';

import { Stack } from 'expo-router';
import {
  hideAsync,
  preventAutoHideAsync,
  setOptions,
} from 'expo-splash-screen';
import React from 'react';

import Providers from '@/components/providers';
import { initApp } from '@/lib/app-initializer';

export const unstable_settings = {
  initialRouteName: '(main)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
void preventAutoHideAsync();
// Set the animation options. This is optional.
setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    void initApp()
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setReady(true);
          void hideAsync();
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(main)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </Providers>
  );
}
