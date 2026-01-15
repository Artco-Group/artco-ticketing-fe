import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import type { AxiosError } from 'axios';
import { authAPI } from '../api';

interface ApiErrorResponse {
  message?: string;
}

function PasswordResetPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);

  const brandingRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // useEffect #1 - Token verifikacija
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await authAPI.verifyResetToken(token || '');
        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setError(response.data.message || 'Token je nevažeći ili je istekao');
        }
      } catch (err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        setError(
          axiosError.response?.data?.message ||
            'Token je nevažeći ili je istekao'
        );
      } finally {
        setVerifyingToken(false);
      }
    };

    verifyToken();
  }, [token]);

  // useEffect #2 - GSAP Animacije (pokreću se NAKON što verifikacija završi)
  useEffect(() => {
    // Čekaj da se verifikacija završi i elementi renderuju
    if (verifyingToken) return;

    const ctx = gsap.context(() => {
      // Branding animation
      if (brandingRef.current) {
        gsap.fromTo(
          brandingRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }

      // Headline animation
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
        );
      }

      // Floating cards animation with stagger
      const cards = document.querySelectorAll('.floating-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            delay: 0.5,
            ease: 'power3.out',
          }
        );
      }

      // Video overlay animation
      if (videoOverlayRef.current) {
        gsap.fromTo(
          videoOverlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: 'power2.inOut' }
        );
      }

      // Form animation (title i form)
      if (titleRef.current && formRef.current) {
        gsap.fromTo(
          [titleRef.current, formRef.current],
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.15,
            delay: 0.3,
            ease: 'power3.out',
          }
        );
      }
    });

    return () => ctx.revert();
  }, [verifyingToken]); // ← Pokreće se kad se verifyingToken promijeni (završi verifikacija)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Molimo vas popunite sva polja');
      return;
    }

    if (newPassword.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token || '', newPassword);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(
        axiosError.response?.data?.message || 'Greška pri resetovanju lozinke'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-mdx:flex-col login-container flex min-h-screen w-full">
      {/* Left Panel - Branding with Video */}
      <div className="max-mdx:fixed max-mdx:top-0 max-mdx:left-0 max-mdx:w-full max-mdx:h-full max-mdx:z-1000 max-mdx:overflow-y-auto max-smx:p-6 max-smx:min-h-105 login-branding relative flex flex-1 flex-col justify-between overflow-hidden bg-[#0a1628] p-12">
        {/* Video Background */}
        <video
          className="video-background absolute top-0 left-0 z-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/securitysolution.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div
          className="via[#0A1628]/90 absolute top-0 left-0 z-1 h-full w-full bg-linear-135 from-[#004179]/85 to-[#001E3C]/85"
          ref={videoOverlayRef}
        ></div>

        <div className="branding-content relative z-2 flex h-full flex-col justify-between">
          {/* Artco Logo */}
          <div className="brand-logo z-10" ref={brandingRef}>
            <img
              src="/artco-group-logo.svg"
              alt="Artco Group"
              className="max-smx:h-8 logo-image h-10 w-auto brightness-0 invert-100"
            />
          </div>

          {/* Floating UI Cards */}
          <div
            className="m-40px max-lgx:max-w-75 max-mdx:relative max-mdx:top-auto max-mdx:left-auto max-mdx:transform-none max-mdx:m-10 max-mdx:mx-auto max-mdx:max-w-full max-smx:p-0 max-smx:gap-3 floating-cards relative top-auto left-auto z-5 m-auto flex w-full max-w-[380px] transform-none flex-col gap-[18px] p-5"
            ref={floatingCardsRef}
          >
            <div className="floating-card max-lgx:py-3.5 max-lgx:px-4.5 max-mdx:ml-0 max-smx:py-3.4 max-smx:px-4 max-smx:gap-3.5 bg-[rgba(255, 255, 255, 0.08)] ml-[-30px] flex items-start gap-4 rounded-[18px] border border-white/12 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
              <div className="max-lgx:w-10.5 max-lgx:h-10.5 max-smx:w-10 max-smx:h-10 shadow-[0_4px_12px_rgba(59, 130, 246, 0.4)] card-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#3b82f6] to-[#1d4ed8] text-white">
                <svg
                  className="max-smx:w-5 max-smx:h-5"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1.5">
                <span className="text-[16px] font-semibold tracking-[-0.2px] text-white">
                  Sigurna autentifikacija
                </span>
                <span className="text-[13px] text-white/70">
                  Vaši podaci su zaštićeni
                </span>
              </div>
            </div>
          </div>

          {/* Headline at the Bottom */}
          <div className="relative z-10" ref={headlineRef}>
            <h1 className="max-smx:text-[28px] max-smx:leading-[36px] headline-text text-[42px] leading-[56px] font-bold tracking-[-1px] text-white">
              Resetovanje
              <br />
              lozinke
            </h1>
            <p className="max-smx:text-[14px] mt-4 text-[16px] leading-relaxed text-white/80">
              Unesite novu lozinku za vaš račun
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Password Form */}
      <div className="max-mdx:p-8 max-smx:p-6 login-form-panel relative flex flex-1 flex-col items-center justify-center bg-white p-12">
        <div className="w-full max-w-[400px]">
          {verifyingToken ? (
            <div ref={formRef} className="text-center">
              <div className="mb-4">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#004179]/20 border-t-[#004179]"></div>
              </div>
              <p className="text-[16px] text-[#6b7280]">
                Verificiranje tokena...
              </p>
            </div>
          ) : !tokenValid ? (
            <div ref={formRef}>
              <div ref={titleRef}>
                <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
                  Nevažeći Token
                </h2>
                <p className="max-smx:text-[14px] max-smx:mb-6 mb-8 text-[16px] leading-normal text-[#6b7280]">
                  {error ||
                    'Link za resetovanje lozinke je nevažeći ili je istekao.'}
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="submit-btn max-smx:py-3 max-smx:px-4 max-smx:text-[14px] from[#003366] foucus:shadow-[0_0_0_3px_rgba(0,65,121,0.3)] flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-linear-to-br from-[#004179] to-[#002244] px-5 py-4 text-[16px] font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:transform hover:bg-linear-to-br hover:shadow-[0_6px_20px_rgba(0,65,121,0.35)] focus:outline-none active:translate-y-0"
              >
                Nazad na prijavu
              </button>
            </div>
          ) : success ? (
            <div ref={formRef}>
              <div ref={titleRef} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#10b981]/10">
                  <svg
                    className="h-8 w-8 text-[#10b981]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
                  Uspješno!
                </h2>
                <p className="max-smx:text-[14px] mb-6 text-[16px] leading-normal text-[#6b7280]">
                  Vaša lozinka je uspješno resetovana. Preusmeravanje na
                  stranicu za prijavu...
                </p>
              </div>
            </div>
          ) : (
            <div ref={formRef}>
              <div ref={titleRef}>
                <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
                  Nova Lozinka
                </h2>
                <p className="max-smx:text-[14px] max-smx:mb-6 mb-8 text-[16px] leading-normal text-[#6b7280]">
                  Unesite novu lozinku za vaš račun.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* New Password Input */}
                <div className="form-group mb-5">
                  <label
                    className="mb-2 block text-[14px] font-medium text-[#374151]"
                    htmlFor="new-password"
                  >
                    Nova Lozinka
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
                      type={showNewPassword ? 'text' : 'password'}
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="max-smx:py-3 max-smx:px-4 max-smx:pl-11.5 max-smx:text-[14px] input-field w-full rounded-[10px] border border-[#d1d5db] bg-white py-4 pr-12 pl-12 text-[16px] text-[#111827] transition-all duration-200 ease-in-out placeholder:text-[#9ca3af] focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/20 focus:outline-none"
                      placeholder="Unesite novu lozinku"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 z-1 cursor-pointer border-none bg-none p-0 text-[#9ca3af] transition-colors duration-200 ease-in-out hover:text-[#004179]"
                    >
                      {showNewPassword ? (
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

                {/* Confirm Password Input */}
                <div className="form-group mb-5">
                  <label
                    className="mb-2 block text-[14px] font-medium text-[#374151]"
                    htmlFor="confirm-password"
                  >
                    Potvrdi Lozinku
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="max-smx:py-3 max-smx:px-4 max-smx:pl-11.5 max-smx:text-[14px] input-field w-full rounded-[10px] border border-[#d1d5db] bg-white py-4 pr-12 pl-12 text-[16px] text-[#111827] transition-all duration-200 ease-in-out placeholder:text-[#9ca3af] focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/20 focus:outline-none"
                      placeholder="Potvrdite novu lozinku"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 z-1 cursor-pointer border-none bg-none p-0 text-[#9ca3af] transition-colors duration-200 ease-in-out hover:text-[#004179]"
                    >
                      {showConfirmPassword ? (
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

                {/* Error Message */}
                {error && (
                  <div className="error-message mb-5 rounded-[10px] border border-[#ef4444]/20 bg-[#fef2f2] px-4 py-3 text-[14px] text-[#dc2626]">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn max-smx:py-3 max-smx:px-4 max-smx:text-[14px] from[#003366] foucus:shadow-[0_0_0_3px_rgba(0,65,121,0.3)] flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-linear-to-br from-[#004179] to-[#002244] px-5 py-4 text-[16px] font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:transform hover:bg-linear-to-br hover:shadow-[0_6px_20px_rgba(0,65,121,0.35)] focus:outline-none active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      <span>Resetovanje...</span>
                    </>
                  ) : (
                    <>
                      <span>Resetuj Lozinku</span>
                      <svg
                        className="transition-transform duration-300 ease-in-out hover:translate-x-1"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Back to Login Link */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="decoration-none cursor-pointer border-none bg-none text-[14px] font-medium text-[#004179] transition-colors duration-200 ease-in-out hover:text-[#003366] hover:underline"
                  >
                    ← Nazad na prijavu
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;
