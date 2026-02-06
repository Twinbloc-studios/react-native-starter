import { Image as IMG, type ImageProps } from "expo-image";
import * as React from "react";
import { withUniwind } from "uniwind";

export type ImgProps = ImageProps & {
  className?: string;
};

const NativeImage = withUniwind(IMG);

export const Image = ({
  style,
  className,
  placeholder = "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
  ...props
}: ImgProps) => {
  return (
    <NativeImage
      className={className}
      placeholder={placeholder}
      style={style}
      {...props}
    />
  );
};

export const preloadImages = (sources: string[]) => {
  void IMG.prefetch(sources);
};
