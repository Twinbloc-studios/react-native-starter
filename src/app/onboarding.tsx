import { Container, Text } from "@/components/ui";
import { useIsFirstTime } from "@/hooks/general/use-is-first-time";
import { router } from "expo-router";
import React from "react";

const Onboarding = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
