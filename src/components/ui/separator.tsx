import React from "react";
import { View, type ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

export interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const Separator = ({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) => {
  const baseClassName =
    orientation === "vertical"
      ? "w-px self-stretch bg-neutral-200 dark:bg-neutral-700"
      : "h-px w-full bg-neutral-200 dark:bg-neutral-700";

  return <View className={twMerge(baseClassName, className)} {...props} />;
};

Separator.displayName = "Separator";
