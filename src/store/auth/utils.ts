import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from '@/lib/utils/secure-store';

export enum STORAGE_KEY {
  IS_FIRST_TIME = 'IS_FIRST_TIME',
  TOKEN = 'TOKEN',
  API_TOKEN = 'API_TOKEN',
  SELECTED_THEME = 'SELECTED_THEME',
  LOCAL = 'LOCAL',
}

export type AuthType = {
  access: string;
  refresh: string;
  userId: string;
};

export const getToken = async (): Promise<AuthType | null> => {
  const token = await getSecureItem(STORAGE_KEY.TOKEN);
  return token ? JSON.parse(token) : null;
};

export const removeToken = async () =>
  await removeSecureItem(STORAGE_KEY.TOKEN);

export const setToken = async (value: AuthType) => {
  await setSecureItem(STORAGE_KEY.TOKEN, JSON.stringify(value));
};
