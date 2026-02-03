import { MotiView } from "moti";
import React from "react";

import { colors } from "../utilities";
import { IconProps, Label, Root, RootProps, SIZE } from "./toggle-shared";

export const RadioIcon = ({ checked = false }: IconProps) => {
  const color = checked ? colors.primaryColor : colors.charcoal[400];
  return (
    <MotiView
      style={{
        height: SIZE,
        width: SIZE,
        borderColor: color,
      }}
      className="items-center justify-center rounded-[20px] border-2 bg-transparent"
      from={{ borderColor: "#CCCFD6" }}
      animate={{
        borderColor: color,
      }}
      transition={{ borderColor: { duration: 100, type: "timing" } }}
    >
      <MotiView
        className={`size-[10px] rounded-[10px] ${checked && "bg-primaryColor dark:bg-white"} `}
        from={{ opacity: 0 }}
        animate={{ opacity: checked ? 1 : 0 }}
        transition={{ opacity: { duration: 50, type: "timing" } }}
      />
    </MotiView>
  );
};

const RadioRoot = ({ checked = false, children, ...props }: RootProps) => {
  return (
    <Root checked={checked} accessibilityRole="radio" {...props}>
      {children}
    </Root>
  );
};

const RadioBase = ({ checked = false, testID, label, ...props }: RootProps & { label?: string }) => {
  return (
    <RadioRoot checked={checked} testID={testID} {...props}>
      <RadioIcon checked={checked} />
      {label ? <Label text={label} testID={testID ? `${testID}-label` : undefined} /> : null}
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
