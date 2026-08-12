import { STORAGE_KEY } from '@/store/auth/utils';

import type * as StorageModule from '../storage';

type MmkvInstance = {
  getString: jest.Mock;
  set: jest.Mock;
  remove: jest.Mock;
  clearAll: jest.Mock;
  trim: jest.Mock;
  size: number;
};

const createMmkv = (size = 0) => {
  const map = new Map<string, string>();
  return {
    getString: jest.fn((key: string) => map.get(key) ?? null),
    set: jest.fn((key: string, value: string) => {
      map.set(key, value);
    }),
    remove: jest.fn((key: string) => {
      map.delete(key);
    }),
    clearAll: jest.fn(() => map.clear()),
    trim: jest.fn(),
    size,
  } satisfies MmkvInstance;
};

type SetupOptions = {
  platform?: 'ios' | 'web';
  appEnv?: 'development' | 'production';
  secureStoreGet?: (key: string) => Promise<string | null>;
  secureStoreSet?: (key: string, value: string) => Promise<void>;
  mmkvSize?: number;
};

const setup = (options: SetupOptions = {}) => {
  jest.resetModules();

  const {
    platform = 'ios',
    appEnv = 'development',
    secureStoreGet = jest.fn(async () => null),
    secureStoreSet = jest.fn(async () => undefined),
    mmkvSize = 0,
  } = options;

  const instance = createMmkv(mmkvSize);
  const createMMKV = jest.fn(() => instance);
  const randomUUID = jest.fn(() => 'uuid-1');
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  jest.doMock('@env', () => ({ Env: { APP_ENV: appEnv } }));
  jest.doMock('expo-crypto', () => ({ randomUUID }));
  jest.doMock('expo-secure-store', () => ({
    getItemAsync: secureStoreGet,
    setItemAsync: secureStoreSet,
  }));
  jest.doMock('react-native', () => ({ Platform: { OS: platform } }));
  jest.doMock('react-native-mmkv', () => ({ createMMKV }));

  const module = require('../storage') as typeof StorageModule;
  return { module, instance, createMMKV, randomUUID, errorSpy };
};

