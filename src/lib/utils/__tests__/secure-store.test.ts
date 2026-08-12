import type * as SecureStoreModule from '../secure-store';

const createSecureStore = () => {
  const map = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => map.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      map.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      map.delete(key);
    }),
  };
};

type SecureStoreMock = ReturnType<typeof createSecureStore>;

const setup = (options: { platform: 'ios' | 'web' } = { platform: 'ios' }) => {
  jest.resetModules();

  const secureStore = createSecureStore();
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  jest.doMock('react-native', () => ({
    Platform: { OS: options.platform },
  }));
  jest.doMock('expo-secure-store', () => secureStore);

  const module = require('../secure-store') as typeof SecureStoreModule;
  return { module, secureStore, errorSpy } as {
    module: typeof SecureStoreModule;
    secureStore: SecureStoreMock;
    errorSpy: jest.SpyInstance;
  };
};

const localStorageMock = () => {
  const map = new Map<string, string>();
  const localStorage = {
    getItem: jest.fn((key: string) => map.get(key) ?? null),
    setItem: jest.fn((key: string, value: string) => {
      map.set(key, value);
    }),
    removeItem: jest.fn((key: string) => {
      map.delete(key);
    }),
    clear: jest.fn(() => map.clear()),
    key: jest.fn(() => null),
    length: 0,
  };
  return { localStorage, map };
};

describe('secure-store', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    // @ts-expect-error cleaning up the web-only global
    delete global.localStorage;
  });

  describe('native', () => {
    it('sets, gets, and removes values through expo-secure-store', async () => {
      const { module, secureStore } = setup({ platform: 'ios' });

      await module.setSecureItem('token', 'abc');
      expect(secureStore.setItemAsync).toHaveBeenCalledWith('token', 'abc');

      await expect(module.getSecureItem('token')).resolves.toBe('abc');
      expect(secureStore.getItemAsync).toHaveBeenCalledWith('token');

      await module.removeSecureItem('token');
      expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('token');
      await expect(module.getSecureItem('token')).resolves.toBeNull();
    });

    it('rethrows and logs when setting fails', async () => {
      const { module, secureStore, errorSpy } = setup({ platform: 'ios' });
      const error = new Error('keychain unavailable');
      (secureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(error);

      await expect(module.setSecureItem('token', 'abc')).rejects.toThrow(
        'keychain unavailable',
      );
      expect(errorSpy).toHaveBeenCalledWith(
        'Error setting secure item token:',
        error,
      );
    });

    it('returns null and logs when getting fails', async () => {
      const { module, secureStore, errorSpy } = setup({ platform: 'ios' });
      const error = new Error('read failed');
      (secureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(error);

      await expect(module.getSecureItem('token')).resolves.toBeNull();
      expect(errorSpy).toHaveBeenCalledWith(
        'Error getting secure item token:',
        error,
      );
    });

    it('rethrows and logs when removing fails', async () => {
      const { module, secureStore, errorSpy } = setup({ platform: 'ios' });
      const error = new Error('delete failed');
      (secureStore.deleteItemAsync as jest.Mock).mockRejectedValueOnce(error);

      await expect(module.removeSecureItem('token')).rejects.toThrow(
        'delete failed',
      );
      expect(errorSpy).toHaveBeenCalledWith(
        'Error removing secure item token:',
        error,
      );
    });
  });

  describe('web', () => {
    it('sets, gets, and removes values through localStorage', async () => {
      const { localStorage, map } = localStorageMock();
      global.localStorage = localStorage as unknown as Storage;

      const { module } = setup({ platform: 'web' });

      await module.setSecureItem('token', 'abc');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc');
      expect(map.get('token')).toBe('abc');

      await expect(module.getSecureItem('token')).resolves.toBe('abc');
      expect(localStorage.getItem).toHaveBeenCalledWith('token');

      await module.removeSecureItem('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(map.get('token')).toBeUndefined();
    });

    it('is a no-op when localStorage is unavailable', async () => {
      const { module, secureStore } = setup({ platform: 'web' });

      await module.setSecureItem('token', 'abc');
      await expect(module.getSecureItem('token')).resolves.toBeNull();
      await module.removeSecureItem('token');

      expect(secureStore.setItemAsync).not.toHaveBeenCalled();
    });

    it('returns null and logs when localStorage read throws', async () => {
      const { localStorage } = localStorageMock();
      const readError = new Error('storage blocked');
      (localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
        throw readError;
      });
      global.localStorage = localStorage as unknown as Storage;

      const { module, errorSpy } = setup({ platform: 'web' });

      await expect(module.getSecureItem('token')).resolves.toBeNull();
      expect(errorSpy).toHaveBeenCalledWith(
        'Local storage is unavailable:',
        readError,
      );
    });
  });

  it('exposes a zustand-compatible StateStorage adapter', async () => {
    const { module, secureStore } = setup({ platform: 'ios' });

    await module.secureStorage.setItem('k', 'v');
    expect(secureStore.setItemAsync).toHaveBeenCalledWith('k', 'v');

    await expect(module.secureStorage.getItem('k')).resolves.toBe('v');

    await module.secureStorage.removeItem('k');
    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('k');
  });
});
