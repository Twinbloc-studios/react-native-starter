import { MotiView } from "moti";
import React from "react";
import Svg, { Path } from "react-native-svg";

import { colors } from "../utilities";
import { IconProps, Label, Root, RootProps, SIZE } from "./toggle-shared";

export const CheckboxIcon = ({ checked = false }: IconProps) => {
  const color = checked ? colors.primaryColor : colors.charcoal[400];
  return (
    <MotiView
      style={{
        height: SIZE,
        width: SIZE,
        borderColor: color,
      }}
      className="items-center justify-center rounded-[5px] border-2"
      from={{ backgroundColor: "transparent", borderColor: "#CCCFD6" }}
      animate={{
        backgroundColor: checked ? color : "transparent",
        borderColor: color,
      }}
      transition={{
        backgroundColor: { type: "timing", duration: 100 },
        borderColor: { type: "timing", duration: 100 },
      }}
    >
      <MotiView from={{ opacity: 0 }} animate={{ opacity: checked ? 1 : 0 }} transition={{ opacity: { type: "timing", duration: 100 } }}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="m16.726 7-.64.633c-2.207 2.212-3.878 4.047-5.955 6.158l-2.28-1.928-.69-.584L6 12.66l.683.577 2.928 2.477.633.535.591-.584c2.421-2.426 4.148-4.367 6.532-6.756l.633-.64L16.726 7Z"
            fill={checked ? colors.primaryColor : "transparent"}
          />
        </Svg>
      </MotiView>
    </MotiView>
  );
};

const CheckboxRoot = ({ checked = false, children, ...props }: RootProps) => {
  return (
    <Root checked={checked} accessibilityRole="checkbox" {...props}>
      {children}
    </Root>
  );
};

const CheckboxBase = ({ checked = false, testID, label, ...props }: RootProps & { label?: string }) => {
  return (
    <CheckboxRoot checked={checked} testID={testID} {...props}>
      <CheckboxIcon checked={checked} />
      {label ? <Label text={label} testID={testID ? `${testID}-label` : undefined} className="pr-2" /> : null}
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
