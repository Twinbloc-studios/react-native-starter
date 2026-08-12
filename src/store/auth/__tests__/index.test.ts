import { QueryClient } from '@tanstack/react-query';

import type * as AuthStoreType from '../index';
import type { AuthType } from '../utils';

const AUTH_DATA: AuthType = {
  access: 'access-token-123',
  refresh: 'refresh-token-456',
  userId: 'user-1',
};

// Legacy key from the previous persist-based implementation.
const LEGACY_AUTH_STATE_KEY = 'authState';

type SecureStoreMap = Map<string, string>;

/**
 * Boots a fresh copy of the auth store module with mocked dependencies.
 * Pass `secureStore` to share an in-memory SecureStore across "relaunches".
 */
const setup = (options?: { secureStore?: SecureStoreMap }) => {
  jest.resetModules();

  const secureStore = options?.secureStore ?? new Map<string, string>();
  const secureStoreMock = {
    getItemAsync: jest.fn(async (key: string) => secureStore.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      secureStore.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      secureStore.delete(key);
    }),
  };

  const queryClient = new QueryClient();
  const clearSpy = jest.spyOn(queryClient, 'clear');

  jest.doMock('@/api/common/api-provider', () => ({ queryClient }));
  jest.doMock('expo-secure-store', () => secureStoreMock);
  jest.doMock('react-native', () => ({ Platform: { OS: 'ios' } }));

  const auth = require('../index') as typeof AuthStoreType;
  const { STORAGE_KEY } = require('../utils');

  return { auth, clearSpy, secureStore, secureStoreMock, STORAGE_KEY };
};

describe('auth store', () => {
  it('signs in, marks the session authenticated, and persists the token to SecureStore', async () => {
    const { auth, secureStoreMock, STORAGE_KEY } = setup();

    await auth.signIn(AUTH_DATA);

    const state = auth.useAuth.getState();
    expect(state.status).toBe(auth.AuthStatus.AUTHENTICATED);
    expect(state.userId).toBe(AUTH_DATA.userId);
    expect(state.auth_data).toEqual(AUTH_DATA);
    expect(secureStoreMock.setItemAsync).toHaveBeenCalledWith(
      STORAGE_KEY.TOKEN,
      JSON.stringify(AUTH_DATA),
    );
  });

  it('keeps a single source of truth: signs in without duplicating state to the legacy authState key', async () => {
    const { auth, secureStore, secureStoreMock, STORAGE_KEY } = setup();

    await auth.signIn(AUTH_DATA);

    // The store is in-memory; SecureStore only holds the TOKEN payload.
    expect(secureStoreMock.setItemAsync).not.toHaveBeenCalledWith(
      LEGACY_AUTH_STATE_KEY,
      expect.any(String),
    );
    expect(Array.from(secureStore.keys())).toEqual([STORAGE_KEY.TOKEN]);
  });

  it('removes a legacy authState key on sign in (upgrade path)', async () => {
    const { auth, secureStore, secureStoreMock, STORAGE_KEY } = setup();
    // Simulate an install upgraded from the persist-based implementation.
    secureStore.set(
      LEGACY_AUTH_STATE_KEY,
      JSON.stringify({ state: { status: 'authenticated' }, version: 0 }),
    );

    await auth.signIn(AUTH_DATA);

    expect(secureStoreMock.deleteItemAsync).toHaveBeenCalledWith(
      LEGACY_AUTH_STATE_KEY,
    );
    expect(Array.from(secureStore.keys())).toEqual([STORAGE_KEY.TOKEN]);
  });

  it('signs out, removes the token from SecureStore, and clears the query cache', async () => {
    const { auth, secureStoreMock, clearSpy, STORAGE_KEY } = setup();
    await auth.signIn(AUTH_DATA);

    clearSpy.mockClear();
    await auth.signOut();

    const state = auth.useAuth.getState();
    expect(state.status).toBe(auth.AuthStatus.UNAUTHENTICATED);
    expect(state.userId).toBeUndefined();
    expect(state.auth_data).toBeNull();

    // The token lives in SecureStore (not MMKV), so it must be deleted there.
    expect(secureStoreMock.deleteItemAsync).toHaveBeenCalledWith(
      STORAGE_KEY.TOKEN,
    );
    expect(secureStoreMock.deleteItemAsync).toHaveBeenCalledWith(
      LEGACY_AUTH_STATE_KEY,
    );
    expect(clearSpy).toHaveBeenCalled();
  });

  it('hydrates an authenticated session when a token is stored', async () => {
    const { auth, secureStore, secureStoreMock, STORAGE_KEY } = setup();
    secureStore.set(STORAGE_KEY.TOKEN, JSON.stringify(AUTH_DATA));

    await auth.hydrateAuth();

    expect(secureStoreMock.getItemAsync).toHaveBeenCalledWith(
      STORAGE_KEY.TOKEN,
    );
    const state = auth.useAuth.getState();
    expect(state.status).toBe(auth.AuthStatus.AUTHENTICATED);
    expect(state.userId).toBe(AUTH_DATA.userId);
    expect(state.auth_data).toEqual(AUTH_DATA);
  });

  it('hydrates to unauthenticated when no token is stored', async () => {
    const { auth, clearSpy, secureStoreMock, STORAGE_KEY } = setup();

    await auth.hydrateAuth();

    expect(secureStoreMock.getItemAsync).toHaveBeenCalledWith(
      STORAGE_KEY.TOKEN,
    );
    expect(auth.useAuth.getState().status).toBe(
      auth.AuthStatus.UNAUTHENTICATED,
    );
    expect(clearSpy).toHaveBeenCalled();
  });

  it('keeps the session across relaunches and fully clears it on sign out', async () => {
    const secureStore = new Map<string, string>();

    const firstRun = setup({ secureStore });
    await firstRun.auth.signIn(AUTH_DATA);

    // Simulate an app relaunch: fresh modules over the same secure store.
    const secondRun = setup({ secureStore });
    await secondRun.auth.hydrateAuth();
    expect(secondRun.auth.useAuth.getState().status).toBe(
      secondRun.auth.AuthStatus.AUTHENTICATED,
    );

    await secondRun.auth.signOut();
    expect(secureStore.has(secondRun.STORAGE_KEY.TOKEN)).toBe(false);
    expect(secondRun.auth.useAuth.getState().status).toBe(
      secondRun.auth.AuthStatus.UNAUTHENTICATED,
    );
  });
});