describe('storage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('creates a single mmkv instance and caches the promise', async () => {
      const { module, instance, createMMKV } = setup();

      const first = module.getStorage();
      const second = module.getStorage();
      await Promise.all([first, second]);

      // Both callers share one initialization and one instance.
      expect(createMMKV).toHaveBeenCalledTimes(1);
      expect(module.getStorageInstance()).toBe(instance);
    });

    it('throws from getStorageInstance before initialization', () => {
      const { module } = setup();

      expect(() => module.getStorageInstance()).toThrow(
        'Storage instance is not initialized',
      );
    });

    it('returns the instance from getStorageInstance after init', async () => {
      const { module, instance } = setup();

      await module.getStorage();

      expect(module.getStorageInstance()).toBe(instance);
    });

    it('trims the instance when its size exceeds the threshold', async () => {
      const { module, instance } = setup({ mmkvSize: 5000 });

      await module.getStorage();

      expect(instance.trim).toHaveBeenCalledTimes(1);
    });

    it('does not trim a small instance', async () => {
      const { module, instance } = setup({ mmkvSize: 128 });

      await module.getStorage();

      expect(instance.trim).not.toHaveBeenCalled();
    });
  });

  describe('encryption key', () => {
    it('reuses an existing encryption key', async () => {
      const secureStoreGet = jest.fn(async () => 'existing-key');
      const secureStoreSet = jest.fn(async () => undefined);
      const { module, createMMKV, randomUUID } = setup({
        secureStoreGet,
        secureStoreSet,
      });

      await module.getStorage();

      expect(createMMKV).toHaveBeenCalledWith({
        id: 'app-secure-storage',
        encryptionKey: 'existing-key',
      });
      expect(randomUUID).not.toHaveBeenCalled();
      expect(secureStoreSet).not.toHaveBeenCalled();
    });

    it('generates and persists a key when none exists', async () => {
      const secureStoreGet = jest.fn(async () => null);
      const secureStoreSet = jest.fn(async () => undefined);
      const { module, createMMKV } = setup({
        secureStoreGet,
        secureStoreSet,
      });

      await module.getStorage();

      expect(secureStoreSet).toHaveBeenCalledWith(
        'mmkv-encryption-key',
        'uuid-1',
      );
      expect(createMMKV).toHaveBeenCalledWith({
        id: 'app-secure-storage',
        encryptionKey: 'uuid-1',
      });
    });

    it('retries key generation when the first read fails', async () => {
      const secureStoreGet = jest
        .fn()
        .mockRejectedValueOnce(new Error('read failed'))
        .mockResolvedValueOnce(null);
      const secureStoreSet = jest.fn(async () => undefined);
      const { module } = setup({ secureStoreGet, secureStoreSet });

      await module.getStorage();

      expect(secureStoreSet).toHaveBeenCalledWith(
        'mmkv-encryption-key',
        'uuid-1',
      );
    });

    it('throws a critical error in production when recovery fails', async () => {
      const failingStore = {
        getItemAsync: jest.fn(async () => {
          throw new Error('keychain broken');
        }),
        setItemAsync: jest.fn(async () => {
          throw new Error('keychain broken');
        }),
      };
      const { module, errorSpy } = setup({
        appEnv: 'production',
        secureStoreGet: failingStore.getItemAsync,
        secureStoreSet: failingStore.setItemAsync,
      });

      await expect(module.getStorage()).rejects.toThrow(
        'CRITICAL: Secure storage initialization failed',
      );
      expect(errorSpy).toHaveBeenCalledWith(
        'Secure storage recovery failed:',
        expect.any(Error),
      );
    });

    it('falls back to an unencrypted instance in development when recovery fails', async () => {
      const failingStore = {
        getItemAsync: jest.fn(async () => {
          throw new Error('keychain broken');
        }),
        setItemAsync: jest.fn(async () => {
          throw new Error('keychain broken');
        }),
      };
      const { module, createMMKV } = setup({
        appEnv: 'development',
        secureStoreGet: failingStore.getItemAsync,
        secureStoreSet: failingStore.setItemAsync,
      });

      await module.getStorage();

      expect(createMMKV).toHaveBeenCalledWith({
        id: 'app-secure-storage',
        encryptionKey: undefined,
      });
    });

    it('skips encryption on web', async () => {
      const secureStoreGet = jest.fn(async () => 'key');
      const { module, createMMKV, randomUUID } = setup({
        platform: 'web',
        secureStoreGet,
      });

      await module.getStorage();

      expect(randomUUID).not.toHaveBeenCalled();
      expect(createMMKV).toHaveBeenCalledWith({
        id: 'app-secure-storage',
        encryptionKey: undefined,
      });
    });
  });

  describe('item CRUD', () => {
    it('reads, writes, and removes serialized values', async () => {
      const { module, instance } = setup();
      instance.getString.mockReturnValue(JSON.stringify({ id: 1 }));

      await expect(module.getItem(STORAGE_KEY.TOKEN)).resolves.toEqual({
        id: 1,
      });

      await module.setItem(STORAGE_KEY.TOKEN, { id: 2 });
      expect(instance.set).toHaveBeenCalledWith(
        STORAGE_KEY.TOKEN,
        JSON.stringify({ id: 2 }),
      );

      await module.removeItem(STORAGE_KEY.TOKEN);
      expect(instance.remove).toHaveBeenCalledWith(STORAGE_KEY.TOKEN);
    });

    it('returns null when nothing is stored or the value is not JSON', async () => {
      const { module, instance } = setup();
      instance.getString.mockReturnValueOnce(null);

      await expect(module.getItem(STORAGE_KEY.TOKEN)).resolves.toBeNull();

      instance.getString.mockReturnValueOnce('{not json');
      await expect(module.getItem(STORAGE_KEY.TOKEN)).resolves.toBeNull();
    });

    it('clears a single key with clearStorage(key)', async () => {
      const { module, instance } = setup();

      await module.clearStorage(STORAGE_KEY.TOKEN);

      expect(instance.remove).toHaveBeenCalledWith(STORAGE_KEY.TOKEN);
      expect(instance.clearAll).not.toHaveBeenCalled();
    });

    it('clears everything with clearStorage()', async () => {
      const { module, instance } = setup();

      await module.clearStorage();

      expect(instance.clearAll).toHaveBeenCalledTimes(1);
      expect(instance.remove).not.toHaveBeenCalled();
    });
  });

  describe('mmkv adapter', () => {
    it('delegates get, set, and remove to the storage instance', async () => {
      const { module, instance } = setup();
      instance.getString.mockReturnValueOnce('stored');

      await expect(module.mmkvStorage.getItem('k')).resolves.toBe('stored');

      await module.mmkvStorage.setItem('k', 'v');
      expect(instance.set).toHaveBeenCalledWith('k', 'v');

      await module.mmkvStorage.removeItem('k');
      expect(instance.remove).toHaveBeenCalledWith('k');
    });
  });
});
