import { useContext } from 'react';
import { PageHeaderContext } from './pageHeaderContext';

export function usePageHeaderContext() {
  const context = useContext(PageHeaderContext);
  if (context === undefined) {
    throw new Error(
      'usePageHeaderContext must be used within a PageHeaderProvider'
    );
  }
  return context;
}
