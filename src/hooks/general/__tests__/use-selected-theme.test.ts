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

  it('uses the stored theme when set', () => {
    mockUseMMKVString.mockReturnValue(['dark']);

    const { result } = renderHook(() => useSelectedTheme());

    expect(result.current.selectedTheme).toBe('dark');
  });

  it('falls back to the system scheme when stored theme is system', () => {
    mockUseMMKVString.mockReturnValue(['system']);
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useSelectedTheme());

    expect(result.current.selectedTheme).toBe('dark');
  });

  it('falls back to light when nothing is stored and no system scheme', () => {
    mockUseMMKVString.mockReturnValue([undefined]);
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useSelectedTheme());

    expect(result.current.selectedTheme).toBe('light');
  });

  it('setSelectedTheme applies the scheme and stores the value', () => {
    const setStoredTheme = jest.fn();
    mockUseMMKVString.mockReturnValue([undefined, setStoredTheme]);

    const { result } = renderHook(() => useSelectedTheme());

    act(() => {
      result.current.setSelectedTheme('dark');
    });

    expect(setColorSchemeSpy).toHaveBeenCalledWith('dark');
    expect(setStoredTheme).toHaveBeenCalledWith('dark');
  });

  it('setSelectedTheme with system resets the Appearance scheme', () => {
    const setStoredTheme = jest.fn();
    mockUseMMKVString.mockReturnValue([undefined, setStoredTheme]);

    const { result } = renderHook(() => useSelectedTheme());

    act(() => {
      result.current.setSelectedTheme('system');
    });

    expect(setColorSchemeSpy).toHaveBeenCalledWith('unspecified');
    expect(setStoredTheme).toHaveBeenCalledWith('system');
  });
});
