import React from "react";
import { Pressable } from "react-native";

import { Container, Text } from "@/components/ui";
import { View } from "@/components/ui/view";
import { useIsFirstTime } from "@/hooks/general/use-is-first-time";

export default function Index() {
  const [_, setIsFirstTime] = useIsFirstTime();

  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <Container.Insets>
      <View>
        <Text
          testID="app-reset-button"
          onPress={() => {
            setIsFirstTime(true);
          }}
        >
          app
        </Text>
      </View>

      <>
        <Pressable
          onPress={() => setIsVisible((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel="Toggle view"
          accessibilityHint="Toggles the visibility of the animated view"
        >
          <View className="bg-green-500 p-4 dark:bg-black">
            <Text>Default View</Text>
          </View>
        </Pressable>

        <View
          animatePresence
          isVisible={isVisible}
          className="bg-green-900 p-4 dark:bg-black"
          motionPreset="fadeDown"
        >
          <Text>Animated View</Text>
        </View>
      </>
    </Container.Insets>
  );
}
