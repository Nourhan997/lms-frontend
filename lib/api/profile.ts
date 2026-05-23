import { apiClient } from "@/lib/api/client";
import type { Locale, User } from "@/lib/types";

export interface UpdateProfilePayload {
  name: string;
  bio: string;
  preferred_language: Locale;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const { data } = await apiClient.patch<User>("/profile", payload);
  return data;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await apiClient.post("/profile/password", payload);
}

export interface AvatarResponse {
  avatar_url: string;
}

export async function uploadAvatar(file: File): Promise<AvatarResponse> {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await apiClient.post<AvatarResponse>(
    "/profile/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}
