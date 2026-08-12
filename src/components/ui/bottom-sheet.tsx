import { Ionicons } from '@expo/vector-icons';
import {
  TrueSheet,
  type TrueSheetProps,
} from '@lodev09/react-native-true-sheet';
import * as React from 'react';
import {
  Pressable as RNPressable,
  useColorScheme,
  View as RNView,
} from 'react-native';
import { withUniwind } from 'uniwind';

import { colors } from '..';
import { Text } from './text';

const View = withUniwind(RNView);
const Pressable = withUniwind(RNPressable);

export interface BottomSheetProps extends TrueSheetProps {
  title?: string;
}

export interface BottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

/**
 * Usage example:
 *
 * const { ref, present, dismiss } = useBottomSheet();
 *
 * return (
 *   <>
 *     <Pressable onPress={present}>
 *       <Text>Open</Text>
 *     </Pressable>
 *
 *     <BottomSheet
 *       ref={ref}
 *       title="Actions"
 *       detents={["auto", 0.6, 1]}
 *       initialDetentIndex={0}
 *     >
 *       <View className="p-4 gap-3">
 *         <Pressable onPress={dismiss}>
 *           <Text>Close</Text>
 *         </Pressable>
 *       </View>
 *     </BottomSheet>
 *   </>
 * );
 *
 * For more customization options, visit https://sheet.lodev09.com/
 */
export const useBottomSheet = () => {
  const ref = React.useRef<TrueSheet>(null);
  const present = () => {
    void ref.current?.present();
  };
  const dismiss = () => {
    void ref.current?.dismiss();
  };
  return { ref, present, dismiss };
};

export const BottomSheet = React.forwardRef<TrueSheet, BottomSheetProps>(
  ({ title, style, children, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const innerRef = React.useRef<TrueSheet>(null);
    React.useImperativeHandle(ref, () => innerRef.current as TrueSheet);

    // Helper to dismiss
    const dismiss = React.useCallback(() => {
      void innerRef.current?.dismiss();
    }, []);

    return (
      <TrueSheet
        ref={innerRef}
        cornerRadius={24}
        grabber
        grabberOptions={{
          width: 40,
          height: 4,
          color: isDark ? '#525252' : '#D1D5DB',
        }}
        style={[{ paddingBottom: 20 }, style]}
        {...props}
      >
        {title && <BottomSheetHeader title={title} dismiss={dismiss} />}
        {children}
      </TrueSheet>
    );
  },
);
BottomSheet.displayName = 'BottomSheet';

/**
 * BottomSheetHeader
 */
type BottomSheetHeaderProps = {
  title?: string;
  dismiss: () => void;
};

const BottomSheetHeader = React.memo(
  ({ title, dismiss }: BottomSheetHeaderProps) => {
    return (
      <View className="flex-row items-center justify-between border-b border-neutral-100 p-4 dark:border-neutral-800">
        <View className="w-8" />
        <Text className="text-base font-bold text-neutral-900 dark:text-white">
          {title}
        </Text>
        <CloseButton close={dismiss} />
      </View>
    );
  },
);
BottomSheetHeader.displayName = 'BottomSheetHeader';

const CloseButton = ({ close }: { close: () => void }) => {
  const colorScheme = useColorScheme();
  return (
    <Pressable
      onPress={close}
      className="z-50 size-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
      hitSlop={30}
      accessibilityLabel="close BottomSheet"
      accessibilityHint="Closes the bottom sheet"
      accessibilityRole="button"
    >
      <Ionicons
        name="close-circle"
        size={28}
        color={colorScheme === 'dark' ? 'white' : colors.black}
      />
    </Pressable>
  );
};
