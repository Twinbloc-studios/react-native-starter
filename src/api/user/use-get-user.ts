import { type AxiosError } from "axios";
import { createQuery, type QueryHookResult } from "react-query-kit";

import { signOut, useAuth } from "@/store/auth";

import { executeRest, QueryKey } from "../common";
import { type TUser } from "./types";

type Response = TUser;
const _useGetUser = createQuery<Response, void, AxiosError>({
  queryKey: [QueryKey.USER],
  fetcher: async () => {
    return executeRest<{ data: TUser }>("auth/me", "GET")
      .then((response) => {
        return response?.data;
      })
      .catch(async (error) => {
        //SiGN USER OUT IF UNAUTHORIZED
        if (error.status >= 400 && error?.status < 500) {
          await signOut();
        }
        return error;
      });
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
): QueryHookResult<TUser, AxiosError<unknown, unknown>> & {
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
