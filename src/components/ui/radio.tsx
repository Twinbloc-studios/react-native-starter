import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
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

export const RadioIcon = ({ checked = false }: IconProps) => {
  const color = checked ? colors.primary[600] : colors.charcoal[400];
  const progress = useTween(checked);

  const ringStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], ['#CCCFD6', color]),
  }));

  const dotStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <AnimatedView
      style={[{ height: SIZE, width: SIZE }, ringStyle]}
      className="items-center justify-center rounded-[20px] border-2 bg-transparent"
    >
      <AnimatedView
        className={`size-2.5 rounded-[10px] ${checked && 'bg-primary-600 dark:bg-white'} `}
        style={dotStyle}
      />
    </AnimatedView>
  );
};

const RadioRoot = ({ checked = false, children, ...props }: RootProps) => {
  return (
    <Root checked={checked} accessibilityRole="radio" {...props}>
      {children}
    </Root>
  );
};

const RadioBase = ({
  checked = false,
  testID,
  label,
  ...props
}: RootProps & { label?: string }) => {
  return (
    <RadioRoot checked={checked} testID={testID} {...props}>
      <RadioIcon checked={checked} />
      {label ? (
        <Label text={label} testID={testID ? `${testID}-label` : undefined} />
      ) : null}
    </RadioRoot>
  );
};

/**
 * Example Usage:
 *
 * ```tsx
 * const [selected, setSelected] = useState('option1');
 *
 * <Radio
 *   checked={selected === 'option1'}
 *   onChange={() => setSelected('option1')}
 *   label="Option 1"
 * />
 * ```
 */
export const Radio = Object.assign(RadioBase, {
  Icon: RadioIcon,
  Root: RadioRoot,
  Label,
});
