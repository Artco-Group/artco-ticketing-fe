import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

export interface LoadingOverlayProps {
  isLoading?: boolean;
  message?: string;
  fullScreen?: boolean;
  zIndex?: number;
  children?: ReactNode;
}

export function LoadingOverlay({
  isLoading = true,
  message,
  fullScreen = true,
  zIndex = 9999,
  children,
}: LoadingOverlayProps = {}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    if (isLoading) {
      // Fade in
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      );
    } else {
      // Fade out
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          // Keep overlay mounted but invisible for smooth transitions
        },
      });
    }
  }, [isLoading]);

  // Always render when used as Suspense fallback (isLoading defaults to true)
  // Only hide if explicitly set to false
  if (!isLoading) {
    return null;
  }

  const positionClasses = fullScreen ? 'fixed inset-0' : 'absolute inset-0';

  return (
    <div
      ref={overlayRef}
      className={`${positionClasses} flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity`}
      style={{ zIndex, pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-xl"
      >
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#004179]"></div>
        </div>

        {/* Message */}
        {message && (
          <p className="text-sm font-medium text-gray-700">{message}</p>
        )}

        {/* Custom children */}
        {children}
      </div>
    </div>
  );
}
