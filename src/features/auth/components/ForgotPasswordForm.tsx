import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { toast } from 'sonner';
import { useForgotPassword } from '../api/auth-api';
import type { AxiosError } from 'axios';
import { PAGE_ROUTES } from '@artco-group/artco-ticketing-sync/constants';
import { forgotPasswordSchema } from '@artco-group/artco-ticketing-sync/validations';
import type { ForgotPasswordFormData } from '@artco-group/artco-ticketing-sync/types';
import { extractErrorMessage } from '@artco-group/artco-ticketing-sync/errors';

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Right panel animations
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.form-group',
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

      gsap.fromTo(
        '.submit-btn',
        { opacity: 0, y: 15, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: 0.6,
          ease: 'back.out(1.7)',
        }
      );

      gsap.fromTo(
        '.login-links',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.8, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError('');
    setSuccess(false);

    try {
      await forgotPasswordMutation.mutateAsync(data);
      setSuccess(true);
      reset();
      toast.success('Email za resetovanje lozinke je poslat');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(PAGE_ROUTES.AUTH.LOGIN);
      }, 2000);
    } catch (err) {
      const axiosError = err as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        extractErrorMessage(err);
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (success) {
    return (
      <div ref={formRef}>
        <div ref={titleRef}>
          <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
            Email poslan!
          </h2>
          <p className="max-smx:text-[14px] max-smx:mb-6 mb-8 text-[16px] leading-normal text-[#6b7280]">
            Link za resetovanje lozinke je poslat na vaš email. Molimo
            provjerite vašu inbox.
          </p>
        </div>
        <div className="login-links mt-7 text-center">
          <p className="m-0 text-[14px] text-[#6b7280]">
            <Link
              to={PAGE_ROUTES.AUTH.LOGIN}
              className="decoration-none font-medium text-[#004179] transition-colors duration-200 ease-in-out hover:text-[#003366] hover:underline"
            >
              ← Nazad na prijavu
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef}>
      <div ref={titleRef}>
        <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
          Zaboravljena lozinka
        </h2>
        <p className="max-smx:text-[14px] max-smx:mb-6 mb-8 text-[16px] leading-normal text-[#6b7280]">
          Unesite vaš email i poslat ćemo vam link za resetovanje lozinke.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
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
              type="email"
              autoComplete="email"
              className={`max-smx:py-3 max-smx:px-4 max-smx:text-[14px] box-border w-full rounded-[10px] border border-solid bg-white px-4 py-3.5 pl-11.5 text-[15px] text-[#111827] transition-all duration-300 ease-in-out placeholder:text-[#9ca3af] focus:border-[#004179] focus:shadow-[0_0_0_3px_rgba(0,65,121,0.1)] focus:outline-none ${errors.email ? 'border-red-500' : 'border-[#e5e7eb]'}`}
              placeholder="vase.ime@kompanija.ba"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="submit-btn max-smx:py-3 max-smx:px-4 max-smx:text-[14px] from[#003366] foucus:shadow-[0_0_0_3px_rgba(0,65,121,0.3)] flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-linear-to-br from-[#004179] to-[#003366] px-5 py-4 text-[16px] font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:transform hover:bg-linear-to-br hover:shadow-[0_6px_20px_rgba(0,65,121,0.35)] focus:outline-none active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>
            {forgotPasswordMutation.isPending ? 'Slanje...' : 'Pošalji link'}
          </span>
          <svg
            className="transition-transform duration-300 ease-in-out"
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
          <Link
            to={PAGE_ROUTES.AUTH.LOGIN}
            className="decoration-none font-medium text-[#004179] transition-colors duration-200 ease-in-out hover:text-[#003366] hover:underline"
          >
            ← Nazad na prijavu
          </Link>
        </p>
      </div>
    </div>
  );
}
