import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Securely store a value with a key.
 * On web, this falls back to localStorage (not secure), so handle with care.
 */
export async function setSecureItem(key: string, value: string) {
  try {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error setting secure item ${key}:`, error);
    throw error;
  }
}

/**
 * Retrieve a value by key securely.
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(key);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
      return null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Error getting secure item ${key}:`, error);
    return null;
  }
}

/**
 * Remove a value by key securely.
 */
export async function removeSecureItem(key: string) {
  try {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error removing secure item ${key}:`, error);
    throw error;
  }
}

// Specific helpers for Auth Tokens to ensure consistency
const TOKEN_KEY = 'auth_token';

export const saveToken = (token: string) => setSecureItem(TOKEN_KEY, token);
export const getToken = () => getSecureItem(TOKEN_KEY);
export const deleteToken = () => removeSecureItem(TOKEN_KEY);

export const secureStorage = {
  getItem: getSecureItem,
  setItem: setSecureItem,
  removeItem: removeSecureItem,
};
