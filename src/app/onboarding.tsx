import { router } from "expo-router";
import React from "react";

import { Container, Text } from "@/components/ui";
import { useIsFirstTime } from "@/hooks/general/use-is-first-time";

const Onboarding = () => {
  const [_, setIsFirstTime] = useIsFirstTime();
  return (
    <Container.Insets>
      <Text
        onPress={() => {
          setIsFirstTime(false);
          router.push("/");
        }}
      >
        onboarding
      </Text>
    </Container.Insets>
  );
};

export default Onboarding;
