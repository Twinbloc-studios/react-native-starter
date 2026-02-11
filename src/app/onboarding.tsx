import { Env } from "@env";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, ScrollView } from "react-native";

import { Button, Container, Icon, Text, View } from "@/components/ui";
import { useIsFirstTime } from "@/hooks/general/use-is-first-time";

const Onboarding = () => {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();

  const handleGetStarted = () => {
    setIsFirstTime(false);
    router.replace("/(main)");
  };

  return (
    <Container.Insets className="bg-black px-0">
      <ScrollView
        contentContainerClassName="pb-safe"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-8 py-8">
          <View className="flex-row items-center gap-2">
            <View className="size-10 items-center justify-center rounded-sm">
              <Icon
                icon={require("../../assets/images/logo.png")}
                size={58}
                color="white"
              />
            </View>
            <Text className="font-bold text-xs uppercase tracking-tight text-white">
              Twinbloc
            </Text>
          </View>
          <Text className="font-regular text-xs text-white/50">
            v{Env.VERSION}
          </Text>
        </View>

        {/* Hero Section */}
        <View className="px-8 pb-4">
          <View className="items-center">
            <Text className="text-center font-bold text-[48px] uppercase leading-[0.9] tracking text-white">
              Twinbloc Studios
            </Text>
            <View className="h-1 w-20 mt-1 bg-white" />
            <Text className="text-center mt-5 font-medium text-xs uppercase tracking-[0.2em] text-white/70">
              The ultimate React Native starter{"\n"}kit for professionals.
            </Text>
          </View>
        </View>

        {/* Feature Cards */}
        <View className="mt-6 px-8">
          {/* Card 1 */}
          <View className="relative  border-x-2 border-t-2 border-white bg-black p-8">
            <View className="flex-row items-start justify-between relative">
              <Text className="flex-1 font-bold text-xl uppercase text-white">
                Production-Ready{"\n"}Architecture
              </Text>
            </View>
            <Text className="mt-2 font-medium text-xs text-white/60">
              Scalable, modular folder structure included.
            </Text>
            <View className="h-14 w-14 items-center justify-center absolute -top-5 -right-2 bg-white shadow-lg">
              <Icon
                icon={require("../../assets/images/onboarding/architecture.svg")}
                size={24}
                color="black"
              />
              <View className="h-14 w-14 bg-white/30 absolute left-1 top-1 " />
            </View>
          </View>

          {/* Card 2 */}
          <View className=" border-x-2 border-t-2 border-white bg-black p-8">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="font-bold text-xl uppercase text-white">
                  Pre-configured
                </Text>
                <Text className="font-bold text-xl uppercase text-white">
                  CI/CD
                </Text>
              </View>
            </View>
            <Text className="mt-2 font-medium text-xs text-white/60">
              Deploy faster with built-in automated pipelines.
            </Text>
            <View className="h-14 w-14 items-center justify-center absolute -top-5 -left-2 bg-white shadow-lg">
              <Icon
                icon={require("../../assets/images/onboarding/rocket.svg")}
                size={24}
                color="black"
              />
              <View className="h-14 w-14 bg-white/30 absolute left-1 top-1 " />
            </View>
          </View>

          {/* Card 3 */}
          <View className=" border-2 border-white bg-black p-8">
            <View className="flex-row items-start justify-between">
              <Text className="flex-1 font-bold text-xl uppercase text-white">
                Comprehensive{"\n"}Documentation
              </Text>
            </View>
            <View className="h-14 w-14 items-center justify-center absolute -top-5 -right-2 bg-white shadow-lg">
              <Icon
                icon={require("../../assets/images/onboarding/book.svg")}
                size={24}
                color="black"
              />
              <View className="h-14 w-14 bg-white/30 absolute left-1 top-1 " />
            </View>
            <Text className="mt-2 font-medium text-xs text-white/60">
              Every component and utility explained in detail.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View className=" dark:bg-black left-0 right-0  py-0">
        <View className="flex-row bg-black dark:bg-black items-center justify-center py-0">
          <Button
            className="h-[72px] flex-1 rounded-none dark:bg-black bg-black"
            onPress={handleGetStarted}
            rightIcon={
              <Icon
                icon={require("../../assets/images/onboarding/arrow_forward.svg")}
                size={18}
                color="white"
              />
            }
          >
            <Text className="font-bold text-sm uppercase text-white">
              Get Started
            </Text>
          </Button>
          <Button
            variant="default"
            className="h-[72px] w-[130px] rounded-none bg-white"
            onPress={() => Linking.openURL("https://rn-starter.twinbloc.org")}
          >
            <Text className="font-bold text-sm uppercase text-black dark:text-black">
              Docs
            </Text>
          </Button>
        </View>
      </View>
    </Container.Insets>
  );
};

export default Onboarding;
