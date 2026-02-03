const setup = (platform: "ios" | "web") => {
  jest.resetModules();

  const secureStoreMock = {
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
  };

  jest.doMock("expo-secure-store", () => secureStoreMock);
  jest.doMock("react-native", () => ({
    Platform: { OS: platform },
  }));

  if (platform === "web") {
    const storage = new Map<string, string>();
    global.localStorage = {
      getItem: jest.fn((key: string) => storage.get(key) ?? null),
      setItem: jest.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: jest.fn((key: string) => {
        storage.delete(key);
      }),
      clear: jest.fn(() => storage.clear()),
      key: jest.fn((index: number) => Array.from(storage.keys())[index] ?? null),
      length: 0,
    };
  } else {
    delete (global as { localStorage?: Storage }).localStorage;
  }

  const module = require("../secure-store") as typeof import("../secure-store");

  return { module, secureStoreMock };
};

describe("secure-store", () => {
  it("uses SecureStore on native platforms", async () => {
    const { module, secureStoreMock } = setup("ios");
    secureStoreMock.getItemAsync.mockResolvedValue("native-value");

    await module.setSecureItem("key", "value");
    await module.getSecureItem("key");
    await module.removeSecureItem("key");

    expect(secureStoreMock.setItemAsync).toHaveBeenCalledWith("key", "value");
    expect(secureStoreMock.getItemAsync).toHaveBeenCalledWith("key");
    expect(secureStoreMock.deleteItemAsync).toHaveBeenCalledWith("key");
  });

  it("uses localStorage on web", async () => {
    const { module } = setup("web");

    await module.setSecureItem("key", "value");
    const result = await module.getSecureItem("key");
    await module.removeSecureItem("key");

    expect(global.localStorage.setItem).toHaveBeenCalledWith("key", "value");
    expect(result).toBe("value");
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("key");
  });

  it("uses token helpers with auth_token key", async () => {
    const { module, secureStoreMock } = setup("ios");

    await module.saveToken("token");
    await module.getToken();
    await module.deleteToken();

    expect(secureStoreMock.setItemAsync).toHaveBeenCalledWith("auth_token", "token");
    expect(secureStoreMock.getItemAsync).toHaveBeenCalledWith("auth_token");
    expect(secureStoreMock.deleteItemAsync).toHaveBeenCalledWith("auth_token");
  });
});
