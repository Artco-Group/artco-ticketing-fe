import type { ReactNode } from 'react';
import { Icon } from '@/shared/components/ui';
import { useBrandingModal } from '../hooks/useBrandingModal';

interface AuthLayoutProps {
  children: ReactNode;
  headline?: ReactNode;
  description?: string;
  floatingCards?: ReactNode;
}

const DefaultFloatingCards = () => (
  <>
    <div className="floating-card max-lgx:py-lg max-lgx:px-4.5 max-mdx:ml-0 max-smx:py-lg max-smx:px-4 max-smx:gap-lg bg-[rgba(255, 255, 255, 0.08)] max-mdx:ml-0 ml-[-30px] flex items-start gap-4 rounded-2xl border border-white/12 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
      <div className="max-lgx:w-5xl max-lgx:h-5xl max-smx:w-10 max-smx:h-10 shadow-[0_4px_12px_rgba(59, 130, 246, 0.4)] card-icon flex aspect-square h-12 w-12 shrink-0 grow-0 basis-12 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-400 to-blue-800 text-white">
        <Icon name="priority" size="lg" className="shrink-0" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        <div className="flex-between gap-2.5">
          <span className="text-body-md font-semibold tracking-[-0.2px] text-white">
            Brza prijava
          </span>
          <span className="text-caption py-xxs rounded-3xl bg-linear-to-br from-blue-400 to-blue-800 px-2 font-semibold tracking-[0.5px] text-white uppercase">
            Novo
          </span>
        </div>
        <span className="text-body-sm text-white/70">
          Prijavite problem u par klikova
        </span>
      </div>
    </div>

    <div className="floating-card max-lgx:py-lg max-lgx:px-4.5 max-mdx:ml-0 max-smx:py-lg max-smx:px-4 max-smx:gap-lg bg-[rgba(255, 255, 255, 0.08)] max-mdx:ml-0 ml-10 flex items-start gap-4 rounded-2xl border border-white/12 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
      <div className="max-lgx:w-5xl max-lgx:h-5xl max-smx:w-10 max-smx:h-10 shadow-[0_4px_12px_rgba(245, 158, 11, 0.4)] card-icon flex aspect-square h-12 w-12 shrink-0 grow-0 basis-12 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-orange-500 to-orange-600 text-white">
        <Icon name="tasks" size="lg" className="shrink-0" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        <div className="flex-between gap-2.5">
          <span className="text-body-md font-semibold tracking-[-0.2px] text-white">
            Praćenje statusa
          </span>
          <span className="border-success-500/40 bg-success-500/30 text-caption gap-xs py-xxs flex items-center rounded-3xl border border-solid px-2 font-semibold text-white uppercase">
            <span className="animate-live-dot mr-1 h-1.5 w-1.5 rounded-full bg-white"></span>
            Live
          </span>
        </div>
        <span className="text-body-sm text-white/70">Real-time ažuriranja</span>
        <div className="mt-1.5">
          <div className="mb-1.5 h-1 overflow-hidden rounded-xs bg-white/15">
            <div className="animate-soft-pulse h-full w-[65%] rounded-xs bg-linear-to-b from-orange-500 to-orange-400"></div>
          </div>
          <span className="text-caption text-white/60">3 aktivna zahtjeva</span>
        </div>
      </div>
    </div>

    <div className="floating-card max-lgx:py-lg max-lgx:px-4.5 max-mdx:ml-0 max-smx:py-lg max-smx:px-4 max-smx:gap-lg bg-[rgba(255, 255, 255, 0.08)] ml-xs max-mdx:ml-0 flex items-start gap-4 rounded-2xl border border-white/12 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
      <div className="max-lgx:w-5xl max-lgx:h-5xl max-smx:w-10 max-smx:h-10 shadow-[0_4px_12px_rgba(245, 158, 11, 0.4)] card-icon from-success-500 flex aspect-square h-12 w-12 shrink-0 grow-0 basis-12 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br to-green-600 text-white">
        <Icon name="shield-check" size="lg" className="shrink-0" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        <div className="flex-between gap-2.5">
          <span className="text-body-md font-semibold tracking-[-0.2px] text-white">
            Sigurna komunikacija
          </span>
          <Icon name="check" size="md" className="shrink-0 text-white" />
        </div>
        <span className="text-body-sm text-white/70">Zaštićeni podaci</span>
        <div className="flex-start-gap-3 mt-2 border-t border-white/10 pt-2.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-body-sm font-bold text-white">256-bit</span>
            <span className="text-caption tracking-[0.5px] text-white/50 uppercase">
              Enkripcija
            </span>
          </div>
          <div className="h-7 w-px bg-white/10"></div>
          <div className="flex flex-col gap-0.5">
            <span className="text-body-sm font-bold text-white">99.9%</span>
            <span className="text-caption tracking-[0.5px] text-white/50 uppercase">
              Uptime
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
);

const defaultHeadline = (
  <>
    Sistem za prijavu
    <br />i podršku
  </>
);

const defaultDescription =
  'Prijavite tehničke probleme, zatražite podršku ili pratite status vaših zahtjeva na jednom mjestu.';

