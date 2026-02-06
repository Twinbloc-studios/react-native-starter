import { Image as ExpoImage, type ImageSource } from "expo-image";
import React from "react";
import {
  type ImageStyle,
  type StyleProp,
  View as RNView,
  type ViewProps,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { withUniwind } from "uniwind";

import { SafeFastImage, type SafeFastImageProps } from "./safe-fast-image";
import { Text } from "./text";

const View = withUniwind(RNView);

const FALLBACK_IMAGE = require("@/assets/images/icon.png");

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  "2xl": 80,
};

const textSizeMap: Record<AvatarSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const getInitials = (label: string) => {
  const trimmed = label.trim();
  if (!trimmed) {
    return "";
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

/**
 * Avatar Component
 *
 * @example
 * ```tsx
 * <Avatar source={{ uri: "https://example.com/user.png" }} size="lg" />
 * <Avatar label="Jane Doe" className="bg-neutral-700" />
 * <Avatar size={48} fallback={<MaterialIcons name="person" size={22} color="white" />} />
 * ```
 */
export interface AvatarProps extends ViewProps {
  source?: ImageSource;
  size?: AvatarSize | number;
  shape?: "circle" | "rounded" | "square";
  radius?: number;
  label?: string;
  fallback?: React.ReactNode;
  className?: string;
  imageProps?: Omit<SafeFastImageProps, "source" | "style" | "onError"> & {
    onError?: SafeFastImageProps["onError"];
  };
  imageStyle?: StyleProp<ImageStyle>;
  textClassName?: string;
}

export const Avatar = React.forwardRef<RNView, AvatarProps>(
  (
    {
      source,
      size = "md",
      shape = "circle",
      radius,
      label,
      fallback,
      className,
      style,
      imageProps,
      imageStyle,
      textClassName,
      children,
      ...rest
    },
    ref,
  ) => {
    const [hasError, setHasError] = React.useState(false);
    const resolvedSize = typeof size === "number" ? size : sizeMap[size];
    const resolvedRadius =
      radius ??
      (shape === "square"
        ? 0
        : shape === "rounded"
          ? Math.round(resolvedSize * 0.2)
          : Math.round(resolvedSize / 2));

    const containerStyle = React.useMemo(
      () => [
        {
          width: resolvedSize,
          height: resolvedSize,
          borderRadius: resolvedRadius,
        },
        style,
      ],
      [resolvedSize, resolvedRadius, style],
    );
    const baseImageStyle = React.useMemo(
      () => [
        {
          width: resolvedSize,
          height: resolvedSize,
          borderRadius: resolvedRadius,
        },
        imageStyle,
      ],
      [resolvedSize, resolvedRadius, imageStyle],
    );
    const resolvedLabel = label?.trim();

    const onImageError = imageProps?.onError;
    const handleError = React.useCallback(
      (event: Parameters<NonNullable<SafeFastImageProps["onError"]>>[0]) => {
        setHasError(true);
        if (onImageError) {
          onImageError(event);
        }
      },
      [onImageError],
    );

    React.useEffect(() => {
      setHasError(false);
    }, [source]);

    const content = React.useMemo(() => {
      if (source && !hasError) {
        return (
          <SafeFastImage
            source={source}
            style={baseImageStyle}
            onError={handleError}
            {...imageProps}
          />
        );
      }

      if (fallback) {
        return fallback;
      }

      if (resolvedLabel) {
        const initials = getInitials(resolvedLabel);
        const textSizeClass = typeof size === "number" ? "" : textSizeMap[size];
        const textStyle =
          typeof size === "number"
            ? { fontSize: Math.round(resolvedSize * 0.4) }
            : undefined;
        return (
          <Text
            className={twMerge(
              "text-white font-semibold",
              textSizeClass,
              textClassName,
            )}
            style={textStyle}
            numberOfLines={1}
          >
            {initials}
          </Text>
        );
      }

      return <ExpoImage source={FALLBACK_IMAGE} style={baseImageStyle} />;
    }, [
      source,
      hasError,
      baseImageStyle,
      handleError,
      imageProps,
      fallback,
      resolvedLabel,
      size,
      resolvedSize,
      textClassName,
    ]);

    return (
      <View
        ref={ref}
        className={twMerge(
          "items-center justify-center overflow-hidden bg-neutral-400 dark:bg-neutral-700",
          className,
        )}
        style={containerStyle}
        {...rest}
      >
        {content}
        {children}
      </View>
    );
  },
);

Avatar.displayName = "Avatar";
