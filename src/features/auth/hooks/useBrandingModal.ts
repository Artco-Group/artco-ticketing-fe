import { useEffect, useState } from 'react';

/**
 * Custom hook for branding modal state and responsive behavior.
 * Handles viewport size detection, modal visibility, and close animation.
 */
export function useBrandingModal(breakpoint = 968) {
  const [showBrandingModal, setShowBrandingModal] = useState(true);
  const [isNarrowViewport, setIsNarrowViewport] = useState(
    () => window.innerWidth < breakpoint
  );
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrowViewport(window.innerWidth < breakpoint);
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
    isNarrowViewport,
    isClosing,
    closeBrandingModal,
  };
}
