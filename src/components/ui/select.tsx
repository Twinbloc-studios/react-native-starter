import { type SheetDetent, type TrueSheet } from "@lodev09/react-native-true-sheet";
import { FlashList } from "@shopify/flash-list";
import * as React from "react";
import type { FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import { View } from "react-native";
import { Pressable, type PressableProps } from "react-native";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

import type { InputControllerType } from "./input";
import { Text, Input, BottomSheet, useBottomSheet } from ".";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const selectTv = tv({
  slots: {
    container: "mb-4",
    label: "text-grey-100 mb-1 text-base dark:text-neutral-100",
    input: "border-grey-50 mt-0 flex-row items-center justify-center rounded-xl border p-3 py-4  dark:border-neutral-500 dark:bg-neutral-800",
    inputValue: "dark:text-neutral-100",
  },

  variants: {
    focused: {
      true: {
        input: "border-primaryText",
      },
    },
    error: {
      true: {
        input: "border-danger-600",
        label: "text-danger-600 dark:text-danger-600",
        inputValue: "text-danger-600",
      },
    },
    disabled: {
      true: {
        input: "bg-neutral-200",
      },
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
  },
});

export type OptionType = { label: string; value: string | number };

type OptionsProps = {
  options: OptionType[];
  onSelect: (option: OptionType) => void;
  value?: string | number;
  testID?: string;
  title?: string;
  scrollable?: boolean;
  searchable?: boolean;
  detents?: SheetDetent[];
};

export const Options = React.forwardRef<TrueSheet, OptionsProps>(
  ({ options, onSelect, value, testID, title = "Select", scrollable = false, searchable = false, detents = [1] }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [options, searchQuery]);

    const renderSelectItem = React.useCallback(
      ({ item }: { item: OptionType }) => (
        <Option
          label={item.label}
          selected={value === item.value}
          onPress={() => {
            onSelect(item);
            setSearchQuery("");
          }}
          testID={testID ? `${testID}-item-${item.value}` : undefined}
        />
      ),
      [onSelect, value, testID],
    );

    return (
      <BottomSheet ref={ref} title={title} scrollable={scrollable} detents={detents}>
        {searchable && (
          <View className="px-4 pb-2">
            <Input placeholder="Search..." value={searchQuery} onChangeText={setSearchQuery} autoCapitalize="none" />
          </View>
        )}
        <FlashList
          data={filteredOptions}
          renderItem={renderSelectItem}
          testID={testID ? `${testID}-modal` : undefined}
          // @ts-ignore
          estimatedItemSize={102}
          className={twMerge("", searchable && "pt-36")}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-gray-500 dark:text-gray-400">No options found</Text>
            </View>
          }
        />
      </BottomSheet>
    );
  },
);

const Option = React.memo(
  ({
    label,
    selected = false,
    ...props
  }: PressableProps & {
    selected?: boolean;
    label: string;
  }) => {
    return (
      <Pressable
        className="max-w-[99%] flex-row items-center border-b border-neutral-300 bg-transparent px-3 py-5 dark:border-neutral-700"
        hitSlop={20}
        {...props}
      >
        <Text className="flex-1 dark:text-neutral-100 " numberOfLines={1}>
          {label.trim()}
        </Text>
        {selected && <Check />}
      </Pressable>
    );
  },
);

export interface SelectProps {
  value?: string | number;
  label?: string;
  disabled?: boolean;
  error?: string;
  options?: OptionType[];
  onSelect?: (value: string | number) => void;
  placeholder?: string;
  testID?: string;
  title?: string;
  scrollable?: boolean;
  searchable?: boolean;
  detents?: SheetDetent[];
}
interface ControlledSelectProps<T extends FieldValues> extends SelectProps, InputControllerType<T> {}

export const Select = (props: SelectProps) => {
  const {
    label,
    value,
    error,
    options = [],
    placeholder = "select...",
    disabled = false,
    onSelect,
    testID,
    title,
    scrollable = false,
    searchable = false,
    detents = [1],
  } = props;
  const modal = useBottomSheet();

  const onSelectOption = React.useCallback(
    (option: OptionType) => {
      onSelect?.(option.value);
      modal.dismiss();
    },
    [modal, onSelect],
  );

  const styles = React.useMemo(
    () =>
      selectTv({
        error: Boolean(error),
        disabled,
      }),
    [error, disabled],
  );

  const textValue = React.useMemo(
    () => (value !== undefined ? (options?.filter((t) => t.value === value)?.[0]?.label ?? placeholder) : placeholder),
    [value, options, placeholder],
  );

  return (
    <>
      <View className={styles.container()}>
        {label && (
          <Text testID={testID ? `${testID}-label` : undefined} className={styles.label()}>
            {label}
          </Text>
        )}
        <Pressable className={styles.input()} disabled={disabled} onPress={modal.present} testID={testID ? `${testID}-trigger` : undefined}>
          <View className="flex-1">
            <Text className={styles.inputValue()}>{textValue}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" />
        </Pressable>
        {error && (
          <Text testID={`${testID}-error`} className="text-sm text-danger-300 dark:text-danger-600">
            {error}
          </Text>
        )}
      </View>
      <Options
        testID={testID}
        ref={modal.ref}
        options={options}
        onSelect={onSelectOption}
        title={title}
        scrollable={scrollable}
        searchable={searchable}
        detents={detents}
      />
    </>
  );
};

// only used with react-hook-form
export function ControlledSelect<T extends FieldValues>(props: ControlledSelectProps<T>) {
  const { name, control, rules, onSelect: onNSelect, ...selectProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  const onSelect = React.useCallback(
    (value: string | number) => {
      field.onChange(value);
      onNSelect?.(value);
    },
    [field, onNSelect],
  );
  return <Select onSelect={onSelect} value={field.value} error={fieldState.error?.message} {...selectProps} />;
}

const Check = ({ ...props }: SvgProps) => (
  <Svg width={25} height={24} fill="none" viewBox="0 0 25 24" {...props} className="stroke-black dark:stroke-white">
    <Path d="m20.256 6.75-10.5 10.5L4.506 12" strokeWidth={2.438} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

Options.displayName = "Options";
Option.displayName = "Option";
