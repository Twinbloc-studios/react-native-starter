import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';

import { colors } from '../utilities';

type Props = {
  initialProgress?: number;
  className?: string;
};

export type ProgressBarRef = {
  setProgress: (value: number) => void;
};

type CircularProps = {
  initialProgress?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackColor?: string;
  progressColor?: string;
};

export type CircularProgressBarRef = {
  setProgress: (value: number) => void;
};

const CircularProgressBar = forwardRef<CircularProgressBarRef, CircularProps>(
  (
    {
      initialProgress = 0,
      size = 48,
      strokeWidth = 6,
      className = '',
      trackColor = colors.blue[100],
      progressColor = colors.blue[600],
    },
    ref,
  ) => {
    const progress = useSharedValue<number>(initialProgress ?? 0);

    useImperativeHandle(ref, () => {
      return {
        setProgress: (value: number) => {
          const clamped = Math.min(100, Math.max(0, value));
          progress.value = withTiming(clamped, {
            duration: 250,
            easing: Easing.inOut(Easing.quad),
          });
        },
      };
    }, [progress]);

    React.useEffect(() => {
      const clamped = Math.min(100, Math.max(0, initialProgress ?? 0));
      progress.value = withTiming(clamped, {
        duration: 250,
        easing: Easing.inOut(Easing.quad),
      });
    }, [initialProgress, progress]);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const animatedProps = useAnimatedProps(() => {
      const clamped = Math.min(100, Math.max(0, progress.value));
      return {
        strokeDashoffset: circumference * (1 - clamped / 100),
      };
    });

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    return (
      <View
        className={twMerge('items-center justify-center', className)}
        style={{ width: size, height: size }}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            animatedProps={animatedProps}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
      </View>
    );
  },
);

CircularProgressBar.displayName = 'ProgressBar.Circular';

const BaseProgressBar = forwardRef<ProgressBarRef, Props>(
  ({ initialProgress = 0, className = '' }, ref) => {
    const progress = useSharedValue<number>(initialProgress ?? 0);
    useImperativeHandle(ref, () => {
      return {
        setProgress: (value: number) => {
          progress.value = withTiming(value, {
            duration: 250,
            easing: Easing.inOut(Easing.quad),
          });
        },
      };
    }, [progress]);

    React.useEffect(() => {
      const clamped = Math.min(100, Math.max(0, initialProgress ?? 0));
      progress.value = withTiming(clamped, {
        duration: 250,
        easing: Easing.inOut(Easing.quad),
      });
    }, [initialProgress, progress]);

    const style = useAnimatedStyle(() => {
      return {
        width: `${progress.value}%`,
        backgroundColor: colors.blue[600],
        height: 10,
        borderRadius: 30,
      };
    });
    return (
      <View className={twMerge(` w-full rounded-xl bg-[#EAEAEA]`, className)}>
        <Animated.View style={style} />
      </View>
    );
  },
);

BaseProgressBar.displayName = 'ProgressBar';

type ProgressBarComponent = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Props> & React.RefAttributes<ProgressBarRef>
> & {
  Circular: typeof CircularProgressBar;
};

export const ProgressBar = BaseProgressBar as ProgressBarComponent;

ProgressBar.Circular = CircularProgressBar;
ProgressBar.displayName = 'ProgressBar';
