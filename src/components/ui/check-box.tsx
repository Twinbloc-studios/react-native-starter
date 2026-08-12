import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { withUniwind } from 'uniwind';

import { useTween } from '@/hooks/general/use-tween';

import { colors } from '../utilities';
import {
  type IconProps,
  Label,
  Root,
  type RootProps,
  SIZE,
} from './toggle-shared';

const AnimatedView = withUniwind(Animated.View);

export const CheckboxIcon = ({ checked = false }: IconProps) => {
  const color = checked ? colors.primary[600] : colors.charcoal[400];
  const progress = useTween(checked);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', color],
    ),
    borderColor: interpolateColor(progress.value, [0, 1], ['#CCCFD6', color]),
  }));

  const checkStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <AnimatedView
      style={[{ height: SIZE, width: SIZE }, boxStyle]}
      className="items-center justify-center rounded-[5px] border-2"
    >
      <AnimatedView style={checkStyle}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="m16.726 7-.64.633c-2.207 2.212-3.878 4.047-5.955 6.158l-2.28-1.928-.69-.584L6 12.66l.683.577 2.928 2.477.633.535.591-.584c2.421-2.426 4.148-4.367 6.532-6.756l.633-.64L16.726 7Z"
            fill={checked ? colors.primary[600] : 'transparent'}
          />
        </Svg>
      </AnimatedView>
    </AnimatedView>
  );
};

const CheckboxRoot = ({ checked = false, children, ...props }: RootProps) => {
  return (
    <Root checked={checked} accessibilityRole="checkbox" {...props}>
      {children}
    </Root>
  );
};

const CheckboxBase = ({
  checked = false,
  testID,
  label,
  ...props
}: RootProps & { label?: string }) => {
  return (
    <CheckboxRoot checked={checked} testID={testID} {...props}>
      <CheckboxIcon checked={checked} />
      {label ? (
        <Label
          text={label}
          testID={testID ? `${testID}-label` : undefined}
          className="pr-2"
        />
      ) : null}
    </CheckboxRoot>
  );
};

/**
 * Example Usage:
 *
 * ```tsx
 * const [checked, setChecked] = useState(false);
 *
 * <Checkbox
 *   checked={checked}
 *   onChange={setChecked}
 *   label="Accept terms and conditions"
 * />
 * ```
 */
export const Checkbox = Object.assign(CheckboxBase, {
  Icon: CheckboxIcon,
  Root: CheckboxRoot,
  Label,
});
