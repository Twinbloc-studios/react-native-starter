import { Env } from "@env";
import { type AxiosRequestConfig, isAxiosError, type Method } from "axios";
import axios from "axios";

import { accessToken, signOut } from "@/store/auth";

import { queryClient } from "./api-provider";

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
    this.name = "ApiError";
  }
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
      "url" | "method" | "data" | "params" | "headers" | "baseURL"
    > & {
      headers?: Record<string, string>;
    };
    ignore401?: boolean; // If true, do not sign out/clear cache on 401
  },
): Promise<TResult> {
  const token = options?.customToken || accessToken()?.access;
  const { headers: axiosHeaders, ...restAxiosConfig } =
    options?.axiosConfig ?? {};
  const mergedHeaders = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options?.headers || {}),
    ...(axiosHeaders || {}),
  };

  const config: AxiosRequestConfig = {
    url,
    method,
    data,
    params: options?.params,
    headers: mergedHeaders,
    ...restAxiosConfig,
  };

  try {
    // Assuming your client is the configured axios instance directly
    const response = await client<TResult>(config);
    // Adjust if your API wraps data, e.g., response.data.data
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data as unknown;

      // Handle Unauthorized error (401)
      if (token && status === 401 && !options?.ignore401) {
        console.error("Unauthorized access - 401. Signing out.");
        void signOut();
        queryClient.clear(); // Clear React Query/TanStack Query cache if used
      }

      const apiErrorMessage =
        typeof responseData === "string"
          ? responseData
          : (
              responseData as
                | { message?: string; error?: string }
                | null
                | undefined
            )?.message ||
            (
              responseData as
                | { message?: string; error?: string }
                | null
                | undefined
            )?.error ||
            error.message ||
            "Request failed";

      throw new ApiError(apiErrorMessage, status, responseData, error);
    }

    // For non-axios errors (e.g., network setup issues that don't look like axios errors, though axios usually wraps them)
    console.error("Error executing request:", error);
    const fallbackMessage =
      error instanceof Error && error.message ? error.message : "Unknown error";
    throw new ApiError(fallbackMessage, undefined, undefined, error);
  }
}
