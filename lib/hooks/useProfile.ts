"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  updateProfile,
  uploadAvatar,
  type ChangePasswordPayload,
  type UpdateProfilePayload,
} from "@/lib/api/profile";
import { useAuthStore } from "@/lib/store/authStore";
import { authKeys } from "@/lib/hooks/useAuth";
import type { ApiError, User } from "@/lib/types";

/** Update the current user's profile; syncs the auth store + `me` cache. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<User, ApiError, UpdateProfilePayload>({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      if (token) setAuth(token, user);
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

export function useChangePassword() {
  return useMutation<void, ApiError, ChangePasswordPayload>({
    mutationFn: changePassword,
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<{ avatar_url: string }, ApiError, File>({
    mutationFn: uploadAvatar,
    onSuccess: ({ avatar_url }) => {
      if (token && user) {
        const updated: User = { ...user, avatar_url };
        setAuth(token, updated);
        queryClient.setQueryData(authKeys.me, updated);
      }
    },
  });
}
