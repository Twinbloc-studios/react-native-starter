import { act, renderHook } from '@testing-library/react-native';
import { Appearance, useColorScheme } from 'react-native';

import { useSelectedTheme } from '../use-selected-theme';

// The RN jest preset already provides useColorScheme as a jest.fn returning
// 'light' — reconfigure it per test instead of mocking react-native.
const mockUseColorScheme = useColorScheme as jest.Mock;

const mockUseMMKVString = jest.fn();

jest.mock('react-native-mmkv', () => ({
  useMMKVString: (...args: unknown[]) => mockUseMMKVString(...args),
}));

jest.mock('@/store/auth/utils', () => ({
  STORAGE_KEY: { SELECTED_THEME: 'SELECTED_THEME' },
}));

jest.mock('@/lib', () => ({
  storageInstance: { set: jest.fn(), getString: jest.fn() },
}));

describe('useSelectedTheme', () => {
  let setColorSchemeSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
    setColorSchemeSpy = jest
      .spyOn(Appearance, 'setColorScheme')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    setColorSchemeSpy.mockRestore();
  });

  it('uses the stored theme when set', async () => {
    mockUseMMKVString.mockReturnValue(['dark']);

    const { result } = await renderHook(() => useSelectedTheme());

    expect(result.current.selectedTheme).toBe('dark');
    expect(result.current.appliedTheme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.theme.dark).toBe(true);
  });

  it('preserves the system preference and applies the current system scheme', async () => {
    mockUseMMKVString.mockReturnValue(['system']);
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = await renderHook(() => useSelectedTheme());

    expect(result.current.selectedTheme).toBe('system');
    expect(result.current.appliedTheme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.theme.dark).toBe(true);
  });

  it('defaults to the system preference and resolves an unknown scheme to light', async () => {
    mockUseMMKVString.mockReturnValue([undefined]);
    mockUseColorScheme.mockReturnValue(null);

    const { result } = await renderHook(() => useSelectedTheme());

    expect(result.current.selectedTheme).toBe('system');
    expect(result.current.appliedTheme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(result.current.theme.dark).toBe(false);
  });

  it('setSelectedTheme applies the scheme and stores the value', async () => {
    const setStoredTheme = jest.fn();
    mockUseMMKVString.mockReturnValue([undefined, setStoredTheme]);

    const { result } = await renderHook(() => useSelectedTheme());

    await act(async () => {
      result.current.setSelectedTheme('dark');
    });

    expect(setColorSchemeSpy).toHaveBeenCalledWith('dark');
    expect(setStoredTheme).toHaveBeenCalledWith('dark');
  });

  it('setSelectedTheme with system resets the Appearance scheme', async () => {
    const setStoredTheme = jest.fn();
    mockUseMMKVString.mockReturnValue([undefined, setStoredTheme]);

    const { result } = await renderHook(() => useSelectedTheme());

    await act(async () => {
      result.current.setSelectedTheme('system');
    });

    expect(setColorSchemeSpy).toHaveBeenCalledWith('unspecified');
    expect(setStoredTheme).toHaveBeenCalledWith('system');
  });
});
