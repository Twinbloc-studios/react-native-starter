import { renderHook } from '@testing-library/react-native';

import { mmkvStorage } from '@/lib';

import { setHapticFeedback, setSizeScale, useUtility } from '../index';

// jest.setup.js mocks @/store/utility globally — restore the real module here.
jest.unmock('@/store/utility');

jest.mock('@/lib', () => {
  const storage = {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
  };
  return { mmkvStorage: storage };
});

describe('utility store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts with default values', () => {
    const state = useUtility.getState();
    expect(state.hapticFeedback).toBe(true);
    expect(state.sizeScale).toBe(1);
  });

  it('setHapticFeedback updates the value', () => {
    setHapticFeedback(false);

    expect(useUtility.getState().hapticFeedback).toBe(false);
  });

  it('setSizeScale updates the value', () => {
    setSizeScale(1.25);

    expect(useUtility.getState().sizeScale).toBe(1.25);
  });

  it('persists changes through the mmkv storage', async () => {
    setHapticFeedback(false);

    await Promise.resolve();
    expect(mmkvStorage.setItem).toHaveBeenCalledWith(
      'utilityState',
      expect.stringContaining('"hapticFeedback":false'),
    );
  });

  it('exposes selector-based access via createSelectors', () => {
    setSizeScale(2);

    // createSelectors .use.* methods are hooks — read through renderHook.
    const { result } = renderHook(() => useUtility.use.sizeScale());
    expect(result.current).toBe(2);
  });
});
