import type { FormEvent, MouseEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showBrandingModal, setShowBrandingModal] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [_error, setError] = useState('');
  const [_loading, setLoading] = useState(false);

  const brandingRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //Check screen size for mobile or desktop
    window.innerWidth < 968 ? setIsMobile(true) : setIsMobile(false);
    window.addEventListener('resize', () => {
      window.innerWidth < 968 ? setIsMobile(true) : setIsMobile(false);
    });

    const ctx = gsap.context(() => {
      // Initial fade-in animation for branding content
      gsap.fromTo(
        brandingRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
      );

      // Floating cards animation with stagger
      gsap.fromTo(
        '.floating-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out',
          stagger: 0.15,
        }
      );

      // Subtle pulse animation for overlay
      gsap.to(videoOverlayRef.current, {
        opacity: 0.75,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

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
        '.form-options',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.7, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.submit-btn',
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

      gsap.fromTo(
        '.login-links',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 1, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.login-footer',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 1.1, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(resetEmail);
      alert('Link za resetovanje lozinke je poslat na vaš email!');
      setResetEmail('');
      // Optionally switch back to login after success
      setTimeout(() => {
        switchToLogin({ preventDefault: () => {} } as MouseEvent);
      }, 2000);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(
        axiosError.response?.data?.message ||
          'Greška pri slanju emaila za resetovanje'
      );
    } finally {
      setLoading(false);
    }
  };

  const switchToForgotPassword = (e: MouseEvent) => {
    e.preventDefault();
    gsap.to(formRef.current, {
      opacity: 0,
      x: -30,
      duration: 0.3,
      onComplete: () => {
        setShowForgotPassword(true);
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.3 }
        );
      },
    });
  };

  const switchToLogin = (e: MouseEvent | { preventDefault: () => void }) => {
    e.preventDefault();
    gsap.to(formRef.current, {
      opacity: 0,
      x: 30,
      duration: 0.3,
      onComplete: () => {
        setShowForgotPassword(false);
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.3 }
        );
      },
    });
  };

  const closeBrandingModal = () => {
    gsap.to('.login-branding', {
      y: -window.innerHeight,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.in',
      onComplete: () => {
        setShowBrandingModal(false);
      },
    });
  };

  return (
    <div className="max-mdx:flex-col login-container flex min-h-screen w-full">
      {/* Left Panel - Branding with Video / Conditional Rendering */}
      {(showBrandingModal || !isMobile) && (
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1.5">
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-[16px] font-semibold tracking-[-0.2px] text-white">
                      Brza prijava
                    </span>
                    <span className="rounded-[20px] bg-linear-to-br from-[#3b82f6] to-[#1d4ed8] px-2 py-[3px] text-[10px] font-semibold tracking-[0.5px] text-white uppercase">
                      Novo
                    </span>
                  </div>
                  <span className="text-[13px] text-white/70">
                    Prijavite problem u par klikova
                  </span>
                </div>
              </div>

              <div className="floating-card max-lgx:py-3.5 max-lgx:px-4.5 max-mdx:ml-0 max-smx:py-3.4 max-smx:px-4 max-smx:gap-3.5 bg-[rgba(255, 255, 255, 0.08)] ml-10 flex items-start gap-4 rounded-[18px] border border-white/12 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                <div className="max-lgx:w-10.5 max-lgx:h-10.5 max-smx:w-10 max-smx:h-10 shadow-[0_4px_12px_rgba(245, 158, 11, 0.4)] card-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#f59e0b] to-[#d97706] text-white">
                  <svg
                    className="max-smx:w-5 max-smx:h-5"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1.5">
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-[16px] font-semibold tracking-[-0.2px] text-white">
                      Praćenje statusa
                    </span>
                    <span className="spacing-[0.5px] flex items-center gap-[5px] rounded-[20px] border border-solid border-[#10b981]/30 bg-[#10B981]/20 px-2 py-[3px] text-[10px] font-semibold text-[#10b981] uppercase">
                      <span className="animate-live-dot h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                      Live
                    </span>
                  </div>
                  <span className="text-[13px] text-white/70">
                    Real-time ažuriranja
                  </span>
                  <div className="mt-1.5">
                    <div className="mb-1.5 h-1 overflow-hidden rounded-xs bg-white/15">
                      <div className="animate-soft-pulse h-full w-[65%] rounded-xs bg-linear-to-b from-[#f59e0b] to-[#fbbf24]"></div>
                    </div>
                    <span className="text-[11px] text-white/60">
                      3 aktivna zahtjeva
                    </span>
                  </div>
                </div>
              </div>

              <div className="floating-card max-lgx:py-3.5 max-lgx:px-4.5 max-mdx:ml-0 max-smx:py-3.4 max-smx:px-4 max-smx:gap-3.5 bg-[rgba(255, 255, 255, 0.08)] ml-[5px] flex items-start gap-4 rounded-[18px] border border-white/12 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                <div className="max-lgx:w-10.5 max-lgx:h-10.5 max-smx:w-10 max-smx:h-10 shadow-[0_4px_12px_rgba(245, 158, 11, 0.4)] card-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#10b981] to-[#059669] text-white">
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
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-[16px] font-semibold tracking-[-0.2px] text-white">
                      Sigurna komunikacija
                    </span>
                    <svg
                      className="shrink-0 text-[#10b981]"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-white/70">
                    Zaštićeni podaci
                  </span>
                  <div className="mt-2 flex items-center gap-3 border-t border-white/10 pt-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-white">
                        256-bit
                      </span>
                      <span className="text-[10px] tracking-[0.5px] text-white/50 uppercase">
                        Enkripcija
                      </span>
                    </div>
                    <div className="h-7 w-px bg-white/10"></div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-white">
                        99.9%
                      </span>
                      <span className="text-[10px] tracking-[0.5px] text-white/50 uppercase">
                        Uptime
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Moved headline and subtext below cards */}
            <div className="z-15 mt-auto text-left" ref={headlineRef}>
              <h1 className="max-lgx:text-[36px] max-mdx:text-[32px] max-smx:text-[28px] mb-5 text-[42px] leading-[1.15] font-bold tracking-[-1.5px] text-white">
                Sistem za prijavu
                <br />i podršku
              </h1>
              <p className="max-mdx:txt-[15px] max-smx:text-[14px] leading-1.7 m-0 max-w-[400px] text-[17px] text-white/80">
                Prijavite tehničke probleme, zatražite podršku ili pratite
                status vaših zahtjeva na jednom mjestu.
              </p>
            </div>
            <button
              className="max-mdx:flex max-mdx:items-center max-mdx:justify-center max-mdx:mt-5 max-mdx:gap-2 max-mdx:w-full max-mdx:h-14 max-mdx:py-4.5 max-mdx:px-6 max-mdx:bg-linear-135 max-mdx:text-white max-mdx:font-semibold max-mdx:text-[16px] max-mdx:border-none max-mdx:rounded-[10px] max-mdx:cursor-pointer max-mdx:shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-mdx:transition-all max-mdx:duration-300 max-mdx:ease-in-out max-mdx:tracking[0.3px] max-mdx:hover:bg-linear-135 max-mdx:hover:transform max-mdx:hover:-translate-y-0.5 max-mdx:hover:shadow-[0_6px_20px_rgba(0,65,121,0.35)] max-mdx:active:translate-y-0 z-10 hidden cursor-pointer border-none bg-linear-to-br from-[#004179] to-[#003366] text-[16px] text-white"
              onClick={closeBrandingModal}
            >
              <span>Nastavi</span>
              <svg
                className="max-mdx:transition-transform max-mdx:duration-300 max-mdx:ease-in-out max-mdx:hover:translate-x-1"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Right Panel - Login Form */}
      <div className="max-mdx:p-8 ma-msx:p-6 login-form-panel relative flex flex-1 flex-col items-center justify-center bg-white p-12">
        <div className="w-full max-w-[400px]">
          {showForgotPassword ? (
            // Forgot Password Form
            <div ref={formRef}>
              <div ref={titleRef}>
                <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
                  Zaboravljena lozinka
                </h2>
                <p className="max-smx:text-[14px] max-smx:mb-6 mb-8 text-[16px] leading-normal text-[#6b7280]">
                  Unesite vaš email i poslat ćemo vam link za resetovanje
                  lozinke.
                </p>
              </div>

              <form onSubmit={handleForgotPassword}>
                <div className="form-group mb-5">
                  <label
                    className="mb-2 block text-[14px] font-medium text-[#374151]"
                    htmlFor="reset-email"
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
                      id="reset-email"
                      type="email"
                      className="max-smx:py-3 max-smx:px-4 max-smx:text-[14px] box-border w-full rounded-[10px] border border-solid border-[#e5e7eb] bg-white px-4 py-3.5 pl-11.5 text-[15px] text-[#111827] transition-all duration-300 ease-in-out placeholder:text-[#9ca3af] focus:border-[#004179] focus:shadow-[0_0_0_3px_rgba(0,65,121,0.1)] focus:outline-none"
                      placeholder="vase.ime@kompanija.ba"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-btn max-smx:py-3 max-smx:px-4 max-smx:text-[14px] from[#003366] foucus:shadow-[0_0_0_3px_rgba(0,65,121,0.3)] flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-linear-to-br from-[#004179] to-[#003366] px-5 py-4 text-[16px] font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:transform hover:bg-linear-to-br hover:shadow-[0_6px_20px_rgba(0,65,121,0.35)] focus:outline-none active:translate-y-0"
                >
                  <span>Pošalji link</span>
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

              <div className="login-linkstext-center mt-7">
                <p className="m-0 text-[14px] text-[#6b7280]">
                  <a href="#login" onClick={switchToLogin} className="link">
                    ← Nazad na prijavu
                  </a>
                </p>
              </div>
            </div>
          ) : (
            // Login Form
            <div ref={formRef}>
              <div ref={titleRef}>
                <h2 className="max-smx:text-[26px] mb-2 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
                  Prijavite se
                </h2>
                <p className="max-smx:text-[14px] max-smx:mb-6 mb-8 text-[16px] leading-normal text-[#6b7280]">
                  Dobrodošli nazad. Molimo unesite vaše podatke.
                </p>
              </div>

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
                      type="email"
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
                      type={showPassword ? 'text' : 'password'}
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
                      aria-label={
                        showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'
                      }
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
                    <input type="checkbox" className="checkbox-input" />
                    <span className="text-[14px] text-[#4b5563]">
                      Zapamti me
                    </span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={switchToForgotPassword}
                    className="decoration-none text-[14px] font-medium text-[#004179] transition-colors duration-200 ease-in-out hover:text-[#003366] hover:underline"
                  >
                    Zaboravljena lozinka?
                  </a>
                </div>

                <button
                  type="submit"
                  className="submit-btn max-smx:py-3 max-smx:px-4 max-smx:text-[14px] from[#003366] foucus:shadow-[0_0_0_3px_rgba(0,65,121,0.3)] flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-linear-to-br from-[#004179] to-[#002244] px-5 py-4 text-[16px] font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:transform hover:bg-linear-to-br hover:shadow-[0_6px_20px_rgba(0,65,121,0.35)] focus:outline-none active:translate-y-0"
                >
                  <span>Prijavite se</span>
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
          )}
        </div>

        <footer className="login-footer max-mdx:relative max-mdx:bottom-auto max-mdx:left-auto max-mdx:right-auto max-mdx:flex-col max-mdx:gap-4 max-mdx:mt-10 absolute right-12 bottom-8 left-12 flex items-center justify-between">
          <span className="text-[13px] text-[#9ca3af]">© 2024 Artco Group</span>
          <div className="max-smx:gap-4 flex gap-6">
            <a
              href="#privacy"
              className="decoration-none text-[13px] text-[#9ca3af] transition-colors duration-200 ease-in-out hover:text-[#374151]"
            >
              Privatnost
            </a>
            <a
              href="#terms"
              className="decoration-none text-[13px] text-[#9ca3af] transition-colors duration-200 ease-in-out hover:text-[#374151]"
            >
              Uslovi korištenja
            </a>
            <a
              href="#help"
              className="decoration-none text-[13px] text-[#9ca3af] transition-colors duration-200 ease-in-out hover:text-[#374151]"
            >
              Pomoć
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;
