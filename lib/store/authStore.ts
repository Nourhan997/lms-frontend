import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cookieStorage } from "@/lib/store/cookieStorage";
import { AUTH_COOKIE } from "@/lib/auth/shared";
import type { User } from "@/lib/types";

interface AuthState {
  token: string | null;
  user: User | null;

  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;

  // Role selectors
  isAdmin: () => boolean;
  isInstructor: () => boolean;
  isStudent: () => boolean;
}

/**
 * Auth/session state. Persisted to a cookie (key `lms-auth`) — not
 * localStorage — so the session is sent with every request and can be read by
 * edge middleware for route protection. Use this for auth + UI state only;
 * server data belongs in React Query, never here.
 *
 * Outside React (e.g. the axios interceptor), read with
 * `useAuthStore.getState()`.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),

      isAdmin: () => get().user?.role === "admin",
      isInstructor: () => get().user?.role === "instructor",
      isStudent: () => get().user?.role === "student",
    }),
    {
      name: AUTH_COOKIE,
      storage: createJSONStorage(() => cookieStorage),
      // Only persist serializable state, not the action functions.
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
