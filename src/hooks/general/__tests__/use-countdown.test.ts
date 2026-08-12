import { act, renderHook } from '@testing-library/react-native';

import { useCountdown } from '../use-countdown';

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with initial values', () => {
    const { result } = renderHook(() => useCountdown({ initialSeconds: 30 }));

    expect(result.current.seconds).toBe(30);
    expect(result.current.isActive).toBe(false);
  });

  it('decrements every second while active', () => {
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 5, initialActive: true }),
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.seconds).toBe(4);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.seconds).toBe(2);
  });

  it('stops and completes when reaching zero', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 2, initialActive: true, onComplete }),
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.seconds).toBe(0);
    expect(result.current.isActive).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('start() activates the countdown with custom seconds', () => {
    const { result } = renderHook(() => useCountdown({ initialSeconds: 60 }));

    act(() => {
      result.current.start(10);
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.seconds).toBe(10);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.seconds).toBe(9);
  });

  it('stop() deactivates and zeroes the countdown', () => {
    const { result } = renderHook(() =>
      useCountdown({ initialSeconds: 10, initialActive: true }),
    );

    act(() => {
      result.current.stop();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.seconds).toBe(0);

    // No further decrements after stop.
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.seconds).toBe(0);
  });

  it('reset() restores the initial seconds and deactivates', () => {
    const { result } = renderHook(() => useCountdown({ initialSeconds: 10 }));

    act(() => {
      result.current.start();
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.seconds).toBe(8);

    act(() => {
      result.current.reset();
    });

    expect(result.current.seconds).toBe(10);
    expect(result.current.isActive).toBe(false);
  });
});
