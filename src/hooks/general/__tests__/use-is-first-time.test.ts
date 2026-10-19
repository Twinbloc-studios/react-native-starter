import { act, renderHook } from '@testing-library/react-native';

import { useIsFirstTime } from '../use-is-first-time';

const mockUseMMKVBoolean = jest.fn();

jest.mock('react-native-mmkv', () => ({
  useMMKVBoolean: (...args: unknown[]) => mockUseMMKVBoolean(...args),
}));

jest.mock('@/lib', () => ({
  storageInstance: { set: jest.fn(), getString: jest.fn() },
}));

describe('useIsFirstTime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defaults to true when nothing is stored', async () => {
    mockUseMMKVBoolean.mockReturnValue([undefined, jest.fn()]);

    const { result } = await renderHook(() => useIsFirstTime());

    expect(result.current[0]).toBe(true);
  });

  it('returns the stored value', async () => {
    mockUseMMKVBoolean.mockReturnValue([false, jest.fn()]);

    const { result } = await renderHook(() => useIsFirstTime());

    expect(result.current[0]).toBe(false);
  });

  it('exposes the underlying setter', async () => {
    const setter = jest.fn();
    mockUseMMKVBoolean.mockReturnValue([true, setter]);

    const { result } = await renderHook(() => useIsFirstTime());

    await act(() => {
      result.current[1](false);
    });

    expect(setter).toHaveBeenCalledWith(false);
  });
});
