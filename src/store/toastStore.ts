import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // in ms, 0 = never auto-dismiss
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

/**
 * Global toast notification store
 * Auto-dismisses after duration (default 5000ms)
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = uuidv4();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss if duration > 0
    if (newToast.duration! > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

/**
 * Hook to easily add toasts
 */
export const useToast = () => {
  const { addToast, removeToast } = useToastStore();

  return {
    success: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'success', title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'error', title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'info', title, description, duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'warning', title, description, duration }),
    custom: (toast: Omit<Toast, 'id'>) => addToast(toast),
    remove: removeToast,
  };
};
