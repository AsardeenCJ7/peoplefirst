/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8102E',
          dark: '#8B0000',
          light: '#FF3355',
          50: '#FFF0F3',
          100: '#FFD6DC',
          200: '#FFB3BC',
          300: '#FF7A8A',
          400: '#FF3355',
          500: '#C8102E',
          600: '#A00022',
          700: '#8B0000',
          800: '#6B0000',
          900: '#4A0000',
        },
        gold: {
          DEFAULT: '#F4A900',
          light: '#FFD700',
          dark: '#C68900',
        },
        dark: {
          DEFAULT: '#0D0D0D',
          100: '#1A1A1A',
          200: '#1C1C1C',
          300: '#242424',
          400: '#2E2E2E',
          500: '#3D3D3D',
          600: '#525252',
        },
        surface: {
          DEFAULT: '#111111',
          card: '#1C1C1C',
          elevated: '#242424',
          border: '#2E2E2E',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A0A0A0',
          muted: '#6B6B6B',
          accent: '#C8102E',
        },
        success: '#22C55E',
        info: '#3B82F6',
        warning: '#F4A900',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'headline': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'subheadline': ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #1A0000 50%, #0D0D0D 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)',
        'red-glow': 'radial-gradient(ellipse at center, rgba(200,16,46,0.15) 0%, transparent 70%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(200,16,46,0.3), 0 0 40px rgba(200,16,46,0.1)',
        'glow-gold': '0 0 20px rgba(244,169,0,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(200,16,46,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-red': 'pulseRed 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRed: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}
