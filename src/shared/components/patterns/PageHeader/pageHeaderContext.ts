import { createContext } from 'react';

export interface PageHeaderContextValue {
  count: number | undefined;
  setCount: (count: number | undefined) => void;
}

export const PageHeaderContext = createContext<
  PageHeaderContextValue | undefined
>(undefined);
