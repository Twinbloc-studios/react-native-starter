import { router } from "expo-router";
import React from "react";

import { Container, Text } from "@/components/ui";
import { useIsFirstTime } from "@/hooks/general/use-is-first-time";

const Onboarding = () => {
  const [_, setIsFirstTime] = useIsFirstTime();
  return (
    <Container.Insets>
      <Text
        testID="onboarding-button"
        onPress={() => {
          setIsFirstTime(false);
          router.push("/");
        }}
        className="text-yellow-300"
      >
        onboarding
      </Text>
    </Container.Insets>
  );
};

export default Onboarding;
