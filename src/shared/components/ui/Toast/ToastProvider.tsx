import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { Toast } from './Toast';
import { ToastContext, type ToastData } from './ToastContext';
import { TOAST_EVENT, type ToastEventDetail } from './toast-events';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const addToast = useCallback((toastData: Omit<ToastData, 'id'>) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { ...toastData, id }]);
    return id;
  }, []);

  const addToastRef = useRef(addToast);

  // Keep ref in sync with latest addToast
  useEffect(() => {
    addToastRef.current = addToast;
  }, [addToast]);

  // Listen for toast events from outside React (e.g., axios interceptors)
  useEffect(() => {
    const handleToastEvent = (event: CustomEvent<ToastEventDetail>) => {
      addToastRef.current(event.detail);
    };

    window.addEventListener(TOAST_EVENT, handleToastEvent);
    return () => window.removeEventListener(TOAST_EVENT, handleToastEvent);
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
