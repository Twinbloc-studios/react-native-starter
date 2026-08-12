import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { queryClient } from '@/api/common/api-provider';
import { removeSecureItem } from '@/lib/utils/secure-store';

import { createSelectors } from '../store-utils';
import { type AuthType, getToken, removeToken, setToken } from './utils';

export enum AuthStatus {
  IDLE = 'idle',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

interface AuthState {
  userId: string | undefined;
  auth_data: AuthType | null;
  status: AuthStatus;
  signIn: (auth_data: AuthType) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

/**
 * Legacy key written by the previous persist-based implementation, which
 * duplicated the session (including tokens) under a second SecureStore key.
 * The store is in-memory only now — SecureStore holds the session under a
 * single key (`STORAGE_KEY.TOKEN`) and `hydrate` restores it at boot. Every
 * mutation removes this key so storage converges on one source of truth.
 */
const LEGACY_AUTH_STATE_KEY = 'authState';

const _useAuth = create<AuthState>()(
  devtools((set, get) => ({
    userId: undefined,
    status: AuthStatus.IDLE,
    auth_data: null,
    signIn: async (auth_data) => {
      await setToken(auth_data);
      await removeSecureItem(LEGACY_AUTH_STATE_KEY);
      set({
        userId: auth_data.userId,
        status: AuthStatus.AUTHENTICATED,
        auth_data,
      });
    },
    signOut: async () => {
      await removeToken();
      await removeSecureItem(LEGACY_AUTH_STATE_KEY);
      queryClient.clear();
      set({
        userId: undefined,
        status: AuthStatus.UNAUTHENTICATED,
        auth_data: null,
      });
    },
    hydrate: async () => {
      try {
        const userToken = await getToken();
        if (userToken !== null && userToken.access) {
          await get().signIn(userToken);
        } else {
          await get().signOut();
        }
      } catch {
        // catch error here
        // Maybe sign_out user!
      }
    },
  })),
);

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: AuthType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const accessToken = () => _useAuth.getState().auth_data;
