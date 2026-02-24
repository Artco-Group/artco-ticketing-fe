import { useState, useEffect } from 'react';

const DEFAULT_BREAKPOINT = 1024;

export function useResponsiveCollapse(breakpoint: number = DEFAULT_BREAKPOINT) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < breakpoint) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return { collapsed, setCollapsed };
}
