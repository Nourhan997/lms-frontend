import type { StateStorage } from "zustand/middleware";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * A `StateStorage` backed by `document.cookie` so persisted auth state is sent
 * with every request and is therefore readable by edge middleware (which has
 * no access to localStorage). No-ops on the server, where `document` is absent.
 */
export const cookieStorage: StateStorage = {
  getItem: (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${name}=([^;]*)`),
    );
    return match ? decodeURIComponent(match[1]) : null;
  },
  setItem: (name, value) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=${encodeURIComponent(
      value,
    )}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
  },
  removeItem: (name) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
  },
};
