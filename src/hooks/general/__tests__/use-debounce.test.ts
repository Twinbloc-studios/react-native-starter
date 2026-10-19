import { act, renderHook } from '@testing-library/react-native';

import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial value immediately', async () => {
    const { result } = await renderHook(() => useDebounce('initial'));

    expect(result.current).toBe('initial');
  });

  it('updates the value after the delay', async () => {
    const { result, rerender } = await renderHook(
      (props) => useDebounce(props, 300),
      {
        initialProps: 'first',
      },
    );

    await rerender('second');
    expect(result.current).toBe('first');

    await act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('second');
  });

  it('resets the timer when the value changes before the delay elapses', async () => {
    const { result, rerender } = await renderHook(
      (props) => useDebounce(props, 300),
      {
        initialProps: 'first',
      },
    );

    await rerender('second');
    await act(() => {
      jest.advanceTimersByTime(200);
    });

    await rerender('third');
    await act(() => {
      jest.advanceTimersByTime(200);
    });
    // Still not elapsed since the first change: 200 + 200 < 300 from the last.
    expect(result.current).toBe('first');

    await act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('third');
  });

  it('uses the default 300ms delay', async () => {
    const { result, rerender } = await renderHook(
      (props) => useDebounce(props),
      {
        initialProps: 'a',
      },
    );

    await rerender('b');
    await act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('a');

    await act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('b');
  });
});
