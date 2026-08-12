import { act, renderHook } from '@testing-library/react-native';

import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial'));

    expect(result.current).toBe('initial');
  });

  it('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      (props) => useDebounce(props, 300),
      {
        initialProps: 'first',
      },
    );

    rerender('second');
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('second');
  });

  it('resets the timer when the value changes before the delay elapses', () => {
    const { result, rerender } = renderHook(
      (props) => useDebounce(props, 300),
      {
        initialProps: 'first',
      },
    );

    rerender('second');
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender('third');
    act(() => {
      jest.advanceTimersByTime(200);
    });
    // Still not elapsed since the first change: 200 + 200 < 300 from the last.
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('third');
  });

  it('uses the default 300ms delay', () => {
    const { result, rerender } = renderHook((props) => useDebounce(props), {
      initialProps: 'a',
    });

    rerender('b');
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('b');
  });
});
