import React from "react";

import { Container, Text, View } from "@/components/ui";
import { useIsFirstTime } from "@/hooks/general/use-is-first-time";

export default function Index() {
  const [_, setIsFirstTime] = useIsFirstTime();

  return (
    <Container.Insets>
      <View className="flex-1 items-center justify-center">
        <Text
          testID="app-reset-button"
          onPress={() => {
            setIsFirstTime(true);
          }}
        >
          Edit app/(main)/index.tsx to see changes.
        </Text>
      </View>
    </Container.Insets>
  );
}
