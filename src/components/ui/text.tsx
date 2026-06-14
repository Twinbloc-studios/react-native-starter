import { useMemo } from 'react';
import {
  I18nManager,
  StyleSheet,
  Text as NNText,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { twMerge } from 'tailwind-merge';
import { withUniwind } from 'uniwind';

import { translate, type TxKeyPath } from '@/lib/i18n';
import { useUtility } from '@/store/utility';

interface Props extends TextProps {
  className?: string;
  tx?: TxKeyPath;
  disableSizeScale?: boolean;
}

// Tailwind/Nativewind default font sizes & line heights
const textSizeMapping: Record<
  string,
  { fontSize: number; lineHeight: number }
> = {
  'text-xs': { fontSize: 12, lineHeight: 16 },
  'text-sm': { fontSize: 14, lineHeight: 20 },
  'text-base': { fontSize: 16, lineHeight: 24 },
  'text-lg': { fontSize: 18, lineHeight: 28 },
  'text-xl': { fontSize: 20, lineHeight: 28 },
  'text-2xl': { fontSize: 24, lineHeight: 32 },
  'text-3xl': { fontSize: 30, lineHeight: 36 },
  'text-4xl': { fontSize: 36, lineHeight: 40 },
  'text-5xl': { fontSize: 48, lineHeight: 48 },
  'text-6xl': { fontSize: 60, lineHeight: 60 },
  'text-7xl': { fontSize: 72, lineHeight: 72 },
  'text-8xl': { fontSize: 96, lineHeight: 96 },
  'text-9xl': { fontSize: 128, lineHeight: 128 },
};

const relativeLineHeightMapping: Record<string, number> = {
  'leading-none': 1,
  'leading-tight': 1.25,
  'leading-snug': 1.375,
  'leading-normal': 1.5,
  'leading-relaxed': 1.625,
  'leading-loose': 2,
};

export const Text = ({
  className = '',
  style,
  tx,
  children,
  disableSizeScale = false,
  ...props
}: Props) => {
  const { sizeScale } = useUtility();
  const fontClass =
    className.split(' ').find((cls) => fontFamilyMapping[cls]) ??
    'font-regular';

  const textStyle = useMemo(
    () =>
      twMerge(
        'font-regular text-black dark:text-white text-base',
        className,
        fontClass ? `font-[${fontFamilyMapping[fontClass]}]` : 'font-regular',
      ),
    [className, fontClass],
  );

  const {
    fontSize: baseFontSizeFromClass,
    lineHeight: baseLineHeightFromClass,
  } = useMemo(() => {
    const classes = textStyle.split(' ');
    // Find the last text size class (NativeWind/Tailwind precedence)
    const sizeClass =
      classes.reverse().find((cls) => textSizeMapping[cls]) ?? 'text-base';
    const sizeData = textSizeMapping[sizeClass] ?? textSizeMapping['text-base'];

    let lineHeight = sizeData.lineHeight;
    const leadingClass = classes.find((cls) => cls.startsWith('leading-'));

    if (leadingClass) {
      if (relativeLineHeightMapping[leadingClass]) {
        lineHeight =
          sizeData.fontSize * relativeLineHeightMapping[leadingClass];
      } else {
        const match = leadingClass.match(/^leading-(\d+)$/);
        if (match) {
          lineHeight = parseInt(match[1], 10) * 4;
        }
      }
    }

    return { fontSize: sizeData.fontSize, lineHeight };
  }, [textStyle]);

  const nStyle = useMemo(() => {
    const baseStyle = StyleSheet.flatten([
      {
        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
        fontFamily: fontFamilyMapping[fontClass] || 'Inter_400Regular',
      },
      style,
    ]) as TextStyle;

    // If size scale is disabled, return base style without scaling
    if (disableSizeScale) {
      return baseStyle;
    }

    // Get fontSize from style prop if present, otherwise use className-based fontSize
    const baseFontSize = baseStyle?.fontSize ?? baseFontSizeFromClass;
    const baseLineHeight = baseStyle?.lineHeight ?? baseLineHeightFromClass;

    const scaledFontSize =
      baseFontSize && sizeScale ? baseFontSize * sizeScale : undefined;
    const scaledLineHeight =
      baseLineHeight && sizeScale ? baseLineHeight * sizeScale : undefined;

    return {
      ...baseStyle,
      ...(scaledFontSize ? { fontSize: scaledFontSize } : {}),
      ...(scaledLineHeight ? { lineHeight: scaledLineHeight } : {}),
    } as TextStyle;
  }, [
    style,
    fontClass,
    sizeScale,
    baseFontSizeFromClass,
    baseLineHeightFromClass,
    disableSizeScale,
  ]);

  return (
    <NativeText
      allowFontScaling={false}
      className={textStyle}
      style={nStyle}
      {...props}
    >
      {tx ? translate(tx) : children}
    </NativeText>
  );
};

const fontFamilyMapping: Record<string, string> = {
  'font-regular': 'Inter_400Regular',
  'font-medium': 'Inter_500Medium',
  'font-semibold': 'Inter_600SemiBold',
  'font-bold': 'Inter_700Bold',
};

const NativeText = withUniwind(NNText);
