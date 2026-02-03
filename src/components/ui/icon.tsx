import { type ImageSource } from "expo-image";
import { cssInterop } from "nativewind";
import * as React from "react";
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
export const Icon = ({ icon, size = 24, color = "white", style, ...rest }: Props) => {
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

cssInterop(Icon, { className: "style" });
