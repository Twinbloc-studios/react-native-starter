import { AnimatePresence, View as MotiView } from "moti";
import { cssInterop } from "nativewind";
import { type ComponentProps, useMemo } from "react";
import { View as RNView, type ViewProps } from "react-native";

const NativeMotiView = cssInterop(MotiView, { className: "style" });
const NativeView = cssInterop(RNView, { className: "style" });

type MotiProps = ComponentProps<typeof MotiView>;
type PresenceProps = ComponentProps<typeof AnimatePresence>;
type MotionPreset = "fade" | "fadeUp" | "fadeDown" | "scale";

interface Props extends ViewProps {
  animatePresence?: boolean;
  isVisible?: boolean;
  motionPreset?: MotionPreset;
  motionProps?: Omit<MotiProps, keyof ViewProps | "children">;
  presenceProps?: PresenceProps;
}

const motionPresets: Record<MotionPreset, Partial<MotiProps>> = {
  fade: {
    from: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { type: "timing", duration: 200 },
  },
  fadeUp: {
    from: { opacity: 0, translateY: 8 },
    animate: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: -8 },
    transition: { type: "timing", duration: 220 },
  },
  fadeDown: {
    from: { opacity: 0, translateY: -8 },
    animate: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: 8 },
    transition: { type: "timing", duration: 220 },
  },
  scale: {
    from: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { type: "timing", duration: 200 },
  },
};

export function View({
  animatePresence = false,
  isVisible = true,
  motionPreset = "fadeUp",
  motionProps,
  presenceProps,
  children,
  ...props
}: Props) {
  const mergedMotionProps = useMemo(
    () => ({ ...motionPresets[motionPreset], ...motionProps }),
    [motionPreset, motionProps],
  );

  if (!animatePresence) {
    return <NativeView {...props}>{children}</NativeView>;
  }

  return (
    <AnimatePresence {...presenceProps}>
      {isVisible ? (
        <NativeMotiView {...props} {...mergedMotionProps} key="moti-view">
          {children}
        </NativeMotiView>
      ) : null}
    </AnimatePresence>
  );
}

/*
Sample usage:

import React from "react";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";

export function Example() {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <>
      <View className="p-4 bg-white dark:bg-black">
        <Text>Default View</Text>
      </View>

      <View
        animatePresence
        motionPreset="fadeUp"
        isVisible={isVisible}
        className="p-4 bg-white dark:bg-black"
        motionProps={{ transition: { type: "timing", duration: 260 } }}
      >
        <Text>Animated View</Text>
      </View>
    </>
  );
}
*/
