/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ── Primary: Elegant warm champagne & metallic golds ── */
        primary: {
          50:  '#FDFBF7',
          100: '#FAF4E8',
          200: '#F0E3CB',
          300: '#E4CDA6',
          400: '#D5B277',
          500: '#C39348', // Main Luxury Gold
          600: '#A77B37',
          700: '#846029',
          800: '#5C411B',
          900: '#3D2A10',
          950: '#211607',
        },
        /* ── Sidebar/Surface: Deep cinematic obsidian and slate-graphite ── */
        surface: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#9CA3AF',
          400: '#6B7280',
          500: '#4B5563',
          600: '#374151',
          700: '#1F2937', // Borders / light dark
          800: '#111827', // Rich space charcoal
          900: '#0B0F19', // Deep obsidian card backdrop
          950: '#05070B', // Pure solid space black
        },
        /* ── Accent: Warm golden sparks ── */
        accent: {
          400: '#FFEAA7',
          500: '#D5B277',
          600: '#C39348',
        },
        /* ── Success ── */
        success: {
          50:  '#06150F',
          100: '#0D2B20',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        /* ── Warning ── */
        warning: {
          50:  '#191203',
          100: '#302206',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        /* ── Danger ── */
        danger: {
          50:  '#1F0A0D',
          100: '#3D141A',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
        },
        /* ── Info ── */
        info: {
          50:  '#070F1E',
          100: '#0F1E3C',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      backgroundImage: {
        'gradient-sidebar': 'linear-gradient(180deg, #05070B 0%, #111827 50%, #05070B 100%)',
        'gradient-card':    'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #FFEAA7 0%, #D5B277 50%, #846029 100%)',
        'gradient-success': 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        'gradient-warning': 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
        'gradient-info':    'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'pulse-dot':  'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,.3), 0 1px 2px rgba(0,0,0,.2)',
        'card-md':   '0 4px 12px rgba(0,0,0,.4)',
        'card-lg':   '0 8px 24px rgba(0,0,0,.5)',
        'modal':     '0 24px 64px rgba(0,0,0,.8)',
        'sidebar':   '-4px 0 24px rgba(0,0,0,.6)',
        'gold':      '0 0 20px rgba(195,147,72,.15)',
        'glow-gold': '0 0 35px rgba(195,147,72,.25)',
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
