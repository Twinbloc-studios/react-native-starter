import React, { useCallback } from "react";
import { Pressable, type PressableProps } from "react-native";

import { Text } from "./text";

export const SIZE = 20;

export interface RootProps extends Omit<PressableProps, "onPress"> {
  onChange: (checked: boolean) => void;
  checked?: boolean;
  className?: string;
  accessibilityLabel: string;
}

export type IconProps = {
  checked: boolean;
};

export const Root = ({ checked = false, children, onChange, disabled, className = "", ...props }: RootProps) => {
  const handleChange = useCallback(() => {
    onChange(!checked);
  }, [onChange, checked]);

  return (
    <Pressable
      onPress={handleChange}
      className={`flex-row items-center ${className} ${disabled ? "opacity-50" : ""}`}
      accessibilityState={{ checked }}
      disabled={disabled}
      {...props}
    >
      {children}
    </Pressable>
  );
};

export type LabelProps = {
  text: string;
  className?: string;
  testID?: string;
};

export const Label = ({ text, testID, className = "" }: LabelProps) => {
  return (
    <Text testID={testID} className={` ${className} pl-0`}>
      {text}
    </Text>
  );
};
