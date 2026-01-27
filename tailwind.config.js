/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Headings (font-size, { lineHeight, letterSpacing, fontWeight })
        'heading-h1': [
          '48px',
          { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'heading-h2': [
          '40px',
          { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'heading-h3': [
          '32px',
          { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' },
        ],
        'heading-h4': [
          '24px',
          { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'heading-h5': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-h6': ['18px', { lineHeight: '24px', fontWeight: '600' }],

        // Body
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        'body-xs': ['12px', { lineHeight: '16px' }],

        // Labels & captions
        'label-lg': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        caption: ['11px', { lineHeight: '14px' }],
      },
      spacing: {
        // Figma design system spacing scale
        none: '0px', // 0rem
        xxs: '2px', // 0.125rem
        xs: '4px', // 0.25rem
        sm: '6px', // 0.375rem
        md: '8px', // 0.5rem
        lg: '12px', // 0.75rem
        xl: '16px', // 1rem
        '2xl': '20px', // 1.25rem
        '3xl': '24px', // 1.5rem
        '4xl': '32px', // 2rem
        '5xl': '40px', // 2.5rem
        '6xl': '48px', // 3rem
        '7xl': '64px', // 4rem

        // Component-specific custom spacing values (outside standard scale)
        2.5: '10px', // Between 2 (8px) and 3 (12px)
        4.5: '18px', // Between 4 (16px) and 5 (20px)
        11.5: '46px', // For input icon padding (used in LoginForm, ForgotPasswordForm, PasswordResetPage)
        13: '52px', // Custom spacing for larger layouts
        15: '60px', // Custom spacing for larger layouts
        18: '72px', // Custom spacing for larger layouts
        22: '88px', // Custom spacing for larger layouts
      },
      borderRadius: {
        // Figma design system border radius scale
        none: '0px', // 0rem
        xs: '2px', // 0.125rem
        sm: '4px', // 0.25rem
        DEFAULT: '8px', // 0.5rem - Default border radius
        md: '8px', // 0.5rem
        lg: '10px', // 0.625rem
        xl: '12px', // 0.75rem
        '2xl': '16px', // 1rem
        '3xl': '20px', // 1.25rem
        '4xl': '24px', // 1.5rem
        full: '999px', // 62.438rem - Fully rounded corners
      },
      // Colors are now defined in index.css @theme directive for Tailwind v4
    },
  },
  plugins: [],
};
