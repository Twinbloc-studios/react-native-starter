const mockClient = jest.fn();
const mockIsAxiosError = jest.fn();
const mockAxiosCreate = jest.fn(() => mockClient);
const mockAxiosDefault = Object.assign(jest.fn(), {
  create: mockAxiosCreate,
});

const mockAccessToken = jest.fn();
const mockSignOut = jest.fn();
const mockQueryClientClear = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: mockAxiosDefault,
  isAxiosError: mockIsAxiosError,
}));

jest.mock("@env", () => ({
  Env: {
    EXPO_PUBLIC_API_URL: "http://localhost",
  },
}));

jest.mock("@/store/auth", () => ({
  accessToken: mockAccessToken,
  signOut: mockSignOut,
}));

jest.mock("../api-provider", () => ({
  queryClient: {
    clear: mockQueryClientClear,
  },
}));

describe("execute-client", () => {
  beforeEach(() => {
    jest.resetModules();
    mockClient.mockReset();
    mockIsAxiosError.mockReset();
    mockAxiosCreate.mockReset();
    mockAccessToken.mockReset();
    mockSignOut.mockReset();
    mockQueryClientClear.mockReset();
    mockAxiosCreate.mockImplementation(() => mockClient);
  });

  const loadExecuteClient = () => {
    let module: typeof import("../execute-client");
    jest.isolateModules(() => {
      module = require("../execute-client");
    });
    return module!;
  };

  it("returns response data on success", async () => {
    mockAccessToken.mockReturnValue({ access: "token" });
    mockClient.mockResolvedValueOnce({ data: { ok: true } });

    const { executeRest } = loadExecuteClient();

    const result = await executeRest("/ping", "GET");

    expect(result).toEqual({ ok: true });
    expect(mockClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/ping",
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
      }),
    );
  });

  it("signs out and clears cache on 401 when token is present", async () => {
    mockAccessToken.mockReturnValue({ access: "token" });
    mockIsAxiosError.mockReturnValue(true);
    mockClient.mockRejectedValueOnce({
      response: { status: 401, data: { message: "unauthorized" } },
      message: "Unauthorized",
    });

    const { executeRest, ApiError } = loadExecuteClient();

    await expect(executeRest("/private", "GET")).rejects.toBeInstanceOf(ApiError);

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockQueryClientClear).toHaveBeenCalled();
  });

  it("uses string response data as error message", async () => {
    mockAccessToken.mockReturnValue(undefined);
    mockIsAxiosError.mockReturnValue(true);
    mockClient.mockRejectedValueOnce({
      response: { status: 400, data: "Bad request" },
      message: "Request failed",
    });

    const { executeRest } = loadExecuteClient();

    await expect(executeRest("/bad", "GET")).rejects.toMatchObject({
      message: "Bad request",
      status: 400,
    });
  });

  it("wraps non-axios errors with fallback message", async () => {
    mockAccessToken.mockReturnValue(undefined);
    mockIsAxiosError.mockReturnValue(false);
    mockClient.mockRejectedValueOnce(new Error("Network down"));

    const { executeRest } = loadExecuteClient();

    await expect(executeRest("/down", "GET")).rejects.toMatchObject({
      message: "Network down",
    });
  });
});
