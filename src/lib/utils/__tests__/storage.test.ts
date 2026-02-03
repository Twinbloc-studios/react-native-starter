const setup = (options: { platform: "ios" | "web"; appEnv: "production" | "development"; existingKey?: string | null; size?: number }) => {
  jest.resetModules();

  const mmkvStore = {
    size: options.size ?? 0,
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
    trim: jest.fn(),
  };

  const mmkvMock = {
    createMMKV: jest.fn(() => mmkvStore),
  };

  const secureStoreMock = {
    getItemAsync: jest.fn(() => Promise.resolve(options.existingKey ?? null)),
    setItemAsync: jest.fn(() => Promise.resolve()),
  };

  const cryptoMock = {
    randomUUID: jest.fn(() => "new-key"),
  };

  jest.doMock("@env", () => ({
    Env: {
      APP_ENV: options.appEnv,
    },
  }));
  jest.doMock("expo-crypto", () => cryptoMock);
  jest.doMock("expo-secure-store", () => secureStoreMock);
  jest.doMock("react-native", () => ({
    Platform: { OS: options.platform },
  }));
  jest.doMock("react-native-mmkv", () => mmkvMock);

  const module = require("../storage") as typeof import("../storage");
  const { STORAGE_KEY } = require("@/store/auth/utils") as typeof import("@/store/auth/utils");

  return { module, mmkvStore, secureStoreMock, cryptoMock, mmkvMock, STORAGE_KEY };
};

describe("storage", () => {
  it("uses existing encryption key on native", async () => {
    const { module, secureStoreMock, cryptoMock, mmkvMock } = setup({
      platform: "ios",
      appEnv: "development",
      existingKey: "existing-key",
    });

    await module.getStorage();

    expect(secureStoreMock.getItemAsync).toHaveBeenCalledWith("mmkv-encryption-key");
    expect(secureStoreMock.setItemAsync).not.toHaveBeenCalled();
    expect(cryptoMock.randomUUID).not.toHaveBeenCalled();
    expect(mmkvMock.createMMKV).toHaveBeenCalledWith({
      id: "app-secure-storage",
      encryptionKey: "existing-key",
    });
  });

  it("creates a new encryption key when missing", async () => {
    const { secureStoreMock, cryptoMock, mmkvMock } = setup({
      platform: "ios",
      appEnv: "development",
      existingKey: null,
    });

    await mmkvMock.createMMKV.mock.results;
    await (await require("../storage")).getStorage?.();
    await require("../storage").getStorage();

    expect(cryptoMock.randomUUID).toHaveBeenCalled();
    expect(secureStoreMock.setItemAsync).toHaveBeenCalledWith("mmkv-encryption-key", "new-key");
    expect(mmkvMock.createMMKV).toHaveBeenCalledWith({
      id: "app-secure-storage",
      encryptionKey: "new-key",
    });
  });

  it("does not use encryption on web", async () => {
    const { module, mmkvMock } = setup({
      platform: "web",
      appEnv: "development",
      existingKey: null,
    });

    await module.getStorage();

    expect(mmkvMock.createMMKV).toHaveBeenCalledWith({
      id: "app-secure-storage",
      encryptionKey: undefined,
    });
  });

  it("trims storage when size exceeds threshold", async () => {
    const { module, mmkvStore } = setup({
      platform: "ios",
      appEnv: "development",
      existingKey: "existing-key",
      size: 4096,
    });

    await module.getStorage();

    expect(mmkvStore.trim).toHaveBeenCalled();
  });

  it("serializes and parses values", async () => {
    const { module, mmkvStore, STORAGE_KEY } = setup({
      platform: "ios",
      appEnv: "development",
      existingKey: "existing-key",
    });

    mmkvStore.getString.mockReturnValueOnce(JSON.stringify({ value: 123 }));

    await module.setItem(STORAGE_KEY.IS_FIRST_TIME, { value: 123 });
    const result = await module.getItem<{ value: number }>(STORAGE_KEY.IS_FIRST_TIME);
    await module.removeItem(STORAGE_KEY.IS_FIRST_TIME);

    expect(mmkvStore.set).toHaveBeenCalledWith(STORAGE_KEY.IS_FIRST_TIME, JSON.stringify({ value: 123 }));
    expect(result).toEqual({ value: 123 });
    expect(mmkvStore.remove).toHaveBeenCalledWith(STORAGE_KEY.IS_FIRST_TIME);
  });

  it("clears all storage entries", async () => {
    const { module, mmkvStore } = setup({
      platform: "ios",
      appEnv: "development",
      existingKey: "existing-key",
    });

    await module.clearStorage();

    expect(mmkvStore.clearAll).toHaveBeenCalled();
  });

  it("throws in production when encryption setup fails twice", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    jest.resetModules();
    jest.doMock("@env", () => ({
      Env: {
        APP_ENV: "production",
      },
    }));
    jest.doMock("expo-crypto", () => ({
      randomUUID: jest.fn(() => "new-key"),
    }));
    jest.doMock("expo-secure-store", () => ({
      getItemAsync: jest.fn(() => Promise.reject(new Error("fail"))),
      setItemAsync: jest.fn(() => Promise.reject(new Error("fail"))),
    }));
    jest.doMock("react-native", () => ({
      Platform: { OS: "ios" },
    }));
    jest.doMock("react-native-mmkv", () => ({
      createMMKV: jest.fn(),
    }));

    const module = require("../storage") as typeof import("../storage");
    await expect(module.getStorage()).rejects.toThrow("CRITICAL: Secure storage initialization failed. App cannot proceed securely.");

    errorSpy.mockRestore();
  });
});
