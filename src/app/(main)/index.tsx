import { Container, Text } from "@/components/ui";
import { View } from "@/components/ui/view";
import { useIsFirstTime } from "@/hooks/general/use-is-first-time";
import React from "react";
import { Pressable } from "react-native";

export default function Index() {
  const [_, setIsFirstTime] = useIsFirstTime();

  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <Container.Insets>
      <View>
        <Text
          onPress={() => {
            setIsFirstTime(true);
          }}
        >
          app
        </Text>
      </View>

      <>
        <Pressable onPress={() => setIsVisible((prev) => !prev)}>
          <View className="p-4 bg-white dark:bg-black">
            <Text>Default View</Text>
          </View>
        </Pressable>

        <View animatePresence isVisible={isVisible} className="p-4 bg-gray-500 dark:bg-black" motionPreset="fadeDown">
          <Text>Animated View</Text>
        </View>
      </>
    </Container.Insets>
  );
}
