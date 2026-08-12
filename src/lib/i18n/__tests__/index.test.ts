import type * as I18nIndexType from '../index';

type SetupOptions = {
  storedLanguage?: string;
  locale?: string;
  initialized: boolean;
  dirReturn: 'rtl' | 'ltr';
};

const setup = (options: SetupOptions) => {
  jest.resetModules();

  const mockGetStorage = jest.fn().mockResolvedValue(undefined);
  const storageInstance = { getString: jest.fn(() => options.storedLanguage) };
  const mockAllowRTL = jest.fn();
  const mockForceRTL = jest.fn();
  const mockInit = jest.fn().mockResolvedValue(undefined);
  const mockChangeLanguage = jest.fn().mockResolvedValue(undefined);

  const i18n = {
    isInitialized: options.initialized,
    use: jest.fn(),
    init: mockInit,
    changeLanguage: mockChangeLanguage,
  };

  i18n.use.mockImplementation(() => i18n);

  jest.doMock('i18next', () => ({
    __esModule: true,
    default: i18n,
    dir: jest.fn(() => options.dirReturn),
  }));
  jest.doMock('react-i18next', () => ({
    initReactI18next: {},
  }));
  jest.doMock('expo-localization', () => ({
    getLocales: jest.fn(() => [{ languageCode: options.locale ?? 'en' }]),
  }));
  jest.doMock('react-native', () => ({
    I18nManager: { allowRTL: mockAllowRTL, forceRTL: mockForceRTL },
  }));
  jest.doMock('react-native-mmkv', () => ({
    useMMKVString: jest.fn(() => [undefined, jest.fn()]),
  }));
  jest.doMock('react-native-restart', () => ({
    __esModule: true,
    default: { restart: jest.fn() },
  }));
  jest.doMock('expo-constants', () => ({
    appOwnership: 'expo',
  }));
  jest.doMock('@/store/auth/utils', () => ({
    STORAGE_KEY: {
      LOCAL: 'LOCAL',
    },
  }));
  jest.doMock('../../utils/storage', () => ({
    getStorage: mockGetStorage,
    storageInstance,
  }));
  jest.doMock('../resources', () => ({
    resources: {
      en: { translation: {} },
      es: { translation: {} },
    },
  }));

  const module = require('../index') as typeof I18nIndexType;
  return {
    module,
    mockInit,
    mockChangeLanguage,
    mockAllowRTL,
    mockForceRTL,
    mockGetStorage,
  };
};

describe('i18n init', () => {
  it('initializes with stored language', async () => {
    const {
      module,
      mockInit,
      mockChangeLanguage,
      mockAllowRTL,
      mockForceRTL,
      mockGetStorage,
    } = setup({
      storedLanguage: 'es',
      locale: 'fr',
      initialized: false,
      dirReturn: 'ltr',
    });

    await module.initI18n();

    expect(mockGetStorage).toHaveBeenCalled();
    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: 'es',
        fallbackLng: 'en',
        supportedLngs: ['en', 'es'],
      }),
    );
    expect(mockChangeLanguage).not.toHaveBeenCalled();
    expect(mockAllowRTL).toHaveBeenCalledWith(false);
    expect(mockForceRTL).toHaveBeenCalledWith(false);
  });

  it('changes language when already initialized', async () => {
    const { module, mockInit, mockChangeLanguage } = setup({
      storedLanguage: undefined,
      locale: 'fr',
      initialized: true,
      dirReturn: 'rtl',
    });

    await module.initI18n();

    expect(mockInit).not.toHaveBeenCalled();
    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
  });
});
