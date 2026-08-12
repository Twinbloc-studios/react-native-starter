import { delay } from '../delay';

describe('delay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves after the given number of milliseconds', async () => {
    const promise = delay(500);
    const spy = jest.fn();
    void promise.then(spy);

    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(499);
    await Promise.resolve();
    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await promise;
    expect(spy).toHaveBeenCalled();
  });

  it('resolves with 0ms delay', async () => {
    const promise = delay(0);
    jest.advanceTimersByTime(0);
    await expect(promise).resolves.toBeUndefined();
  });
});
