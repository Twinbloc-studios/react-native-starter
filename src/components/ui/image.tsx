import type { ImageProps } from "expo-image";
import { Image as IMG } from "expo-image";
import { cssInterop } from "nativewind";
import * as React from "react";

export type ImgProps = ImageProps & {
  className?: string;
};

cssInterop(IMG, { className: "style" });

export const Image = ({ style, className, placeholder = "L6PZfSi_.AyE_3t7t7R**0o#DgR4", ...props }: ImgProps) => {
  return <IMG className={className} placeholder={placeholder} style={style} {...props} />;
};

export const preloadImages = (sources: string[]) => {
  IMG.prefetch(sources);
};
