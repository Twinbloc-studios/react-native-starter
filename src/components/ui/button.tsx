import React from "react";
import type { PressableProps } from "react-native";
import {
  ActivityIndicator,
  Pressable as RNPressable,
  View as RNView,
} from "react-native";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import { withUniwind } from "uniwind";

import { Text } from "./text";

const View = withUniwind(RNView);
const Pressable = withUniwind(RNPressable);

const button = tv({
  slots: {
    container: "my-2 flex flex-row items-center justify-center rounded-md px-4",
    label: "font-inter text-base font-semibold",
    indicator: "h-6 text-white",
  },

  variants: {
    variant: {
      default: {
        container: "bg-black dark:bg-white",
        label: "text-white dark:text-black",
        indicator: "text-white dark:text-black",
      },
      secondary: {
        container: "bg-primaryText",
        label: "text-secondary-600",
        indicator: "text-white",
      },
      outline: {
        container: "border border-neutral-400",
        label: "text-black dark:text-neutral-100",
        indicator: "text-black dark:text-neutral-100",
      },
      destructive: {
        container: "bg-red-600",
        label: "text-white",
        indicator: "text-white",
      },
      ghost: {
        container: "bg-transparent",
        label: "text-black underline dark:text-white",
        indicator: "text-black dark:text-white",
      },
      link: {
        container: "bg-transparent",
        label: "text-black",
        indicator: "text-black",
      },
    },
    size: {
      default: {
        container: "h-10 px-4",
        label: "text-base",
      },
      lg: {
        container: "h-12 px-8",
        label: "text-xl",
      },
      sm: {
        container: "h-8 px-3",
        label: "text-sm",
        indicator: "h-2",
      },
      icon: { container: "size-9" },
    },
    disabled: {
      true: {
        container: "bg-neutral-300 dark:bg-neutral-300",
        label: "text-neutral-600 dark:text-neutral-600",
        indicator: "text-neutral-400 dark:text-neutral-400",
      },
    },
    fullWidth: {
      true: {
        container: "",
      },
      false: {
        container: "self-center",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    disabled: false,
    fullWidth: true,
    size: "default",
  },
});

type ButtonVariants = VariantProps<typeof button>;
export interface BProps
  extends ButtonVariants, Omit<PressableProps, "disabled" | "children"> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  indicatorClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<React.ElementRef<typeof View>, BProps>(
  (
    {
      label,
      loading = false,
      className = "",
      textClassName = "",
      indicatorClassName = "",
      variant = "default",
      disabled = false,
      size = "default",
      fullWidth = true,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, fullWidth, size }),
      [variant, disabled, fullWidth, size],
    );

    return (
      <Pressable
        ref={ref}
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        {loading ? (
          <ActivityIndicator
            size="small"
            className={styles.indicator({ className: indicatorClassName })}
            testID={
              props.testID ? `${props.testID}-activity-indicator` : undefined
            }
          />
        ) : (
          <Text
            testID={props.testID ? `${props.testID}-label` : undefined}
            className={styles.label({ className: textClassName })}
          >
            {label}
            {children}
          </Text>
        )}
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </Pressable>
    );
  },
);
Button.displayName = "Button";
