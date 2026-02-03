import type { ToastData } from './ToastContext';

export const TOAST_EVENT = 'app-toast' as const;

export type ToastEventDetail = Omit<ToastData, 'id'>;

declare global {
  interface WindowEventMap {
    [TOAST_EVENT]: CustomEvent<ToastEventDetail>;
  }
}

/**
 * Dispatch a toast event from anywhere (including outside React).
 * ToastProvider will pick this up and display the toast.
 */
export const toast = {
  success: (title: string, message?: string) =>
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, {
        detail: { type: 'success', title, message },
      })
    ),
  error: (title: string, message?: string) =>
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, {
        detail: { type: 'error', title, message },
      })
    ),
  warning: (title: string, message?: string) =>
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, {
        detail: { type: 'warning', title, message },
      })
    ),
  info: (title: string, message?: string) =>
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, { detail: { type: 'info', title, message } })
    ),
};
