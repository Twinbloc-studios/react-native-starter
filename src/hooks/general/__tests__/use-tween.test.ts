import { renderHook } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';

import { useTween } from '../use-tween';

describe('useTween', () => {
  it('starts at 1 when active and 0 when inactive', async () => {
    const { result } = await renderHook<
      SharedValue<number>,
      { active: boolean }
    >(({ active }) => useTween(active), {
      initialProps: { active: true },
    });
    expect(result.current.value).toBe(1);
  });

  it('starts at 0 when inactive', async () => {
    const { result } = await renderHook<
      SharedValue<number>,
      { active: boolean }
    >(({ active }) => useTween(active), {
      initialProps: { active: false },
    });
    expect(result.current.value).toBe(0);
  });

  it('tweens to 1 when active flips on', async () => {
    const { result, rerender } = await renderHook<
      SharedValue<number>,
      { active: boolean }
    >(({ active }) => useTween(active), {
      initialProps: { active: false },
    });
    expect(result.current.value).toBe(0);

    await rerender({ active: true });
    expect(result.current.value).toBe(1);
  });

  it('tweens back to 0 when active flips off', async () => {
    const { result, rerender } = await renderHook<
      SharedValue<number>,
      { active: boolean }
    >(({ active }) => useTween(active), {
      initialProps: { active: true },
    });
    expect(result.current.value).toBe(1);

    await rerender({ active: false });
    expect(result.current.value).toBe(0);
  });

  it('uses a clamped spring when spring is enabled', async () => {
    const { result, rerender } = await renderHook<
      SharedValue<number>,
      { active: boolean }
    >(({ active }) => useTween(active, { spring: true }), {
      initialProps: { active: false },
    });
    await rerender({ active: true });
    expect(result.current.value).toBe(1);
  });
});
