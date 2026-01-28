import { useContext, useCallback } from 'react';
import { ToastContext, type ToastData } from './ToastContext';
import type { ToastType } from './Toast';

export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  icon?: ToastData['icon'];
}

export interface ToastActions {
  success: (options: ToastOptions | string) => string;
  error: (options: ToastOptions | string) => string;
  warning: (options: ToastOptions | string) => string;
  info: (options: ToastOptions | string) => string;
  dismiss: (id: string) => void;
}

export function useToast(): ToastActions {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const { addToast, removeToast } = context;

  const createToast = useCallback(
    (type: ToastType) =>
      (options: ToastOptions | string): string => {
        const toastData =
          typeof options === 'string'
            ? { title: options, type }
            : { ...options, type };

        return addToast(toastData);
      },
    [addToast]
  );

  return {
    success: createToast('success'),
    error: createToast('error'),
    warning: createToast('warning'),
    info: createToast('info'),
    dismiss: removeToast,
  };
}
