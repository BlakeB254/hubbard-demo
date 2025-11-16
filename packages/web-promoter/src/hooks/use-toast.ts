/**
 * Toast notification hook
 * Uses Radix UI Toast for accessible notifications
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto-remove after duration (default 5 seconds)
    const duration = toast.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}));

export function useToast() {
  const { addToast } = useToastStore();

  return {
    toast: addToast,
    success: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, type: 'success', duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, type: 'error', duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, type: 'info', duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ title, description, type: 'warning', duration }),
  };
}
