import React from "react";
import { View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

interface ContainerProps extends ViewProps {
  className?: string;
}

type ContainerComponent = React.FC<ContainerProps> & {
  Page: React.FC<ContainerProps>;
  Box: React.FC<ContainerProps>;
  Insets: React.FC<ContainerProps>;
};

export const Container: ContainerComponent = ({ className, children, ...props }) => {
  return (
    <View className={twMerge("px-5 bg-white dark:bg-black", className)} {...props}>
      {children}
    </View>
  );
};

const Page: React.FC<ContainerProps> = ({ className, children, ...props }) => {
  return (
    <View className={twMerge("flex-1 bg-white dark:bg-black", className)} {...props}>
      {children}
    </View>
  );
};

const Box: React.FC<ContainerProps> = ({ className, children, ...props }) => {
  return (
    <View className={twMerge("px-5 mt-2 dark:bg-black", className)} {...props}>
      {children}
    </View>
  );
};

const Insets: React.FC<ContainerProps> = ({ className, style, children, ...props }) => {
  const insets = useSafeAreaInsets();

  return (
    <View className={twMerge("flex-1 bg-white dark:bg-[#131313]", className)} style={[{ paddingTop: insets.top }, style]} {...props}>
      {children}
    </View>
  );
};

Container.Page = Page;
Container.Box = Box;
Container.Insets = Insets;
