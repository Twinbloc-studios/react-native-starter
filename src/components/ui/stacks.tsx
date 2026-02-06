import React from "react";
import { View as RNView, type ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";
import { withUniwind } from "uniwind";

const View = withUniwind(RNView);

export interface StackProps extends ViewProps {
  className?: string;
}

const Stack = ({ className, children, ...props }: StackProps) => {
  return (
    <View className={twMerge("flex-col", className)} {...props}>
      {children}
    </View>
  );
};

const HStack = ({ className, children, ...props }: StackProps) => {
  return (
    <View className={twMerge("flex-row items-center", className)} {...props}>
      {children}
    </View>
  );
};

const VStack = ({ className, children, ...props }: StackProps) => {
  return (
    <View className={twMerge("flex-col", className)} {...props}>
      {children}
    </View>
  );
};

const Center = ({ className, children, ...props }: StackProps) => {
  return (
    <View
      className={twMerge("items-center justify-center", className)}
      {...props}
    >
      {children}
    </View>
  );
};

const Circle = ({ className, children, ...props }: StackProps) => {
  return (
    <View
      className={twMerge("items-center justify-center rounded-full", className)}
      {...props}
    >
      {children}
    </View>
  );
};

export { Center, Circle, HStack, Stack, VStack };
