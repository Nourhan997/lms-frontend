"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCurrentUser,
  login,
  logout,
  register,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiError, User } from "@/lib/types";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/** Current authenticated user, fetched only when a token is present. */
export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);
  return useQuery<User, ApiError>({
    queryKey: authKeys.me,
    queryFn: fetchCurrentUser,
    enabled: Boolean(token),
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof login>>, ApiError, LoginPayload>({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      setAuth(token, user);
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof register>>,
    ApiError,
    RegisterPayload
  >({
    mutationFn: register,
    onSuccess: ({ token, user }) => {
      setAuth(token, user);
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, void>({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}
