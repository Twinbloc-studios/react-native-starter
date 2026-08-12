import { type ComponentProps } from 'react';
import { View as RNView, type ViewProps } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  LinearTransition,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

const NativeAnimatedView = withUniwind(Animated.View);
const NativeView = withUniwind(RNView);

type AnimatedViewProps = ComponentProps<typeof Animated.View>;
type EnteringAnimation = AnimatedViewProps['entering'];
type ExitingAnimation = AnimatedViewProps['exiting'];
type LayoutAnimation = AnimatedViewProps['layout'];
type MotionPreset = 'fade' | 'fadeUp' | 'fadeDown' | 'scale';
type LayoutPreset = 'linear' | 'spring';

interface Props extends ViewProps {
  /** Enables enter/exit animations when the view mounts or unmounts. */
  animatePresence?: boolean;
  /** Whether the view is shown (used together with animatePresence). */
  isVisible?: boolean;
  /** Enter/exit animation preset. */
  motionPreset?: MotionPreset;
  /** Layout transition preset, animating position/size changes. */
  layoutPreset?: LayoutPreset;
  /** Delay (ms) applied to the enter, exit, and layout animations. */
  delay?: number;
  /** Fine-grained overrides for the enter, exit, and layout animations. */
  motionProps?: {
    entering?: EnteringAnimation;
    exiting?: ExitingAnimation;
    layout?: LayoutAnimation;
  };
}

const motionPresets: Record<
  MotionPreset,
  { entering: EnteringAnimation; exiting: ExitingAnimation }
> = {
  fade: { entering: FadeIn.duration(200), exiting: FadeOut.duration(200) },
  fadeUp: {
    entering: FadeInUp.duration(220),
    exiting: FadeOutUp.duration(220),
  },
  fadeDown: {
    entering: FadeInDown.duration(220),
    exiting: FadeOutDown.duration(220),
  },
  scale: { entering: ZoomIn.duration(200), exiting: ZoomOut.duration(200) },
};

const layoutPresets: Record<LayoutPreset, LayoutAnimation> = {
  linear: LinearTransition.duration(250),
  spring: LinearTransition.springify().damping(20).stiffness(200),
};

export function View({
  animatePresence = false,
  isVisible = true,
  motionPreset = 'fadeUp',
  layoutPreset,
  delay,
  motionProps,
  children,
  ...props
}: Props) {
  const wantsAnimation =
    animatePresence ||
    layoutPreset !== undefined ||
    motionProps?.layout !== undefined;

  if (!wantsAnimation) {
    return <NativeView {...props}>{children}</NativeView>;
  }

  if (animatePresence && !isVisible) {
    return null;
  }

  const preset = motionPresets[motionPreset];

  const entering = animatePresence
    ? (motionProps?.entering ?? preset.entering)
    : undefined;
  const exiting = animatePresence
    ? (motionProps?.exiting ?? preset.exiting)
    : undefined;
  const layout = layoutPreset
    ? (motionProps?.layout ?? layoutPresets[layoutPreset])
    : motionProps?.layout;

  // LayoutAnimationFunction has no builder methods — leave it untouched.
  const withDelay = <T,>(animation: T | undefined): T | undefined => {
    if (delay === undefined || animation == null) {
      return animation;
    }
    const maybeDelayable = animation as { delay?: (ms: number) => unknown };
    if (typeof maybeDelayable.delay !== 'function') {
      return animation;
    }
    return maybeDelayable.delay(delay) as T;
  };

  return (
    <NativeAnimatedView
      {...props}
      entering={withDelay(entering)}
      exiting={withDelay(exiting)}
      layout={withDelay(layout)}
    >
      {children}
    </NativeAnimatedView>
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
        delay={150}
        isVisible={isVisible}
        className="p-4 bg-white dark:bg-black"
      >
        <Text>Animated View</Text>
      </View>

      <View layoutPreset="spring" className="p-4 bg-white dark:bg-black">
        <Text>Layout View (animates position/size changes)</Text>
      </View>
    </>
  );
}
*/
