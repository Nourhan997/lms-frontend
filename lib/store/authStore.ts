import { create } from "zustand";
import { persist } from "zustand/middleware";
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
 * Auth/session state. Persisted to localStorage so the session survives
 * reloads. Use this for auth + UI state only — server data belongs in
 * React Query, never here.
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
      name: "lms-auth",
      // Only persist serializable state, not the action functions.
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
