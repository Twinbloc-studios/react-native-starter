import * as React from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useController,
} from "react-hook-form";
import {
  TextInput as NTextInput,
  type TextInputProps,
  View as RNView,
} from "react-native";
import { tv } from "tailwind-variants";
import { withUniwind } from "uniwind";

import { colors } from "../utilities";
import { Text } from "./text";

const View = withUniwind(RNView);
const TextInput = withUniwind(NTextInput);

const inputTv = tv({
  slots: {
    container: "mb-2",
    label: "text-grey-100 mb-1 text-lg dark:text-neutral-100",
    input:
      "mt-0 rounded-xl border-[0.5px] border-neutral-300 bg-neutral-100 px-4 py-3 text-base font-[Inter_500Medium] leading-5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white",
  },

  variants: {
    focused: {
      true: {
        input: "border-neutral-400 dark:border-neutral-300",
      },
    },
    error: {
      true: {
        input: "border-danger-600",

        label: "text-danger-600 dark:text-danger-600",
      },
    },
    disabled: {
      true: {
        input: "bg-neutral-200",
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
    >
  | undefined;

export type RuleType<T extends FieldValues> = { [name in keyof T]: TRule<T> };
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps, InputControllerType<T> {}

export const Input = React.forwardRef<NTextInput, NInputProps>((props, ref) => {
  const { label, error, testID, rightIcon, leftIcon, ...inputProps } = props;
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const styles = React.useMemo(
    () =>
      inputTv({
        error: Boolean(error),
        focused: isFocussed,
        disabled: Boolean(props.disabled),
      }),
    [error, isFocussed, props.disabled],
  );

  return (
    <View className={styles.container()}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label()}
        >
          {label}
        </Text>
      )}
      <View className={styles.input()}>
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          testID={testID}
          ref={ref}
          placeholderTextColor={
            props.placeholderTextColor ?? colors.neutral[400]
          }
          className={`flex-1 ${props.editable === false ? "text-neutral-500" : "text-neutral-900"} dark:text-white`}
          onBlur={onBlur}
          onFocus={onFocus}
          {...inputProps}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="text-sm text-danger-600 dark:text-danger-600"
        >
          {error}
        </Text>
      )}
    </View>
  );
});
Input.displayName = "Input";

// only used with react-hook-form
export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>,
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ""}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
