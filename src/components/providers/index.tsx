import { ReanimatedTrueSheetProvider } from '@lodev09/react-native-true-sheet/reanimated';
import { Toaster } from 'goey-native-toast';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import { APIProvider } from '@/api';
import { useTheme } from '@/hooks/general/use-theme';
import i18n from '@/lib/i18n';
import { toasterDefaults } from '@/lib/utils/toast-config';

function UniwindInsetUpdater() {
  const insets = useSafeAreaInsets();
  React.useEffect(() => {
    Uniwind.updateInsets(insets);
  }, [insets]);
  return null;
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      className={theme.dark ? `dark` : undefined}
    >
      <I18nextProvider i18n={i18n}>
        <UniwindInsetUpdater />
        <APIProvider>
          <ReanimatedTrueSheetProvider>
            {children}
            <Toaster
              theme={theme.dark ? 'dark' : 'light'}
              swipeToDismissDirection={toasterDefaults.swipeToDismissDirection}
              position={toasterDefaults.position}
              duration={toasterDefaults.duration}
              solidColors={toasterDefaults.solidColors}
            />
          </ReanimatedTrueSheetProvider>
        </APIProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

export default Providers;
