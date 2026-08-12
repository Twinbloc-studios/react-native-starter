import { Env } from '@env';
import axios, {
  type AxiosRequestConfig,
  isAxiosError,
  type Method,
} from 'axios';

import { accessToken, signOut } from '@/store/auth';

import { queryClient } from './api-provider';
import { refreshAuthSession } from './refresh-auth';

// eslint-disable-next-line import/no-named-as-default-member
export const client = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL,
});

export class ApiError<TData = unknown> extends Error {
  constructor(
    public message: string,
    public status?: number,
    public data?: TData,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as unknown;

    const apiErrorMessage =
      typeof responseData === 'string'
        ? responseData
        : (
            responseData as
              { message?: string; error?: string } | null | undefined
          )?.message ||
          (
            responseData as
              { message?: string; error?: string } | null | undefined
          )?.error ||
          error.message ||
          'Request failed';

    return new ApiError(apiErrorMessage, status, responseData, error);
  }

  // For non-axios errors (e.g., network setup issues that don't look like axios errors, though axios usually wraps them)
  console.error('Error executing request:', error);
  const fallbackMessage =
    error instanceof Error && error.message ? error.message : 'Unknown error';
  return new ApiError(fallbackMessage, undefined, undefined, error);
}

// Define a more specific type for the response data if possible, otherwise use generic TResult
export async function executeRest<TResult = unknown, TData = unknown>(
  url: string,
  method: Method,
  data?: TData,
  options?: {
    params?: Record<string, unknown>;
    customToken?: string;
    headers?: Record<string, string>;
    axiosConfig?: Omit<
      AxiosRequestConfig,
      'url' | 'method' | 'data' | 'params' | 'headers' | 'baseURL'
    > & {
      headers?: Record<string, string>;
    };
    ignore401?: boolean; // If true, do not refresh/sign out/clear cache on 401
  },
): Promise<TResult> {
  const buildConfig = (token?: string): AxiosRequestConfig => {
    const { headers: axiosHeaders, ...restAxiosConfig } =
      options?.axiosConfig ?? {};
    const mergedHeaders = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options?.headers || {}),
      ...(axiosHeaders || {}),
    };
    return {
      url,
      method,
      data,
      params: options?.params,
      headers: mergedHeaders,
      ...restAxiosConfig,
    };
  };

  // Performs the request once with a given token.
  const perform = async (token?: string): Promise<TResult> => {
    const response = await client<TResult>(buildConfig(token));
    return response.data;
  };

  const initialToken = options?.customToken || accessToken()?.access;

  try {
    return await perform(initialToken);
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      initialToken &&
      !options?.ignore401
    ) {
      // Try to silently rotate the access token with the stored refresh token.
      const refreshed = await refreshAuthSession();
      if (refreshed) {
        try {
          // Retry the original request once with the rotated token.
          return await perform(accessToken()?.access);
        } catch (retryError) {
          // The rotated token was also rejected — the session is truly invalid.
          if (isAxiosError(retryError) && retryError.response?.status === 401) {
            console.error('Access token rejected after refresh. Signing out.');
            void signOut();
            queryClient.clear(); // Clear React Query/TanStack Query cache if used
          }
          throw toApiError(retryError);
        }
      }
      console.error('Session refresh failed. Signing out.');
      void signOut();
      queryClient.clear(); // Clear React Query/TanStack Query cache if used
    }

    throw toApiError(error);
  }
}
