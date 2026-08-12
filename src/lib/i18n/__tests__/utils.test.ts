import { renderHook } from '@testing-library/react-native';

import type * as I18nUtilsType from '../utils';

type SetupOptions = {
  platform: 'ios' | 'android' | 'web';
  appOwnership: 'expo' | 'standalone';
  dev: boolean;
  dirReturn: 'rtl' | 'ltr';
  mmkvTuple?: [string | undefined, (value: string | undefined) => void];
};

const setup = (options: SetupOptions) => {
  jest.resetModules();
  (global as typeof globalThis & { __DEV__?: boolean }).__DEV__ = options.dev;

  const storageInstance = { set: jest.fn(), getString: jest.fn() };
  const mockChangeLanguage = jest.fn();
  const mockDir = jest.fn(() => options.dirReturn);
  const mockT = jest.fn((key: string) => `t:${key}`);
  const mockAllowRTL = jest.fn();
  const mockForceRTL = jest.fn();
  const mockReload = jest.fn();
  const mockRestart = jest.fn();
  const mockUseMMKVString = jest.fn(
    () => options.mmkvTuple ?? [undefined, jest.fn()],
  );

  jest.doMock('i18next', () => ({
    changeLanguage: mockChangeLanguage,
    dir: mockDir,
    t: mockT,
  }));
  jest.doMock('react-native', () => ({
    I18nManager: { allowRTL: mockAllowRTL, forceRTL: mockForceRTL },
    NativeModules: { DevSettings: { reload: mockReload } },
    Platform: { OS: options.platform },
  }));
  jest.doMock('react-native-restart', () => ({
    __esModule: true,
    default: { restart: mockRestart },
  }));
  jest.doMock('expo-constants', () => ({
    appOwnership: options.appOwnership,
  }));
  jest.doMock('react-native-mmkv', () => ({
    useMMKVString: mockUseMMKVString,
  }));
  jest.doMock('@/store/auth/utils', () => ({
    STORAGE_KEY: {
      LOCAL: 'LOCAL',
    },
  }));
  jest.doMock('../../utils/storage', () => ({
    storageInstance,
  }));

  const module = require('../utils') as typeof I18nUtilsType;
  return {
    module,
    storageInstance,
    mockChangeLanguage,
    mockAllowRTL,
    mockForceRTL,
    mockReload,
    mockRestart,
    mockT,
    mockUseMMKVString,
  };
};

const baseOptions: SetupOptions = {
  platform: 'ios',
  appOwnership: 'standalone',
  dev: false,
  dirReturn: 'ltr',
};

describe('i18n utils', () => {
  describe('changeLanguage', () => {
    it('stores language and reloads in dev native', () => {
      const {
        module,
        storageInstance,
        mockChangeLanguage,
        mockAllowRTL,
        mockForceRTL,
        mockReload,
        mockRestart,
      } = setup({
        ...baseOptions,
        platform: 'ios',
        appOwnership: 'expo',
        dev: true,
        dirReturn: 'rtl',
      });

      module.changeLanguage('ar');

      expect(storageInstance.set).toHaveBeenCalledWith(module.LOCAL, 'ar');
      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
      expect(mockAllowRTL).toHaveBeenCalledWith(true);
      expect(mockForceRTL).toHaveBeenCalledWith(true);
      expect(mockReload).toHaveBeenCalled();
      expect(mockRestart).not.toHaveBeenCalled();
    });

    it('restarts in native production when not Expo Go', () => {
      const { module, mockReload, mockRestart } = setup({
        ...baseOptions,
        platform: 'android',
        appOwnership: 'standalone',
        dev: false,
        dirReturn: 'ltr',
      });

      module.changeLanguage('en');

      expect(mockRestart).toHaveBeenCalled();
      expect(mockReload).not.toHaveBeenCalled();
    });

    it('falls back to a DevSettings reload when restart throws', () => {
      const { module, mockReload, mockRestart } = setup({
        ...baseOptions,
        platform: 'android',
        appOwnership: 'standalone',
        dev: false,
        dirReturn: 'ltr',
      });
      mockRestart.mockImplementation(() => {
        throw new Error('restart failed');
      });

      module.changeLanguage('en');

      expect(mockRestart).toHaveBeenCalled();
      expect(mockReload).toHaveBeenCalled();
    });

    it('skips restart in Expo Go production', () => {
      const { module, mockRestart } = setup({
        ...baseOptions,
        platform: 'android',
        appOwnership: 'expo',
        dev: false,
        dirReturn: 'ltr',
      });

      module.changeLanguage('en');

      expect(mockRestart).not.toHaveBeenCalled();
    });

    it('reloads on web', () => {
      const reload = jest.fn();
      global.window = { location: { reload } } as unknown as Window &
        typeof globalThis;

      const { module } = setup({
        ...baseOptions,
        platform: 'web',
        appOwnership: 'expo',
        dev: false,
        dirReturn: 'ltr',
      });

      module.changeLanguage('en');

      expect(reload).toHaveBeenCalled();
    });
  });

  describe('translate', () => {
    it('forwards the key to i18next t', () => {
      const { module, mockT } = setup(baseOptions);

      expect(module.translate('common.appName')).toBe('t:common.appName');
      expect(mockT).toHaveBeenCalledWith('common.appName', undefined);
    });

    it('passes options through and includes them in the memo key', () => {
      const { module, mockT } = setup(baseOptions);

      module.translate('counter.reset', { count: 3 });
      module.translate('counter.reset', { count: 3 });
      module.translate('counter.reset', { count: 5 });

      // Different option shapes are cached separately.
      expect(mockT).toHaveBeenCalledTimes(2);
      expect(mockT).toHaveBeenCalledWith('counter.reset', { count: 3 });
      expect(mockT).toHaveBeenCalledWith('counter.reset', { count: 5 });
    });
  });

  describe('useSelectedLanguage', () => {
    it('returns the stored language', () => {
      const { module, mockUseMMKVString } = setup({
        ...baseOptions,
        mmkvTuple: ['fr', jest.fn()],
      });

      const { result } = renderHook(() => module.useSelectedLanguage());

      expect(result.current.language).toBe('fr');
      expect(mockUseMMKVString).toHaveBeenCalledWith(
        module.LOCAL,
        expect.anything(),
      );
    });

    it('updates the stored value and changes the language', () => {
      const setLang = jest.fn();
      const { module, mockChangeLanguage } = setup({
        ...baseOptions,
        mmkvTuple: ['fr', setLang],
      });

      const { result } = renderHook(() => module.useSelectedLanguage());
      result.current.setLanguage('ar');

      expect(setLang).toHaveBeenCalledWith('ar');
      expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    });

    it('ignores undefined when setting the language', () => {
      const setLang = jest.fn();
      const { module, mockChangeLanguage } = setup({
        ...baseOptions,
        mmkvTuple: ['fr', setLang],
      });

      const { result } = renderHook(() => module.useSelectedLanguage());
      result.current.setLanguage(undefined as never);

      expect(setLang).toHaveBeenCalledWith(undefined);
      expect(mockChangeLanguage).not.toHaveBeenCalled();
    });
  });
});
