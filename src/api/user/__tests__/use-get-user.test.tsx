import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '@/store/auth';

import { executeRest } from '../../common';
import { useGetUser } from '../use-get-user';

const mockExecuteRest = jest.mocked(executeRest);
const mockUseAuth = jest.mocked(useAuth);

// Mock factories define their own jest.fn()s (referencing top-level consts
// would hit the TDZ — the mocked module is first required during the hoisted
// import phase). Import the mocked modules to get handles on those fns.
jest.mock('@/store/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../common', () => ({
  ApiError: class ApiError extends Error {},
  executeRest: jest.fn(),
  QueryKey: { USER: 'user' },
}));

const USER = { id: 'u1', username: 'tester', email: 't@test.dev' };

// One stable client per suite — recreating it per render would drop the
// query's resolved state whenever the provider re-renders.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGetUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('does not fetch when the user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ auth_data: null });

    const { result } = renderHook(() => useGetUser(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockExecuteRest).not.toHaveBeenCalled();
  });

  it('fetches the current user when authenticated', async () => {
    mockUseAuth.mockReturnValue({
      auth_data: { access: 'token' },
    });
    mockExecuteRest.mockResolvedValue({ data: USER });

    const { result } = renderHook(() => useGetUser(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(USER);
    expect(mockExecuteRest).toHaveBeenCalledWith('auth/me', 'GET');
  });

  it('marks the result as the current user when ids match', async () => {
    mockUseAuth.mockReturnValue({
      auth_data: { access: 'token' },
    });
    mockExecuteRest.mockResolvedValue({ data: USER });

    const { result } = renderHook(() => useGetUser('u1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isCurrentUser).toBe(true);
  });

  it('does not mark the result as the current user when ids differ', async () => {
    mockUseAuth.mockReturnValue({
      auth_data: { access: 'token' },
    });
    mockExecuteRest.mockResolvedValue({ data: USER });

    const { result } = renderHook(() => useGetUser('other-id'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isCurrentUser).toBe(false);
  });

  it('surfaces errors from the API', async () => {
    mockUseAuth.mockReturnValue({
      auth_data: { access: 'token' },
    });
    mockExecuteRest.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useGetUser(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
