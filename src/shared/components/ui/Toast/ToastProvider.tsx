import { useState, useCallback, type ReactNode } from 'react';
import { Toast } from './Toast';
import { ToastContext, type ToastData } from './ToastContext';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setExitingIds((prev) => new Set(prev).add(id));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col items-end gap-3"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div key={toast.id}>
            <Toast
              {...toast}
              onClose={removeToast}
              isExiting={exitingIds.has(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
