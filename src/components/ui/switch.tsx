import { createContext, useContext } from 'react';
import { I18nManager, Switch as RNSwitch, View as RNView } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

import { useTween } from '@/hooks/general/use-tween';

import { colors, IS_IOS } from '../utilities';
import { type IconProps, Label, Root, type RootProps } from './toggle-shared';

const View = withUniwind(RNView);
const AnimatedView = withUniwind(Animated.View);
const StyledSwitch = withUniwind(RNSwitch);

const WIDTH = 50;
const HEIGHT = 28;
const THUMB_HEIGHT = 22;
const THUMB_WIDTH = 22;
const THUMB_OFFSET = 4;

type SwitchContextValue = {
  accessibilityLabel: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  testID?: string;
};

const SwitchContext = createContext<SwitchContextValue | null>(null);

export const SwitchIcon = ({ checked = false }: IconProps) => {
  const ctx = useContext(SwitchContext);

  const progress = useTween(checked, { spring: true });

  const offTarget = I18nManager.isRTL
    ? WIDTH - THUMB_WIDTH - THUMB_OFFSET
    : -(WIDTH - THUMB_WIDTH - THUMB_OFFSET);
  const onTarget = I18nManager.isRTL ? THUMB_OFFSET : -THUMB_OFFSET;

  const thumbStyle = useAnimatedStyle(() => ({
    translateX: interpolate(progress.value, [0, 1], [offTarget, onTarget]),
  }));

  if (IS_IOS) {
    const isChecked = ctx?.checked ?? checked;
    const iosScaleX = WIDTH / 69;
    const iosScaleY = HEIGHT / 38;

    return (
      <View style={{ width: WIDTH, height: HEIGHT, justifyContent: 'center' }}>
        <StyledSwitch
          value={isChecked}
          disabled={ctx?.disabled ?? undefined}
          onValueChange={(value) => {
            ctx?.onChange(value);
          }}
          trackColor={{
            false: colors.charcoal[400],
            true: colors.success[500],
          }}
          ios_backgroundColor={colors.charcoal[400]}
          thumbColor={colors.white}
          accessibilityLabel={ctx?.accessibilityLabel ?? 'Switch'}
          accessibilityHint="Double tap to toggle setting"
          accessible={false}
          style={{ transform: [{ scaleX: iosScaleX }, { scaleY: iosScaleY }] }}
        />
      </View>
    );
  }

  const backgroundColor = checked ? colors.primary[600] : colors.charcoal[400];

  return (
    <View className="w-12.5 justify-center">
      <View className="overflow-hidden rounded-full">
        <View
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundColor,
          }}
        />
      </View>
      <AnimatedView
        style={[
          {
            height: THUMB_HEIGHT,
            width: THUMB_WIDTH,
            position: 'absolute',
            backgroundColor: colors.white,
            borderRadius: 13,
            right: 0,
          },
          thumbStyle,
        ]}
      />
    </View>
  );
};

const SwitchRoot = ({ checked = false, children, ...props }: RootProps) => {
  const { accessibilityLabel, disabled, onChange, testID } = props;
  const normalizedDisabled = disabled ?? undefined;

  return (
    <SwitchContext.Provider
      value={{
        accessibilityLabel,
        checked,
        disabled: normalizedDisabled,
        onChange,
        testID,
      }}
    >
      <Root checked={checked} accessibilityRole="switch" {...props}>
        {children}
      </Root>
    </SwitchContext.Provider>
  );
};

const SwitchBase = ({
  checked = false,
  testID,
  label,
  ...props
}: RootProps & { label?: string }) => {
  return (
    <SwitchRoot checked={checked} testID={testID} {...props}>
      <SwitchIcon checked={checked} />
      {label ? (
        <Label text={label} testID={testID ? `${testID}-label` : undefined} />
      ) : null}
    </SwitchRoot>
  );
};

/**
 * Example Usage:
 *
 * ```tsx
 * const [enabled, setEnabled] = useState(false);
 *
 * <Switch
 *   checked={enabled}
 *   onChange={setEnabled}
 *   label="Enable notifications"
 * />
 * ```
 */
export const Switch = Object.assign(SwitchBase, {
  Icon: SwitchIcon,
  Root: SwitchRoot,
  Label,
});
