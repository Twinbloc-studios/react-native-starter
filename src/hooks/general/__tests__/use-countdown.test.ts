import { act, renderHook } from '@testing-library/react-native';

import { useCountdown } from '../use-countdown';

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with initial values', async () => {
    const { result } = await renderHook(() =>
      useCountdown({ initialSeconds: 30 }),
    );

    expect(result.current.seconds).toBe(30);
    expect(result.current.isActive).toBe(false);
  });

  it('decrements every second while active', async () => {
    const { result } = await renderHook(() =>
      useCountdown({ initialSeconds: 5, initialActive: true }),
    );

    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.seconds).toBe(4);

    await act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.seconds).toBe(2);
  });

  it('stops and completes when reaching zero', async () => {
    const onComplete = jest.fn();
    const { result } = await renderHook(() =>
      useCountdown({ initialSeconds: 2, initialActive: true, onComplete }),
    );

    await act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.seconds).toBe(0);
    expect(result.current.isActive).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('start() activates the countdown with custom seconds', async () => {
    const { result } = await renderHook(() =>
      useCountdown({ initialSeconds: 60 }),
    );

    await act(() => {
      result.current.start(10);
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.seconds).toBe(10);

    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.seconds).toBe(9);
  });

  it('stop() deactivates and zeroes the countdown', async () => {
    const { result } = await renderHook(() =>
      useCountdown({ initialSeconds: 10, initialActive: true }),
    );

    await act(() => {
      result.current.stop();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.seconds).toBe(0);

    // No further decrements after stop.
    await act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.seconds).toBe(0);
  });

  it('reset() restores the initial seconds and deactivates', async () => {
    const { result } = await renderHook(() =>
      useCountdown({ initialSeconds: 10 }),
    );

    await act(() => {
      result.current.start();
    });
    await act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.seconds).toBe(8);

    await act(() => {
      result.current.reset();
    });

    expect(result.current.seconds).toBe(10);
    expect(result.current.isActive).toBe(false);
  });
});
