import { Env } from '@env';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import { type StateStorage } from 'zustand/middleware';

import { type STORAGE_KEY } from '@/store/auth/utils';

const STORAGE_ID = 'app-secure-storage';
const ENCRYPTION_KEY_ALIAS = 'mmkv-encryption-key';

let storagePromise: Promise<ReturnType<typeof createMMKV>> | null = null;
export let storageInstance!: ReturnType<typeof createMMKV>;

export function getStorageInstance() {
  if (!storageInstance) {
    throw new Error(
      'Storage instance is not initialized. Call getStorage() first.',
    );
  }
  return storageInstance;
}

async function initStorage() {
  const encryptionKey = await getEncryptionKeyAsync();
  const instance = createMMKV({
    id: STORAGE_ID,
    encryptionKey,
  });
  storageInstance = instance;
  const size = instance.size;
  if (size >= 4096) {
    instance.trim();
  }
  return instance;
}

async function getEncryptionKeyAsync() {
  if (Platform.OS === 'web') {
    return undefined;
  }

  try {
    const existingKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_ALIAS);
    if (existingKey) {
      return existingKey;
    }

    const newKey = Crypto.randomUUID();
    await SecureStore.setItemAsync(ENCRYPTION_KEY_ALIAS, newKey);
    return newKey;
  } catch (error) {
    console.error('Failed to initialize secure storage encryption:', error);

    try {
      const newKey = Crypto.randomUUID();
      await SecureStore.setItemAsync(ENCRYPTION_KEY_ALIAS, newKey);
      return newKey;
    } catch (retryError) {
      console.error('Secure storage recovery failed:', retryError);
      if (Env.APP_ENV === 'production') {
        throw new Error(
          'CRITICAL: Secure storage initialization failed. App cannot proceed securely.',
        );
      }
      return undefined;
    }
  }
}

export async function getStorage() {
  if (!storagePromise) {
    storagePromise = initStorage();
  }
  return storagePromise;
}

export async function getItem<T>(key: STORAGE_KEY): Promise<T | null> {
  const storage = await getStorage();
  const value = storage.getString(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) ?? null;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: STORAGE_KEY, value: T) {
  const storage = await getStorage();
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: STORAGE_KEY) {
  const storage = await getStorage();
  storage.remove(key);
}

export async function clearStorage(key?: STORAGE_KEY) {
  if (key) {
    await removeItem(key);
    return;
  }
  const storage = await getStorage();
  storage.clearAll();
}

export const mmkvStorage: StateStorage<Promise<void>> = {
  getItem: async (key) => {
    const storage = await getStorage();
    return storage.getString(key) ?? null;
  },
  setItem: async (key, value) => {
    const storage = await getStorage();
    storage.set(key, value);
  },
  removeItem: async (key) => {
    const storage = await getStorage();
    storage.remove(key);
  },
};
