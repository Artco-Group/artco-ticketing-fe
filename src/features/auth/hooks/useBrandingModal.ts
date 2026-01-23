import { useEffect, useState } from 'react';

/**
 * Custom hook for branding modal state and responsive behavior.
 * Handles mobile detection, modal visibility, and close animation.
 */
export function useBrandingModal(breakpoint = 968) {
  const [showBrandingModal, setShowBrandingModal] = useState(true);
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint
  );
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  const closeBrandingModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowBrandingModal(false);
      setIsClosing(false);
    }, 300);
  };

  return {
    showBrandingModal,
    isMobile,
    isClosing,
    closeBrandingModal,
  };
}
