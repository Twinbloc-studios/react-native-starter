import { useIsFirstTime } from "@/hooks/general/use-is-first-time";
import { Redirect, Stack } from "expo-router";

export default function MainLayout() {
  const [isFirstTime] = useIsFirstTime();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
