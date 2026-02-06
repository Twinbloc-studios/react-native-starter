import { type ImageSource } from "expo-image";
import * as React from "react";
import { withUniwind } from "uniwind";

import { SafeFastImage } from "./safe-fast-image";

type Props = {
  icon: ImageSource;
  size?: number;
  color?: string | "original";
} & React.ComponentProps<typeof SafeFastImage>;

/**
 * Sample usage:
 *
 * <Icon icon={require("@/assets/icon.png")} size={32} className="text-white" />
 * <Icon icon={require("@/assets/logo.svg")} size={32} />
 */
const IconBase = ({
  icon,
  size = 24,
  color = "white",
  style,
  ...rest
}: Props) => {
  return (
    <SafeFastImage
      source={icon}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
      tintColor={color === "original" ? undefined : color}
      {...rest}
    />
  );
};

export const Icon = withUniwind(IconBase);
