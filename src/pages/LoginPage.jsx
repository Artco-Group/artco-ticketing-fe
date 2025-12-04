import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const brandingRef = useRef(null);
  const headlineRef = useRef(null);
  const floatingCardsRef = useRef(null);
  const videoOverlayRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
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
        { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.8, ease: 'back.out(1.7)' }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="login-container">
      {/* Left Panel - Branding with Video */}
      <div className="login-branding">
        {/* Video Background */}
        <video
          className="video-background"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/securitysolution.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="video-overlay" ref={videoOverlayRef}></div>

        {/* Decorative Elements for Left Side */}
        <div className="decorative-elements">
          <div className="decorative-orb orb-1"></div>
          <div className="decorative-orb orb-2"></div>
          <div className="decorative-line line-1"></div>
          <div className="decorative-line line-2"></div>
          <div className="decorative-ring ring-1"></div>
          <div className="decorative-dots">
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </div>
        </div>

        <div className="branding-content">
          {/* Artco Logo */}
          <div className="brand-logo" ref={brandingRef}>
            <img
              src="/artco-group-logo.svg"
              alt="Artco Group"
              className="logo-image"
            />
          </div>

          {/* Floating UI Cards */}
          <div className="floating-cards" ref={floatingCardsRef}>
            <div className="floating-card card-1">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="card-title">Brza prijava</span>
                  <span className="card-badge badge-new">Novo</span>
                </div>
                <span className="card-subtitle">Prijavite problem u par klikova</span>
              </div>
            </div>

            <div className="floating-card card-2">
              <div className="card-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="card-title">Praćenje statusa</span>
                  <span className="card-badge badge-live">
                    <span className="live-dot"></span>
                    Live
                  </span>
                </div>
                <span className="card-subtitle">Real-time ažuriranja</span>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span className="progress-text">3 aktivna zahtjeva</span>
                </div>
              </div>
            </div>

            <div className="floating-card card-3">
              <div className="card-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="card-title">Sigurna komunikacija</span>
                  <svg className="card-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="card-subtitle">Zaštićeni podaci</span>
                <div className="card-stats">
                  <div className="stat-item">
                    <span className="stat-value">256-bit</span>
                    <span className="stat-label">Enkripcija</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-value">99.9%</span>
                    <span className="stat-label">Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="branding-bottom" ref={headlineRef}>
            <h1 className="branding-headline">
              Sistem za prijavu
              <br />
              i podršku
            </h1>
            <p className="branding-subtext">
              Prijavite tehničke probleme, zatražite podršku ili pratite status vaših zahtjeva na jednom mjestu.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <div ref={titleRef}>
            <h2 className="login-title">Prijavite se</h2>
            <p className="login-subtitle">
              Dobrodošli nazad. Molimo unesite vaše podatke.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email adresa</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  className="form-input has-icon"
                  placeholder="vase.ime@kompanija.ba"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group password-group">
              <label className="form-label" htmlFor="password">Lozinka</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-icon"
                  placeholder="Unesite vašu lozinku"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
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

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input" />
                <span className="checkbox-text">Zapamti me</span>
              </label>
              <a href="#forgot" className="link">
                Zaboravljena lozinka?
              </a>
            </div>

            <button type="submit" className="submit-btn">
              <span>Prijavite se</span>
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          <div className="login-links">
            <p className="signup-text">
              Nemate račun? <a href="#signup" className="link">Kontaktirajte administratora</a>
            </p>
          </div>
        </div>

        <footer className="login-footer">
          <span className="footer-copyright">© 2024 Artco Group</span>
          <div className="footer-links">
            <a href="#privacy" className="footer-link">Privatnost</a>
            <a href="#terms" className="footer-link">Uslovi korištenja</a>
            <a href="#help" className="footer-link">Pomoć</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;
