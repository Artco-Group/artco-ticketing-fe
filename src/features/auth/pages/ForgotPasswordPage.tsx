import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { AuthLayout } from '../components/AuthLayout';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

function ForgotPasswordPage() {
  const location = useLocation();
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate form in when page loads or when navigating from login
    if (formContainerRef.current) {
      gsap.fromTo(
        formContainerRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [location.key]);

  return (
    <AuthLayout>
      <div ref={formContainerRef}>
        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
