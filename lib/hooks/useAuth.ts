"use client";

import { useRouter } from "next/navigation";
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
import { dashboardPathForRole } from "@/lib/auth/shared";
import type { ApiError, User } from "@/lib/types";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/**
 * Current authenticated user. Fetches `/auth/me`, enabled only when a token is
 * present so it never fires for anonymous visitors.
 */
export function useMe() {
  const token = useAuthStore((s) => s.token);
  return useQuery<User, ApiError>({
    queryKey: authKeys.me,
    queryFn: fetchCurrentUser,
    enabled: Boolean(token),
  });
}

// Backwards-compatible alias.
export const useCurrentUser = useMe;

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Awaited<ReturnType<typeof login>>, ApiError, LoginPayload>({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      setAuth(token, user);
      queryClient.setQueryData(authKeys.me, user);
      // Route by role: admin → /admin, instructor → /instructor, else /dashboard.
      router.replace(dashboardPathForRole(user.role));
      router.refresh();
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    Awaited<ReturnType<typeof register>>,
    ApiError,
    RegisterPayload
  >({
    mutationFn: register,
    onSuccess: ({ token, user }) => {
      setAuth(token, user);
      queryClient.setQueryData(authKeys.me, user);
      // New accounts are students → /dashboard (role-derived for safety).
      router.replace(dashboardPathForRole(user.role));
      router.refresh();
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, ApiError, void>({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });
}
