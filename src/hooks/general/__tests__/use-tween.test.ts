import { renderHook } from '@testing-library/react-native';

import { useTween } from '../use-tween';

describe('useTween', () => {
  it('starts at 1 when active and 0 when inactive', () => {
    const { result } = renderHook(({ active }) => useTween(active), {
      initialProps: { active: true },
    });
    expect(result.current.value).toBe(1);
  });

  it('starts at 0 when inactive', () => {
    const { result } = renderHook(({ active }) => useTween(active), {
      initialProps: { active: false },
    });
    expect(result.current.value).toBe(0);
  });

  it('tweens to 1 when active flips on', () => {
    const { result, rerender } = renderHook(({ active }) => useTween(active), {
      initialProps: { active: false },
    });
    expect(result.current.value).toBe(0);

    rerender({ active: true });
    expect(result.current.value).toBe(1);
  });

  it('tweens back to 0 when active flips off', () => {
    const { result, rerender } = renderHook(({ active }) => useTween(active), {
      initialProps: { active: true },
    });
    expect(result.current.value).toBe(1);

    rerender({ active: false });
    expect(result.current.value).toBe(0);
  });

  it('uses a clamped spring when spring is enabled', () => {
    const { result, rerender } = renderHook(
      ({ active }) => useTween(active, { spring: true }),
      { initialProps: { active: false } },
    );
    rerender({ active: true });
    expect(result.current.value).toBe(1);
  });
});