export function AuthLayout({
  children,
  headline = defaultHeadline,
  description = defaultDescription,
  floatingCards,
}: AuthLayoutProps) {
  const { showBrandingModal, isNarrowViewport, isClosing, closeBrandingModal } =
    useBrandingModal();

  return (
    <div className="max-mdx:flex-col login-container flex min-h-screen w-full">
      {/* Left Panel - Branding with Video / Conditional Rendering */}
      {(showBrandingModal || !isNarrowViewport) && (
        <div
          className={`max-mdx:fixed max-mdx:top-0 max-mdx:left-0 max-mdx:w-full max-mdx:h-full max-mdx:z-1000 max-mdx:overflow-y-auto max-smx:p-6 max-smx:min-h-105 login-branding bg-primary-1000 relative flex flex-1 flex-col justify-between overflow-hidden p-12 transition-all duration-300 ${isClosing ? 'translate-y-[-100%] opacity-0' : ''}`}
        >
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
          <div className="via-primary-1000/90 from-primary-500/85 to-primary-1000/85 absolute top-0 left-0 z-1 h-full w-full bg-linear-135"></div>

          <div className="branding-content relative z-2 flex h-full flex-col justify-between">
            {/* Artco Logo */}
            <div className="brand-logo z-10">
              <img
                src="/artco-group-logo.svg"
                alt="Artco Group"
                className="max-smx:h-8 logo-image h-10 w-auto"
              />
            </div>

            {/* Floating UI Cards */}
            <div className="m-5xl max-lgx:max-w-75 max-mdx:relative max-mdx:top-auto max-mdx:left-auto max-mdx:transform-none max-mdx:m-10 max-mdx:mx-auto max-mdx:max-w-[380px] max-smx:p-0 max-smx:gap-3 floating-cards relative top-auto left-auto z-5 m-auto flex w-full max-w-[380px] transform-none flex-col gap-4.5 p-5">
              {floatingCards ?? <DefaultFloatingCards />}
            </div>

            {/* Moved headline and subtext below cards */}
            <div className="z-15 mt-auto text-left">
              <h1 className="max-lgx:text-heading-h2 max-mdx:text-heading-h3 max-smx:text-heading-h3 text-heading-h2 mb-5 leading-[1.15] font-bold tracking-[-1.5px] text-white">
                {headline}
              </h1>
              <p className="max-mdx:text-body-md max-smx:text-body-sm leading-1.7 text-body-lg m-0 max-w-[400px] text-white/80">
                {description}
              </p>
            </div>
            <button
              className="max-mdx:flex max-mdx:items-center max-mdx:justify-center max-mdx:mt-5 max-mdx:gap-2 max-mdx:w-full max-mdx:h-14 max-mdx:py-4.5 max-mdx:px-6 max-mdx:bg-linear-135 max-mdx:text-white max-mdx:font-semibold max-mdx:text-body-md max-mdx:border-none max-mdx:rounded-lg max-mdx:cursor-pointer max-mdx:shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-mdx:transition-all max-mdx:duration-300 max-mdx:ease-in-out max-mdx:tracking[0.3px] max-mdx:hover:bg-linear-135 max-mdx:hover:transform max-mdx:hover:-translate-y-0.5 max-mdx:hover:shadow-[0_6px_20px_rgba(0,65,121,0.35)] max-mdx:active:translate-y-0 from-primary-500 to-primary-600 text-body-md z-10 hidden cursor-pointer border-none bg-linear-to-br text-white"
              onClick={closeBrandingModal}
            >
              <span>Nastavi</span>
              <Icon
                name="chevron-down"
                size="md"
                className="max-mdx:transition-transform max-mdx:duration-300 max-mdx:ease-in-out max-mdx:hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      )}

      {/* Right Panel - Form Container */}
      <div className="max-mdx:p-8 max-smx:p-6 login-form-panel relative flex flex-1 flex-col items-center justify-center bg-white p-12">
        <div className="w-full max-w-[400px]">{children}</div>

        <footer className="login-footer max-mdx:relative max-mdx:bottom-auto max-mdx:left-auto max-mdx:right-auto max-mdx:flex-col max-mdx:gap-4 max-mdx:mt-10 flex-between absolute right-12 bottom-8 left-12">
          <span className="text-body-sm text-greyscale-400">
            © 2024 Artco Group
          </span>
          <div className="max-smx:gap-4 flex gap-6">
            <a
              href="#privacy"
              className="decoration-none text-body-sm text-greyscale-400 hover:text-greyscale-700 transition-colors duration-200 ease-in-out"
            >
              Privatnost
            </a>
            <a
              href="#terms"
              className="decoration-none text-body-sm text-greyscale-400 hover:text-greyscale-700 transition-colors duration-200 ease-in-out"
            >
              Uslovi korištenja
            </a>
            <a
              href="#help"
              className="decoration-none text-body-sm text-greyscale-400 hover:text-greyscale-700 transition-colors duration-200 ease-in-out"
            >
              Pomoć
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
