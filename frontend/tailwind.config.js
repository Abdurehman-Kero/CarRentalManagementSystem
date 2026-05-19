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
        /* ── Primary: deep indigo-violet ── */
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        /* ── Sidebar/Surface: rich slate ── */
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        /* ── Accent: violet-pink gradient hint ── */
        accent: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        /* ── Success ── */
        success: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        /* ── Warning ── */
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        /* ── Danger ── */
        danger: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        /* ── Info/blue ── */
        info: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      backgroundImage: {
        'gradient-sidebar': 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
        'gradient-card':    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        'gradient-primary': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'gradient-success': 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
        'gradient-warning': 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
        'gradient-info':    'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
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
        'card':      '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        'card-md':   '0 4px 12px rgba(0,0,0,.08)',
        'card-lg':   '0 8px 24px rgba(0,0,0,.12)',
        'modal':     '0 24px 64px rgba(0,0,0,.35)',
        'sidebar':   '4px 0 24px rgba(0,0,0,.25)',
        'glow':      '0 0 20px rgba(99,102,241,.35)',
        'glow-sm':   '0 0 10px rgba(99,102,241,.25)',
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
