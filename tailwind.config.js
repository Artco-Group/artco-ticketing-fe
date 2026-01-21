/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        // Brand primary (Blue from Figma - mapped to primary)
        primary: {
          50: '#F2F9FF',
          100: '#E5F4FF',
          200: '#BBE3FF',
          300: '#80CAFF',
          400: '#0D99FF',
          500: '#004179', // Base brand color
          600: '#007BE5',
          700: '#0768CF',
          800: '#034AC1',
          900: '#093077',
          1000: '#0D193F',
        },
        // Greyscale (from Figma)
        greyscale: {
          0: '#FFFFFF',
          100: '#F5F5F5',
          200: '#E0E0E0',
          300: '#9D9D9D',
          400: '#8C8C8C',
          500: '#757575',
          600: '#444444',
          700: '#383838',
          800: '#2C2C2C',
          900: '#1E1E1E',
          1000: '#111111',
        },
        // Teal (from Figma)
        teal: {
          100: '#EBF6FF',
          200: '#CEF0F8',
          300: '#B6ECF7',
          400: '#75D7F0',
          500: '#00A2C2',
          600: '#0087A8',
          700: '#047195',
          800: '#085A78',
          900: '#093C53',
          1000: '#0E2F43',
        },
        // Pink (from Figma)
        pink: {
          100: '#FFF0FE',
          200: '#FFE0FC',
          300: '#FFBDF2',
          400: '#FF99E0',
          500: '#FF24BD',
          600: '#EA10AC',
          700: '#C80B96',
          800: '#971172',
          900: '#5F114C',
          1000: '#451138',
        },
        // Red (from Figma)
        red: {
          100: '#FFF5F5',
          200: '#FFE2E0',
          300: '#FFC7C2',
          400: '#FFAFA3',
          500: '#F24822',
          600: '#DC3412',
          700: '#BD2915',
          800: '#9F1F18',
          900: '#771208',
          1000: '#660E0B',
        },
        // Orange (from Figma)
        orange: {
          100: '#FFF4E5',
          200: '#FFE0C2',
          300: '#FCD19C',
          400: '#FFC470',
          500: '#FFAB29',
          600: '#FC9E24',
          700: '#F79722',
          800: '#DD7C0E',
          900: '#CE7012',
          1000: '#8A480F',
        },
        // Violet (from Figma)
        violet: {
          100: '#F5F5FF',
          200: '#EBEBFF',
          300: '#D3D1FF',
          400: '#B4B2FF',
          500: '#4D49FC',
          600: '#443DEB',
          700: '#3D32E2',
          800: '#3620DF',
          900: '#2F15AC',
          1000: '#1D1254',
        },
        // Purple (from Figma)
        purple: {
          100: '#F9F5FF',
          200: '#F1E5FF',
          300: '#E4CCFF',
          400: '#D9BBFF',
          500: '#9747FF',
          600: '#8638E5',
          700: '#7C2BDA',
          800: '#681ABB',
          900: '#4B0D97',
          1000: '#2D0F46',
        },
        // Green (from Figma)
        green: {
          100: '#EBFFEE',
          200: '#CFF7D3',
          300: '#AFF4C6',
          400: '#85E0A3',
          500: '#14AE5C',
          600: '#009951',
          700: '#008043',
          800: '#036838',
          900: '#024626',
          1000: '#084A23',
        },
        // Blue (from Figma)
        blue: {
          100: '#F2F9FF',
          200: '#E5F4FF',
          300: '#BBE3FF',
          400: '#80CAFF',
          500: '#0D99FF',
          600: '#007BE5',
          700: '#0768CF',
          800: '#034AC1',
          900: '#093077',
          1000: '#0D193F',
        },
        // Semantic colors
        error: {
          100: '#FFF5F5',
          500: '#F24822',
          600: '#DC3412',
          700: '#BD2915',
        },
        warning: {
          100: '#FFF4E5',
          500: '#FFAB29',
          600: '#FC9E24',
        },
        success: {
          100: '#EBFFEE',
          500: '#14AE5C',
          600: '#009951',
        },
        info: {
          100: '#F2F9FF',
          500: '#0D99FF',
          600: '#007BE5',
        },
      },
    },
  },
  plugins: [],
};
