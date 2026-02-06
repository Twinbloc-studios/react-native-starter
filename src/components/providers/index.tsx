import { ReanimatedTrueSheetProvider } from "@lodev09/react-native-true-sheet/reanimated";
import { ThemeProvider } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast, Toaster } from "sonner-native";
import { Uniwind } from "uniwind";

import { APIProvider } from "@/api";
import { useTheme } from "@/hooks/general/use-theme";
import i18n from "@/lib/i18n";
import { toastOptions } from "@/lib/utils/toast-config";

function UniwindInsetUpdater() {
  const insets = useSafeAreaInsets();
  React.useEffect(() => {
    Uniwind.updateInsets(insets);
  }, [insets]);
  return null;
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  function Wrapper({
    toastId,
    children,
  }: {
    toastId: string | number;
    children: React.ReactNode;
  }) {
    if (typeof toastId === "string" && !toastId.startsWith("modal-")) {
      return <>{children}</>;
    }

    if (typeof toastId === "number") {
      return <>{children}</>;
    }

    function onPress() {
      toast.dismiss(toastId);
    }
    return (
      <BlurView
        intensity={10}
        style={{ flex: 1, position: "absolute", inset: 0 }}
        tint="systemMaterialDark"
        experimentalBlurMethod="dimezisBlurView"
      >
        <Pressable
          onPress={onPress}
          className="absolute inset-0 h-full flex-1 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Dismiss modal"
          accessibilityHint="Closes the modal and returns to the previous screen"
        >
          {children}
        </Pressable>
      </BlurView>
    );
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      className={theme.dark ? `dark` : undefined}
    >
      <I18nextProvider i18n={i18n}>
        <ThemeProvider value={theme}>
          <UniwindInsetUpdater />
          <APIProvider>
            <ReanimatedTrueSheetProvider>
              {children}
              <Toaster
                ToastWrapper={Wrapper}
                theme={theme.dark ? "dark" : "light"}
                swipeToDismissDirection="up"
                position="top-center"
                toastOptions={toastOptions}
                richColors
              />
            </ReanimatedTrueSheetProvider>
          </APIProvider>
        </ThemeProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

export default Providers;
