import { useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { PageHeaderContext } from './pageHeaderContext';

interface PageHeaderProviderProps {
  children: ReactNode;
}

export function PageHeaderProvider({ children }: PageHeaderProviderProps) {
  const [count, setCountState] = useState<number | undefined>(undefined);

  const setCount = useCallback((newCount: number | undefined) => {
    setCountState(newCount);
  }, []);

  const value = useMemo(() => ({ count, setCount }), [count, setCount]);

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}
