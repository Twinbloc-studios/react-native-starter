import React from "react";
import { Pressable } from "react-native";

import { Container, HStack, Text, View } from "@/components/ui";
import { useIsFirstTime } from "@/hooks/general/use-is-first-time";
// import { useSelectedTheme } from "@/hooks/general/use-selected-theme";

export default function Index() {
  const [_, setIsFirstTime] = useIsFirstTime();

  // const { selectedTheme, setSelectedTheme } = useSelectedTheme();
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

      <HStack className="">
        <Pressable
          onPress={() => {
            setIsVisible((prev) => !prev);
            // setSelectedTheme("system");
          }}
          accessibilityRole="button"
          accessibilityLabel="Toggle view"
          accessibilityHint="Toggles the visibility of the animated view"
        >
          <View className="bg-accent-300 ios:bg-accent-900 p-4 dark:bg-black">
            <Text>Default View</Text>
          </View>
        </Pressable>

        <View
          animatePresence
          isVisible={isVisible}
          className="bg-green-900 dark:bg-black"
          motionPreset="fade"
        >
          <Text>Animated View</Text>
        </View>
      </HStack>
    </Container.Insets>
  );
}
