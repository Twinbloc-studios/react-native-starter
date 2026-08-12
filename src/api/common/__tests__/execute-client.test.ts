import type * as ExecuteClientType from '../execute-client';

const mockClient = jest.fn();
const mockIsAxiosError = jest.fn();
const mockAxiosCreate = jest.fn(() => mockClient);
const mockAxiosDefault = Object.assign(jest.fn(), {
  create: mockAxiosCreate,
});

const mockAccessToken = jest.fn();
const mockSignOut = jest.fn();
const mockQueryClientClear = jest.fn();
const mockRefreshAuthSession = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: mockAxiosDefault,
  isAxiosError: mockIsAxiosError,
}));

jest.mock('@env', () => ({
  Env: {
    EXPO_PUBLIC_API_URL: 'http://localhost',
    EXPO_PUBLIC_REFRESH_URL: 'http://localhost/auth/refresh',
  },
}));

jest.mock('@/store/auth', () => ({
  accessToken: mockAccessToken,
  signOut: mockSignOut,
}));

jest.mock('../api-provider', () => ({
  queryClient: {
    clear: mockQueryClientClear,
  },
}));

jest.mock('../refresh-auth', () => ({
  refreshAuthSession: mockRefreshAuthSession,
}));

describe('execute-client', () => {
  beforeEach(() => {
    jest.resetModules();
    mockClient.mockReset();
    mockIsAxiosError.mockReset();
    mockAxiosCreate.mockReset();
    mockAccessToken.mockReset();
    mockSignOut.mockReset();
    mockQueryClientClear.mockReset();
    mockRefreshAuthSession.mockReset();
    mockAxiosCreate.mockImplementation(() => mockClient);
  });

  const loadExecuteClient = () => {
    let mod: typeof ExecuteClientType;
    jest.isolateModules(() => {
      mod = require('../execute-client');
    });
    return mod!;
  };

  it('returns response data on success', async () => {
    mockAccessToken.mockReturnValue({ access: 'token' });
    mockClient.mockResolvedValueOnce({ data: { ok: true } });

    const { executeRest } = loadExecuteClient();

    const result = await executeRest('/ping', 'GET');

    expect(result).toEqual({ ok: true });
    expect(mockClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/ping',
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
        }),
      }),
    );
  });

  it('silently refreshes the token and retries the request once on 401', async () => {
    // Initial token is 'expired-token'; after refresh the rotated 'fresh-token' is used.
    mockAccessToken.mockReturnValue({ access: 'expired-token' });
    mockIsAxiosError.mockReturnValue(true);
    mockRefreshAuthSession.mockImplementation(async () => {
      mockAccessToken.mockReturnValue({ access: 'fresh-token' });
      return true;
    });
    // First attempt 401s, the retry with the rotated token succeeds.
    mockClient
      .mockRejectedValueOnce({
        response: { status: 401, data: { message: 'unauthorized' } },
        message: 'Unauthorized',
      })
      .mockResolvedValueOnce({ data: { ok: true } });

    const { executeRest } = loadExecuteClient();

    const result = await executeRest('/private', 'GET');

    expect(result).toEqual({ ok: true });
    expect(mockRefreshAuthSession).toHaveBeenCalledTimes(1);
    expect(mockClient).toHaveBeenCalledTimes(2);
    // First attempt used the expired token, the retry the rotated one.
    expect(mockClient).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer expired-token',
        }),
      }),
    );
    expect(mockClient).toHaveBeenLastCalledWith(
      expect.objectContaining({
        url: '/private',
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer fresh-token',
        }),
      }),
    );
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockQueryClientClear).not.toHaveBeenCalled();
  });

  it('signs out and clears the cache when the refresh succeeds but the retry also 401s', async () => {
    mockAccessToken.mockReturnValue({ access: 'token' });
    mockIsAxiosError.mockReturnValue(true);
    mockClient.mockRejectedValue({
      response: { status: 401, data: { message: 'unauthorized' } },
      message: 'Unauthorized',
    });
    mockRefreshAuthSession.mockResolvedValueOnce(true);

    const { executeRest, ApiError } = loadExecuteClient();

    await expect(executeRest('/private', 'GET')).rejects.toBeInstanceOf(
      ApiError,
    );

    expect(mockRefreshAuthSession).toHaveBeenCalledTimes(1);
    expect(mockClient).toHaveBeenCalledTimes(2);
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockQueryClientClear).toHaveBeenCalled();
  });

  it('signs out and clears cache on 401 when the refresh fails', async () => {
    mockAccessToken.mockReturnValue({ access: 'token' });
    mockIsAxiosError.mockReturnValue(true);
    mockClient.mockRejectedValueOnce({
      response: { status: 401, data: { message: 'unauthorized' } },
      message: 'Unauthorized',
    });
    mockRefreshAuthSession.mockResolvedValueOnce(false);

    const { executeRest, ApiError } = loadExecuteClient();

    await expect(executeRest('/private', 'GET')).rejects.toBeInstanceOf(
      ApiError,
    );

    expect(mockRefreshAuthSession).toHaveBeenCalled();
    expect(mockClient).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockQueryClientClear).toHaveBeenCalled();
  });

  it('does not refresh or sign out on 401 when ignore401 is set', async () => {
    mockAccessToken.mockReturnValue({ access: 'token' });
    mockIsAxiosError.mockReturnValue(true);
    mockClient.mockRejectedValueOnce({
      response: { status: 401, data: { message: 'unauthorized' } },
      message: 'Unauthorized',
    });

    const { executeRest, ApiError } = loadExecuteClient();

    await expect(
      executeRest('/private', 'GET', undefined, { ignore401: true }),
    ).rejects.toBeInstanceOf(ApiError);

    expect(mockRefreshAuthSession).not.toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockQueryClientClear).not.toHaveBeenCalled();
  });

  it('uses string response data as error message', async () => {
    mockAccessToken.mockReturnValue(undefined);
    mockIsAxiosError.mockReturnValue(true);
    mockClient.mockRejectedValueOnce({
      response: { status: 400, data: 'Bad request' },
      message: 'Request failed',
    });

    const { executeRest } = loadExecuteClient();

    await expect(executeRest('/bad', 'GET')).rejects.toMatchObject({
      message: 'Bad request',
      status: 400,
    });
  });

  it('wraps non-axios errors with fallback message', async () => {
    mockAccessToken.mockReturnValue(undefined);
    mockIsAxiosError.mockReturnValue(false);
    mockClient.mockRejectedValueOnce(new Error('Network down'));

    const { executeRest } = loadExecuteClient();

    await expect(executeRest('/down', 'GET')).rejects.toMatchObject({
      message: 'Network down',
    });
  });
});
