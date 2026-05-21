import axios, { AxiosError, type AxiosInstance } from "axios";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiError } from "@/lib/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL && process.env.NODE_ENV !== "production") {
  // Surface misconfiguration early in dev rather than failing at request time.
  console.warn(
    "[api] NEXT_PUBLIC_API_URL is not set. Configure it in .env.local.",
  );
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Request interceptor — attach the bearer token from the auth store.
 * Reads via getState() so it works outside the React tree.
 */
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor — normalize errors and handle expired sessions.
 *  - 401: clear the auth store and redirect to /login (browser only).
 *  - any error: reject with a consistent {@link ApiError} shape.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const status = error.response?.status ?? 0;

    if (status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().clearAuth();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    const apiError: ApiError = {
      status,
      message:
        error.response?.data?.message ??
        error.message ??
        "An unexpected error occurred.",
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  },
);
