import type { resources } from './resources';

// react-i18next versions higher than 11.11.0

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['en'];
  }
}

declare module 'react-native/Libraries/Image/AssetSourceResolver';
declare module '@react-native/assets-registry/registry';
