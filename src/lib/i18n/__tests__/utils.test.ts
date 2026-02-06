import type * as I18nUtilsType from "../utils";

type SetupOptions = {
  platform: "ios" | "android" | "web";
  appOwnership: "expo" | "standalone";
  dev: boolean;
  dirReturn: "rtl" | "ltr";
};

const setup = (options: SetupOptions) => {
  jest.resetModules();
  (global as typeof globalThis & { __DEV__?: boolean }).__DEV__ = options.dev;

  const storageInstance = { set: jest.fn(), getString: jest.fn() };
  const mockChangeLanguage = jest.fn();
  const mockDir = jest.fn(() => options.dirReturn);
  const mockT = jest.fn();
  const mockAllowRTL = jest.fn();
  const mockForceRTL = jest.fn();
  const mockReload = jest.fn();
  const mockRestart = jest.fn();

  jest.doMock("i18next", () => ({
    changeLanguage: mockChangeLanguage,
    dir: mockDir,
    t: mockT,
  }));
  jest.doMock("react-native", () => ({
    I18nManager: { allowRTL: mockAllowRTL, forceRTL: mockForceRTL },
    NativeModules: { DevSettings: { reload: mockReload } },
    Platform: { OS: options.platform },
  }));
  jest.doMock("react-native-restart", () => ({
    __esModule: true,
    default: { restart: mockRestart },
  }));
  jest.doMock("expo-constants", () => ({
    appOwnership: options.appOwnership,
  }));
  jest.doMock("react-native-mmkv", () => ({
    useMMKVString: jest.fn(() => [undefined, jest.fn()]),
  }));
  jest.doMock("@/store/auth/utils", () => ({
    STORAGE_KEY: {
      LOCAL: "LOCAL",
    },
  }));
  jest.doMock("../../utils/storage", () => ({
    storageInstance,
  }));

  const module = require("../utils") as typeof I18nUtilsType;
  return {
    module,
    storageInstance,
    mockChangeLanguage,
    mockAllowRTL,
    mockForceRTL,
    mockReload,
    mockRestart,
  };
};

describe("i18n utils", () => {
  it("stores language and reloads in dev native", () => {
    const {
      module,
      storageInstance,
      mockChangeLanguage,
      mockAllowRTL,
      mockForceRTL,
      mockReload,
      mockRestart,
    } = setup({
      platform: "ios",
      appOwnership: "expo",
      dev: true,
      dirReturn: "rtl",
    });

    module.changeLanguage("ar");

    expect(storageInstance.set).toHaveBeenCalledWith(module.LOCAL, "ar");
    expect(mockChangeLanguage).toHaveBeenCalledWith("ar");
    expect(mockAllowRTL).toHaveBeenCalledWith(true);
    expect(mockForceRTL).toHaveBeenCalledWith(true);
    expect(mockReload).toHaveBeenCalled();
    expect(mockRestart).not.toHaveBeenCalled();
  });

  it("restarts in native production when not Expo Go", () => {
    const { module, mockReload, mockRestart } = setup({
      platform: "android",
      appOwnership: "standalone",
      dev: false,
      dirReturn: "ltr",
    });

    module.changeLanguage("en");

    expect(mockRestart).toHaveBeenCalled();
    expect(mockReload).not.toHaveBeenCalled();
  });

  it("skips restart in Expo Go production", () => {
    const { module, mockRestart } = setup({
      platform: "android",
      appOwnership: "expo",
      dev: false,
      dirReturn: "ltr",
    });

    module.changeLanguage("en");

    expect(mockRestart).not.toHaveBeenCalled();
  });

  it("reloads on web", () => {
    const reload = jest.fn();
    global.window = { location: { reload } } as unknown as Window &
      typeof globalThis;

    const { module } = setup({
      platform: "web",
      appOwnership: "expo",
      dev: false,
      dirReturn: "ltr",
    });

    module.changeLanguage("en");

    expect(reload).toHaveBeenCalled();
  });
});
