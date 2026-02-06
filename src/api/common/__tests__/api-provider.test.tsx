import React from "react";

import type * as ApiProviderType from "../api-provider";

const mockUseReactQueryDevTools = jest.fn();
const mockCreateAsyncStoragePersister = jest.fn((config) => ({ config }));
const mockPersistProvider = jest.fn(({ children }) => <>{children}</>);
const mockRemoveOldestQuery = jest.fn();

const mockMmkvStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock("@dev-plugins/react-query", () => ({
  useReactQueryDevTools: mockUseReactQueryDevTools,
}));

jest.mock("@tanstack/query-async-storage-persister", () => ({
  createAsyncStoragePersister: mockCreateAsyncStoragePersister,
}));

jest.mock("@tanstack/react-query-persist-client", () => ({
  PersistQueryClientProvider: mockPersistProvider,
  removeOldestQuery: mockRemoveOldestQuery,
}));

jest.mock("@/lib/utils/storage", () => ({
  mmkvStorage: mockMmkvStorage,
}));

jest.mock("@/store/auth/utils", () => ({
  STORAGE_KEY: {
    API_TOKEN: "API_TOKEN",
  },
}));

describe("api-provider", () => {
  beforeEach(() => {
    jest.resetModules();
    mockUseReactQueryDevTools.mockReset();
    mockCreateAsyncStoragePersister.mockReset();
    mockPersistProvider.mockReset();
    mockRemoveOldestQuery.mockReset();
    mockMmkvStorage.getItem.mockReset();
    mockMmkvStorage.setItem.mockReset();
    mockMmkvStorage.removeItem.mockReset();
    mockCreateAsyncStoragePersister.mockImplementation((config) => ({
      config,
    }));
  });

  const loadApiProvider = () => {
    let module: typeof ApiProviderType;
    jest.isolateModules(() => {
      module = require("../api-provider");
    });
    return module!;
  };

  it("configures persister with storage and key", () => {
    const { clientPersister } = loadApiProvider();
    const config = mockCreateAsyncStoragePersister.mock.calls[0]?.[0];

    expect(mockCreateAsyncStoragePersister).toHaveBeenCalled();
    expect(clientPersister).toBeDefined();
    expect(config.key).toBe("API_TOKEN");
    expect(typeof config.serialize).toBe("function");
    expect(typeof config.deserialize).toBe("function");
    expect(config.retry).toBe(mockRemoveOldestQuery);
  });

  it("binds storage helpers to mmkvStorage", () => {
    loadApiProvider();
    const config = mockCreateAsyncStoragePersister.mock.calls[0]?.[0];
    const storage = config.storage;

    storage.getItem("key");
    storage.setItem("key", "value");
    storage.removeItem("key");

    expect(mockMmkvStorage.getItem).toHaveBeenCalledWith("key");
    expect(mockMmkvStorage.setItem).toHaveBeenCalledWith("key", "value");
    expect(mockMmkvStorage.removeItem).toHaveBeenCalledWith("key");
  });
});
