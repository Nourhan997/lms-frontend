"use client";

// Lightweight toast store inspired by the shadcn/ui pattern: a module-level
// reducer with subscribers, exposed through the `useToast` hook and a
// standalone `toast()` function for use outside React (e.g. mutation callbacks).

import * as React from "react";
import type { ToastVariant } from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

export interface ToasterToast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  open: boolean;
}

type Action =
  | { type: "ADD"; toast: ToasterToast }
  | { type: "DISMISS"; id: string }
  | { type: "REMOVE"; id: string };

interface State {
  toasts: ToasterToast[];
}

let memoryState: State = { toasts: [] };
const listeners = new Set<(state: State) => void>();

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "DISMISS":
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, open: false } : t,
        ),
      };
    case "REMOVE":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
  }
}

let count = 0;
function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export function toast(options: ToastOptions) {
  const id = genId();
  dispatch({ type: "ADD", toast: { id, open: true, ...options } });

  // Auto-remove after the visible duration elapses.
  setTimeout(() => dispatch({ type: "REMOVE", id }), TOAST_REMOVE_DELAY);

  return {
    id,
    dismiss: () => dispatch({ type: "DISMISS", id }),
  };
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id: string) => dispatch({ type: "DISMISS", id }),
  };
}
