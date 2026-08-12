import { useEffect } from 'react';
import {
  type SharedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type UseTweenOptions = {
  /** Duration (ms) of the timing animation. Ignored when `spring` is true. */
  duration?: number;
  /** Drive the tween with a clamped spring instead of a timing animation. */
  spring?: boolean;
};

/**
 * Animates a 0 → 1 progress shared value whenever `active` flips, starting
 * from the current value. Use the returned shared value with
 * `useAnimatedStyle` — e.g. map it to colors with `interpolateColor` or to
 * transforms with `interpolate`.
 *
 * ```tsx
 * const progress = useTween(checked);
 * const style = useAnimatedStyle(() => ({
 *   borderColor: interpolateColor(
 *     progress.value,
 *     [0, 1],
 *     ['#CCCFD6', colors.primary[600]],
 *   ),
 * }));
 * ```
 */
export function useTween(
  active: boolean,
  { duration = 100, spring = false }: UseTweenOptions = {},
): SharedValue<number> {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = spring
      ? withSpring(active ? 1 : 0, { overshootClamping: true })
      : withTiming(active ? 1 : 0, { duration });
  }, [active, duration, progress, spring]);

  return progress;
}
