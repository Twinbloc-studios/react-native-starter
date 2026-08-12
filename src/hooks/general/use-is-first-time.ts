import { useMMKVBoolean } from 'react-native-mmkv';

import { storageInstance } from '@/lib';
import { STORAGE_KEY } from '@/store/auth/utils';

/**
 * Sample usage:
 * const [isFirstTime, setIsFirstTime] = useIsFirstTime();
 * if (isFirstTime) setIsFirstTime(false);
 */
export const useIsFirstTime = () => {
  const [isFirstTime, setIsFirstTime] = useMMKVBoolean(
    STORAGE_KEY.IS_FIRST_TIME,
    storageInstance,
  );
  if (isFirstTime === undefined) {
    return [true, setIsFirstTime] as const;
  }
  return [isFirstTime, setIsFirstTime] as const;
};
