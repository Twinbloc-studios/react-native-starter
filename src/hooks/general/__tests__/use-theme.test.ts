import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

import { useTheme } from '../use-theme';

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

jest.mock('@/lib/utils/storage', () => ({
  storageInstance: { set: jest.fn(), getString: jest.fn() },
}));

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
  });

  it('returns the dark theme when stored theme is dark', () => {
    mockUseMMKVString.mockReturnValue(['dark']);
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useTheme());

    expect(result.current.dark).toBe(true);
  });

  it('returns the light theme when stored theme is light', () => {
    mockUseMMKVString.mockReturnValue(['light']);
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.dark).toBe(false);
  });

  it('falls back to the system color scheme when stored theme is system', () => {
    mockUseMMKVString.mockReturnValue(['system']);
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.dark).toBe(true);
  });

  it('defaults to light when no stored theme and no color scheme', () => {
    mockUseMMKVString.mockReturnValue([undefined]);
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useTheme());

    expect(result.current.dark).toBe(false);
  });
});
