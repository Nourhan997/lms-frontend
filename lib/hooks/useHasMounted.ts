"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted on the client. Use to gate
 * UI that depends on client-only state (e.g. the persisted auth store) so the
 * first client render matches the server HTML and avoids hydration mismatches.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
