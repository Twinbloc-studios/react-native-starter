import * as Font from 'expo-font';

import { hydrateAuth } from '@/store/auth';

import { initApp } from '../app-initializer';
import { initI18n } from '../i18n';
import { getStorage } from '../utils/storage';

// Mock factories define their own jest.fn()s — referencing top-level consts
// would hit the TDZ, since the mocked modules are first required during the
// hoisted import phase. Import the mocked modules to get handles on the fns.
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
}));

jest.mock('@expo-google-fonts/inter', () => ({
  Inter_400Regular: 'font-400',
  Inter_500Medium: 'font-500',
  Inter_600SemiBold: 'font-600',
  Inter_700Bold: 'font-700',
}));

jest.mock('../i18n', () => ({
  initI18n: jest.fn(),
}));

jest.mock('../utils/storage', () => ({
  getStorage: jest.fn(),
}));

jest.mock('@/store/auth', () => ({
  hydrateAuth: jest.fn(),
}));

describe('initApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Font.loadAsync as jest.Mock).mockResolvedValue(undefined);
    (getStorage as jest.Mock).mockResolvedValue(undefined);
    (initI18n as jest.Mock).mockResolvedValue(undefined);
    (hydrateAuth as jest.Mock).mockResolvedValue(undefined);
  });

  it('loads the Inter font families', async () => {
    await initApp();

    expect(Font.loadAsync).toHaveBeenCalledWith({
      Inter_400Regular: 'font-400',
      Inter_500Medium: 'font-500',
      Inter_600SemiBold: 'font-600',
      Inter_700Bold: 'font-700',
    });
  });

  it('initializes storage, i18n, and auth hydration in order', async () => {
    await initApp();

    expect(getStorage).toHaveBeenCalledTimes(1);
    expect(initI18n).toHaveBeenCalledTimes(1);
    expect(hydrateAuth).toHaveBeenCalledTimes(1);
    // Boot steps run sequentially.
    expect(
      (Font.loadAsync as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan((getStorage as jest.Mock).mock.invocationCallOrder[0]);
    expect((getStorage as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
      (initI18n as jest.Mock).mock.invocationCallOrder[0],
    );
    expect((initI18n as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
      (hydrateAuth as jest.Mock).mock.invocationCallOrder[0],
    );
  });

  it('does not hydrate auth when fonts fail to load', async () => {
    (Font.loadAsync as jest.Mock).mockRejectedValue(
      new Error('font load failed'),
    );

    await expect(initApp()).rejects.toThrow('font load failed');
    expect(hydrateAuth).not.toHaveBeenCalled();
  });
});
