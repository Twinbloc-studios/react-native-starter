import { Env } from '@env';
import axios from 'axios';

import { accessToken, signIn } from '@/store/auth';

type RefreshResponse = {
  access?: string;
  refresh?: string;
  access_token?: string;
  refresh_token?: string;
  token?: string;
};

/**
 * Extract the token pair from a refresh response. Backends vary in shape:
 * `{ access, refresh }`, `{ access_token, refresh_token }`, or a bare
 * `{ token }` (in which case the existing refresh token is kept).
 */
function extractTokens(
  data: unknown,
): { access: string; refresh?: string } | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const d = data as RefreshResponse;
  const access = d.access ?? d.access_token ?? d.token;
  if (typeof access !== 'string' || access.length === 0) {
    return null;
  }
  const refresh = d.refresh ?? d.refresh_token;
  return {
    access,
    refresh:
      typeof refresh === 'string' && refresh.length > 0 ? refresh : undefined,
  };
}

let inFlightRefresh: Promise<boolean> | null = null;

/**
 * Silently rotate the access token using the stored refresh token.
 *
 * Single-flight: concurrent 401s (e.g. parallel queries) share one refresh
 * request instead of hammering the endpoint, and each caller awaits the same
 * promise. Returns `true` when the session was rotated successfully.
 */
export function refreshAuthSession(): Promise<boolean> {
  if (!inFlightRefresh) {
    inFlightRefresh = performRefresh().finally(() => {
      inFlightRefresh = null;
    });
  }
  return inFlightRefresh;
}

async function performRefresh(): Promise<boolean> {
  const session = accessToken();
  if (!session?.refresh) {
    return false;
  }
  try {
    const { data } = await axios.post<unknown>(Env.EXPO_PUBLIC_REFRESH_URL, {
      refresh: session.refresh,
    });
    const tokens = extractTokens(data);
    if (!tokens?.access) {
      return false;
    }
    await signIn({
      access: tokens.access,
      refresh: tokens.refresh ?? session.refresh,
      userId: session.userId,
    });
    return true;
  } catch (error) {
    console.error('Failed to refresh auth session:', error);
    return false;
  }
}
