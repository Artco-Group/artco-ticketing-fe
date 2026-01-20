import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { toast } from 'sonner';
import { useLogin } from '../api/auth-api';
import { useAuth } from '../context';
import type { AxiosError } from 'axios';
import { ROUTES } from '@/app/routes/constants';

interface ApiErrorResponse {
  message?: string;
}

export function LoginForm() {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Use replace to prevent back navigation to login page
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Right panel animations
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
        );
      }

      const formGroups = document.querySelectorAll('.form-group');
      if (formGroups.length > 0) {
        gsap.fromTo(
          formGroups,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.4,
            ease: 'power3.out',
            stagger: 0.1,
          }
        );
      }

      // Only animate form-options if element exists
      const formOptions = document.querySelector('.form-options');
      if (formOptions) {
        gsap.fromTo(
          formOptions,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.7, ease: 'power2.out' }
        );
      }

      const submitBtn = document.querySelector('.submit-btn');
      if (submitBtn) {
        gsap.fromTo(
          submitBtn,
          { opacity: 0, y: 15, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: 0.8,
            ease: 'back.out(1.7)',
          }
        );
      }

      const loginLinks = document.querySelector('.login-links');
      if (loginLinks) {
        gsap.fromTo(
          loginLinks,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 1, ease: 'power2.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success('Uspešno ste se prijavili');
      // Navigation will happen automatically via useEffect when isAuthenticated becomes true
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || 'Greška pri prijavljivanju';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div ref={formRef}>
      <div ref={titleRef}>
        <h2 className="max-smx:text-[26px] mb-2 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
          Prijavite se
        </h2>
        <p className="max-smx:text-[14px] max-smx:mb-6 mb-8 text-[16px] leading-normal text-[#6b7280]">
          Dobrodošli nazad. Molimo unesite vaše podatke.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-5">
          <label
            className="mb-2 block text-[14px] font-medium text-[#374151]"
            htmlFor="email"
          >
            Email adresa
          </label>
          <div className="relative flex items-center focus-within:text-[#004179]">
            <svg
              className="pointer-events-none absolute left-3.5 z-1 text-[#9ca3af] transition-colors duration-200 ease-in-out"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="max-smx:py-3 max-smx:px-4 max-smx:text-[14px] box-border w-full rounded-[10px] border border-solid border-[#e5e7eb] bg-white px-4 py-3.5 pl-11.5 text-[15px] text-[#111827] transition-all duration-300 ease-in-out placeholder:text-[#9ca3af] focus:border-[#004179] focus:shadow-[0_0_0_3px_rgba(0,65,121,0.1)] focus:outline-none"
              placeholder="vase.ime@kompanija.ba"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group relative mb-5">
          <label
            className="mb-2 block text-[14px] font-medium text-[#374151]"
            htmlFor="password"
          >
            Lozinka
          </label>
          <div className="relative flex items-center focus-within:text-[#004179]">
            <svg
              className="pointer-events-none absolute left-3.5 z-1 text-[#9ca3af] transition-colors duration-200 ease-in-out"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="max-smx:py-3 max-smx:px-4 max-smx:text-[14px] box-border w-full rounded-[10px] border border-solid border-[#e5e7eb] bg-white px-4 py-3.5 pl-11.5 text-[15px] text-[#111827] transition-all duration-300 ease-in-out focus:border-[#004179] focus:shadow-[0_0_0_3px_rgba(0,65,121,0.1)] focus:outline-none"
              placeholder="Unesite vašu lozinku"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 bottom-3.5 flex cursor-pointer items-center justify-center bg-none p-0 text-[#9ca3af] transition-colors duration-200 ease-in-out hover:text-[#374151] focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="form-group max-smx:flex-col max-smx:items-start max-smx:gap-3 mb-6 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              autoComplete="off"
              className="checkbox-input"
            />
            <span className="text-[14px] text-[#4b5563]">Zapamti me</span>
          </label>
          <Link
            to={ROUTES.AUTH.FORGOT_PASSWORD}
            className="decoration-none text-[14px] font-medium text-[#004179] transition-colors duration-200 ease-in-out hover:text-[#003366] hover:underline"
          >
            Zaboravljena lozinka?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="submit-btn max-smx:py-3 max-smx:px-4 max-smx:text-[14px] from[#003366] foucus:shadow-[0_0_0_3px_rgba(0,65,121,0.3)] flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-linear-to-br from-[#004179] to-[#002244] px-5 py-4 text-[16px] font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:transform hover:bg-linear-to-br hover:shadow-[0_6px_20px_rgba(0,65,121,0.35)] focus:outline-none active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>
            {loginMutation.isPending ? 'Prijavljivanje...' : 'Prijavite se'}
          </span>
          <svg
            className="transition-transform duration-300 ease-in-out hover:translate-x-1"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>

      <div className="login-links mt-7 text-center">
        <p className="m-0 text-[14px] text-[#6b7280]">
          Nemate račun?{' '}
          <a
            href="https://www.artcogroup.ba/page/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="decoration-none font-medium text-[#004179] transition-colors duration-200 ease-in-out hover:text-[#003366] hover:underline"
          >
            Kontaktirajte administratora
          </a>
        </p>
      </div>
    </div>
  );
}
