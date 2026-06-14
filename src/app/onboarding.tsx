import { Env } from '@env';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView } from 'react-native';

import { Button, Container, Icon, Text, View } from '@/components/ui';
import { useIsFirstTime } from '@/hooks/general/use-is-first-time';

const Onboarding = () => {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();

  const handleGetStarted = () => {
    setIsFirstTime(false);
    router.replace('/(main)');
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
                icon={require('../../assets/images/logo.png')}
                size={58}
                color="white"
              />
            </View>
            <Text className="text-xs font-bold uppercase tracking-tight text-white">
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
            <Text className="tracking text-center text-[48px] font-bold uppercase leading-[0.9] text-white">
              Twinbloc Studios
            </Text>
            <View className="mt-1 h-1 w-20 bg-white" />
            <Text className="mt-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              The ultimate React Native starter{'\n'}kit for professionals.
            </Text>
          </View>
        </View>

        {/* Feature Cards */}
        <View className="mt-6 px-8">
          {/* Card 1 */}
          <View className="relative border-x-2 border-t-2 border-white bg-black p-8">
            <View className="relative flex-row items-start justify-between">
              <Text className="flex-1 text-xl font-bold uppercase text-white">
                Production-Ready{'\n'}Architecture
              </Text>
            </View>
            <Text className="mt-2 text-xs font-medium text-white/60">
              Scalable, modular folder structure included.
            </Text>
            <View className="absolute -right-2 -top-5 h-14 w-14 items-center justify-center bg-white shadow-lg">
              <Icon
                icon={require('../../assets/images/onboarding/architecture.svg')}
                size={24}
                color="black"
              />
              <View className="absolute left-1 top-1 h-14 w-14 bg-white/30" />
            </View>
          </View>

          {/* Card 2 */}
          <View className="border-x-2 border-t-2 border-white bg-black p-8">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-xl font-bold uppercase text-white">
                  Pre-configured
                </Text>
                <Text className="text-xl font-bold uppercase text-white">
                  CI/CD
                </Text>
              </View>
            </View>
            <Text className="mt-2 text-xs font-medium text-white/60">
              Deploy faster with built-in automated pipelines.
            </Text>
            <View className="absolute -left-2 -top-5 h-14 w-14 items-center justify-center bg-white shadow-lg">
              <Icon
                icon={require('../../assets/images/onboarding/rocket.svg')}
                size={24}
                color="black"
              />
              <View className="absolute left-1 top-1 h-14 w-14 bg-white/30" />
            </View>
          </View>

          {/* Card 3 */}
          <View className="border-2 border-white bg-black p-8">
            <View className="flex-row items-start justify-between">
              <Text className="flex-1 text-xl font-bold uppercase text-white">
                Comprehensive{'\n'}Documentation
              </Text>
            </View>
            <View className="absolute -right-2 -top-5 h-14 w-14 items-center justify-center bg-white shadow-lg">
              <Icon
                icon={require('../../assets/images/onboarding/book.svg')}
                size={24}
                color="black"
              />
              <View className="absolute left-1 top-1 h-14 w-14 bg-white/30" />
            </View>
            <Text className="mt-2 text-xs font-medium text-white/60">
              Every component and utility explained in detail.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View className="left-0 right-0 py-0 dark:bg-black">
        <View className="flex-row items-center justify-center bg-black py-0 dark:bg-black">
          <Button
            className="h-18 flex-1 rounded-none bg-black dark:bg-black"
            onPress={handleGetStarted}
            rightIcon={
              <Icon
                icon={require('../../assets/images/onboarding/arrow_forward.svg')}
                size={18}
                color="white"
              />
            }
          >
            <Text className="text-sm font-bold uppercase text-white">
              Get Started
            </Text>
          </Button>
          <Button
            variant="default"
            className="w-32.5 h-18 rounded-none bg-white"
            onPress={() => Linking.openURL('https://rn-starter.twinbloc.org')}
          >
            <Text className="text-sm font-bold uppercase text-black dark:text-black">
              Docs
            </Text>
          </Button>
        </View>
      </View>
    </Container.Insets>
  );
};

export default Onboarding;
