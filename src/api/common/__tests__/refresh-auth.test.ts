import type * as RefreshAuthType from '../refresh-auth';

const mockPost = jest.fn();
const mockAxiosDefault = Object.assign(jest.fn(), { post: mockPost });

const mockAccessToken = jest.fn();
const mockSignIn = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: mockAxiosDefault,
}));

jest.mock('@env', () => ({
  Env: {
    EXPO_PUBLIC_REFRESH_URL: 'http://localhost/auth/refresh',
  },
}));

jest.mock('@/store/auth', () => ({
  accessToken: mockAccessToken,
  signIn: mockSignIn,
}));

describe('refresh-auth', () => {
  beforeEach(() => {
    jest.resetModules();
    mockPost.mockReset();
    mockAccessToken.mockReset();
    mockSignIn.mockReset();
    mockSignIn.mockResolvedValue(undefined);
  });

  const loadRefreshAuth = () => {
    let mod: typeof RefreshAuthType;
    jest.isolateModules(() => {
      mod = require('../refresh-auth');
    });
    return mod!;
  };

  it('returns false when no session / refresh token is stored', async () => {
    mockAccessToken.mockReturnValue(null);

    const { refreshAuthSession } = loadRefreshAuth();

    await expect(refreshAuthSession()).resolves.toBe(false);
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('rotates tokens and persists the new session via signIn', async () => {
    mockAccessToken.mockReturnValue({
      access: 'old-access',
      refresh: 'old-refresh',
      userId: 'user-1',
    });
    mockPost.mockResolvedValue({
      data: { access: 'new-access', refresh: 'new-refresh' },
    });

    const { refreshAuthSession } = loadRefreshAuth();

    await expect(refreshAuthSession()).resolves.toBe(true);

    expect(mockPost).toHaveBeenCalledWith('http://localhost/auth/refresh', {
      refresh: 'old-refresh',
    });
    expect(mockSignIn).toHaveBeenCalledWith({
      access: 'new-access',
      refresh: 'new-refresh',
      userId: 'user-1',
    });
  });

  it('supports access_token / refresh_token response shapes', async () => {
    mockAccessToken.mockReturnValue({
      access: 'old-access',
      refresh: 'old-refresh',
      userId: 'user-1',
    });
    mockPost.mockResolvedValue({
      data: { access_token: 'new-access', refresh_token: 'new-refresh' },
    });

    const { refreshAuthSession } = loadRefreshAuth();

    await expect(refreshAuthSession()).resolves.toBe(true);
    expect(mockSignIn).toHaveBeenCalledWith({
      access: 'new-access',
      refresh: 'new-refresh',
      userId: 'user-1',
    });
  });

  it('keeps the existing refresh token when the response omits it', async () => {
    mockAccessToken.mockReturnValue({
      access: 'old-access',
      refresh: 'old-refresh',
      userId: 'user-1',
    });
    mockPost.mockResolvedValue({ data: { access: 'new-access' } });

    const { refreshAuthSession } = loadRefreshAuth();

    await expect(refreshAuthSession()).resolves.toBe(true);
    expect(mockSignIn).toHaveBeenCalledWith({
      access: 'new-access',
      refresh: 'old-refresh',
      userId: 'user-1',
    });
  });

  it('returns false when the refresh request fails', async () => {
    mockAccessToken.mockReturnValue({
      access: 'old-access',
      refresh: 'old-refresh',
      userId: 'user-1',
    });
    mockPost.mockRejectedValue(new Error('Network down'));

    const { refreshAuthSession } = loadRefreshAuth();

    await expect(refreshAuthSession()).resolves.toBe(false);
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('returns false when the response has no access token', async () => {
    mockAccessToken.mockReturnValue({
      access: 'old-access',
      refresh: 'old-refresh',
      userId: 'user-1',
    });
    mockPost.mockResolvedValue({ data: { error: 'invalid_grant' } });

    const { refreshAuthSession } = loadRefreshAuth();

    await expect(refreshAuthSession()).resolves.toBe(false);
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('is single-flight: concurrent callers share one refresh request', async () => {
    mockAccessToken.mockReturnValue({
      access: 'old-access',
      refresh: 'old-refresh',
      userId: 'user-1',
    });
    mockPost.mockResolvedValue({ data: { access: 'new-access' } });

    const { refreshAuthSession } = loadRefreshAuth();

    const [a, b, c] = await Promise.all([
      refreshAuthSession(),
      refreshAuthSession(),
      refreshAuthSession(),
    ]);

    expect(a).toBe(true);
    expect(b).toBe(true);
    expect(c).toBe(true);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it('allows a new refresh after the in-flight one settles', async () => {
    mockAccessToken.mockReturnValue({
      access: 'old-access',
      refresh: 'old-refresh',
      userId: 'user-1',
    });
    mockPost.mockResolvedValue({ data: { access: 'new-access' } });

    const { refreshAuthSession } = loadRefreshAuth();

    await refreshAuthSession();
    await refreshAuthSession();

    expect(mockPost).toHaveBeenCalledTimes(2);
  });
});
