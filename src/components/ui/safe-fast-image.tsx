import { Image as ExpoImage, type ImageProps } from 'expo-image';
import { useState } from 'react';
import { withUniwind } from 'uniwind';

const Image = withUniwind(ExpoImage);

const FALLBACK_IMAGE = require('@/assets/images/icon.png');

export interface SafeFastImageProps extends ImageProps {
  blurhash?: string;
}

export const SafeFastImage = (props: SafeFastImageProps) => {
  const [hasError, setHasError] = useState(false);
  const { source, onError, blurhash, placeholder, transition, ...rest } = props;

  // Resolve placeholder: explicit placeholder > blurhash prop
  const activePlaceholder = placeholder ?? blurhash;
  // Default transition to 500ms if a placeholder is present, otherwise keep user's or default
  const activeTransition = transition ?? (activePlaceholder ? 500 : 0);

  // Check if source is valid
  // FastImage source can be a number (require) or object with uri
  const isValidSource =
    source &&
    (typeof source === 'number' ||
      (typeof source === 'object' && 'uri' in source && !!source.uri));

  if (!isValidSource || hasError) {
    return (
      <Image
        {...rest}
        source={FALLBACK_IMAGE}
        transition={activeTransition}
        // We generally don't want the original image's placeholder when showing the fallback
        placeholder={undefined}
      />
    );
  }

  return (
    <Image
      {...rest}
      source={source}
      placeholder={activePlaceholder}
      transition={activeTransition}
      cachePolicy={'memory-disk'}
      onError={(e) => {
        setHasError(true);
        if (onError) {
          onError(e);
        }
      }}
    />
  );
};
