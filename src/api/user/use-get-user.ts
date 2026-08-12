import { createQuery, type QueryHookResult } from 'react-query-kit';

import { useAuth } from '@/store/auth';

import { type ApiError, executeRest, QueryKey } from '../common';
import { type TUser } from './types';

type Response = TUser;
const _useGetUser = createQuery<Response, void, ApiError>({
  queryKey: [QueryKey.USER],
  fetcher: async () => {
    const response = await executeRest<{ data: TUser }>('auth/me', 'GET');
    return response?.data;
  },
  staleTime: 0, // Always refetch
  gcTime: 0,
  refetchOnMount: true,
  retry: false,
});

// Custom hook that uses reactive auth state for enabled condition
// Example usage:
// const { data: user, isLoading } = useGetUser();
// const { data: user, isCurrentUser } = useGetUser("some-user-id");
export const useGetUser = (
  userId?: string,
): QueryHookResult<TUser, ApiError> & {
  isCurrentUser?: boolean;
} => {
  const { auth_data } = useAuth();
  const userQuery = _useGetUser({
    enabled: !!auth_data?.access,
  });

  if (userId) {
    return {
      isCurrentUser: userQuery.data?.id === userId,
      ...userQuery,
    };
  }

  return userQuery;
};
