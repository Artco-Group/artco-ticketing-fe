import { useEffect, useRef } from 'react';

/**
 * Custom hook for auto-scrolling a container to bottom when dependencies change.
 * Useful for chat/comment threads where new content appears at the bottom.
 *
 * @param dependency - Value that triggers scroll when changed (e.g., comments array)
 * @returns Ref to attach to the scrollable container
 */
export function useAutoScroll<T>(dependency: T) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [dependency]);

  return containerRef;
}
