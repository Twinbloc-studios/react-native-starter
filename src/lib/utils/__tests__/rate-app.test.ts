import type * as RateAppType from '../rate-app';

const mockIsAvailableAsync = jest.fn();
const mockRequestReview = jest.fn();
const mockOpenURL = jest.fn();

const setup = (platform: 'ios' | 'android' | 'web') => {
  jest.resetModules();
  mockIsAvailableAsync.mockReset();
  mockRequestReview.mockReset();
  mockOpenURL.mockReset();
  mockOpenURL.mockResolvedValue(undefined);
  mockIsAvailableAsync.mockResolvedValue(false);

  jest.doMock('expo-store-review', () => ({
    isAvailableAsync: () => mockIsAvailableAsync(),
    requestReview: () => mockRequestReview(),
  }));
  jest.doMock('@env', () => ({
    Env: {
      PACKAGE: 'com.test.app',
    },
  }));
  jest.doMock('react-native', () => ({
    Linking: { openURL: mockOpenURL },
    Platform: { OS: platform },
  }));

  return require('../rate-app') as typeof RateAppType;
};

describe('rateApp', () => {
  it('requests an in-app review when available and returns early', async () => {
    const { rateApp } = setup('ios');
    mockIsAvailableAsync.mockResolvedValue(true);

    await rateApp();

    expect(mockRequestReview).toHaveBeenCalled();
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it('falls back to a market link on Android when review is unavailable', async () => {
    const { rateApp } = setup('android');

    await rateApp();

    expect(mockOpenURL).toHaveBeenCalledWith(
      expect.stringContaining('market://details?id='),
    );
  });

  it('falls back to the App Store review link on iOS', async () => {
    const { rateApp } = setup('ios');

    await rateApp();

    expect(mockOpenURL).toHaveBeenCalledWith(
      expect.stringContaining('itms-apps://itunes.apple.com'),
    );
  });

  it('falls back to the https store link when the market link fails', async () => {
    const { rateApp } = setup('android');
    // Set the rejection AFTER setup() — setup resets the mock and would
    // otherwise wipe the once-rejection.
    mockOpenURL.mockRejectedValueOnce(new Error('market link failed'));

    await rateApp();

    expect(mockOpenURL).toHaveBeenCalledTimes(2);
    expect(mockOpenURL).toHaveBeenLastCalledWith(
      expect.stringContaining('https://play.google.com/store/apps/details?id='),
    );
  });

  it('falls back to opening the store when in-app review throws', async () => {
    const { rateApp } = setup('ios');
    mockIsAvailableAsync.mockResolvedValue(true);
    mockRequestReview.mockRejectedValue(new Error('review failed'));

    await rateApp();

    expect(mockOpenURL).toHaveBeenCalled();
  });

  it('does nothing on unsupported platforms without a review', async () => {
    const { rateApp } = setup('web');

    await rateApp();

    expect(mockRequestReview).not.toHaveBeenCalled();
    expect(mockOpenURL).not.toHaveBeenCalled();
  });
});
