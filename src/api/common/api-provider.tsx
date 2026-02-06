import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { type AsyncStorage } from "@tanstack/query-persist-client-core";
import { QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client";
import * as React from "react";

import { mmkvStorage } from "@/lib/utils/storage";
import { STORAGE_KEY } from "@/store/auth/utils";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const queryStorage: AsyncStorage<string> = {
  getItem: (key) => mmkvStorage.getItem(key),
  setItem: (key, value) => mmkvStorage.setItem(key, value),
  removeItem: (key) => mmkvStorage.removeItem(key),
};

export const clientPersister = createAsyncStoragePersister({
  storage: queryStorage,
  key: STORAGE_KEY.API_TOKEN,
  deserialize: JSON.parse,
  retry: removeOldestQuery,
  serialize: JSON.stringify,
  throttleTime: 1000,
});

/*
If persistence size becomes a problem, add compression:

import { compress, decompress } from "lz-string";

export const clientPersister = createAsyncStoragePersister({
  storage: queryStorage,
  key: STORAGE_KEY.API_TOKEN,
  serialize: (client) => compress(JSON.stringify(client)),
  deserialize: (cachedString) => JSON.parse(decompress(cachedString) ?? ""),
  throttleTime: 1000,
  retry: removeOldestQuery,
});
*/

export function APIProvider({ children }: { children: React.ReactNode }) {
  useReactQueryDevTools(queryClient);
  return (
    // Provide the client to your App
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: clientPersister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
