import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { queryClient } from "@/api/common/api-provider";
import { secureStorage } from "@/lib/utils/secure-store";
import { clearStorage } from "@/lib/utils/storage";

import { createSelectors } from "../store-utils";
import { type AuthType, getToken, setToken, STORAGE_KEY } from "./utils";

export enum AuthStatus {
  IDLE = "idle",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

interface AuthState {
  userId: string | undefined;
  auth_data: AuthType | null;
  status: AuthStatus;
  signIn: (auth_data: AuthType) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const _useAuth = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        userId: undefined,
        status: AuthStatus.IDLE,
        auth_data: null,
        signIn: async (auth_data) => {
          await setToken(auth_data);
          set({
            userId: auth_data.userId,
            status: AuthStatus.AUTHENTICATED,
            auth_data,
          });
        },
        signOut: async () => {
          await clearStorage(STORAGE_KEY.TOKEN);
          queryClient.clear();
          set({
            userId: undefined,
            status: AuthStatus.UNAUTHENTICATED,
            auth_data: null,
          });
          await secureStorage.removeItem("authState");
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
      }),
      { name: "authState", storage: createJSONStorage(() => secureStorage) },
    ),
  ),
);

export const AuthSelector = (state: AuthState) => state;

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: AuthType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const accessToken = () => _useAuth.getState().auth_data;
