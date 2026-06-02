import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ── Floating luxury particles ─────────────────────────────────── */
const Particle = ({ emoji, style }) => (
  <div className="absolute opacity-15 text-4xl pointer-events-none select-none text-primary-300" style={style}>
    {emoji}
  </div>
);

const Login = () => {
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from?.pathname || '/dashboard';
  const from = fromPath === '/' ? '/dashboard' : fromPath;

  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (admin) navigate(from, { replace: true });
  }, [admin, navigate, from]);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      toast.error('Please fill in both fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome to Sheger Drive Premium 👋');
      navigate(from, { replace: true });
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  /* Particles config with luxury sparkles and premium cars */
  const particles = [
    { emoji: '✨', top: '8%',  left: '5%',  animation: 'float1 6s ease-in-out infinite', fontSize: '2rem' },
    { emoji: '🚗', top: '20%', right: '4%', animation: 'float2 8s ease-in-out infinite', fontSize: '1.8rem' },
    { emoji: '✦', top: '55%', left: '2%', animation: 'float3 7s ease-in-out infinite', fontSize: '2.5rem' },
    { emoji: '✨', top: '75%', right: '6%', animation: 'float1 9s ease-in-out infinite', fontSize: '1.8rem' },
    { emoji: '🚗', top: '88%', left: '12%', animation: 'float2 5s ease-in-out infinite', fontSize: '1.5rem' },
    { emoji: '✦', top: '40%', right: '2%', animation: 'float3 11s ease-in-out infinite', fontSize: '2rem' },
  ];

  return (
    <>
      <style>{`
        @keyframes float1 {
          0%,100% { transform: translateY(0px) rotate(-5deg); }
          50%      { transform: translateY(-18px) rotate(5deg); }
        }
        @keyframes float2 {
          0%,100% { transform: translateY(0px) rotate(8deg); }
          50%      { transform: translateY(-24px) rotate(-8deg); }
        }
        @keyframes float3 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-12px) rotate(-6deg); }
          66%      { transform: translateY(-20px) rotate(6deg); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
        @keyframes glow-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(195,147,72,0.25), 0 0 60px rgba(195,147,72,0.05); }
          50%      { box-shadow: 0 0 40px rgba(195,147,72,0.45), 0 0 80px rgba(167,123,55,0.15); }
        }
        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .login-card-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
        .glow-input:focus {
          box-shadow: 0 0 0 3px rgba(195,147,72,0.2), 0 1px 3px rgba(0,0,0,0.4);
          border-color: #C39348;
          outline: none;
        }
        .bg-animated {
          background: linear-gradient(-45deg, #05070B, #111827, #1A160F, #0B0F19, #05070B);
          background-size: 400% 400%;
          animation: gradient-shift 12s ease infinite;
        }
        .card-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .btn-shine {
          background: linear-gradient(135deg, #FFEAA7 0%, #D5B277 50%, #846029 100%);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          color: #05070b;
          transition: all 0.2s;
        }
        .btn-shine:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .btn-shine:active { transform: translateY(0); }

      `}</style>

      <div className="bg-animated min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">

        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} emoji={p.emoji} style={{ ...p }} />
        ))}

        {/* Radial gold-glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(195,147,72,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(195,147,72,0.05) 0%, transparent 70%)', filter: 'blur(50px)' }} />

        {/* Card */}
        <div
          className={`relative z-10 w-full max-w-md card-glow ${shake ? 'login-card-shake' : ''}`}
          style={{
            background: 'rgba(11,15,25,0.9)',
            backdropFilter: 'blur(30px)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '40px 36px',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #FFEAA7, #C39348)', boxShadow: '0 8px 32px rgba(195,147,72,0.35)' }}>
              <svg className="w-9 h-9 text-surface-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1h3l3-3-1-5h-5v8zm-8 0h8" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sheger Drive</h1>
            <p className="text-sm mt-1 text-surface-400 font-semibold uppercase tracking-[0.1em] text-center">
              Luxury Management Portal
            </p>
          </div>

          {/* Notice badge */}
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-6"
            style={{ background: 'rgba(195,147,72,0.06)', border: '1px solid rgba(195,147,72,0.15)' }}>
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#DFBA73' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs font-semibold" style={{ color: '#E4CDA6' }}>
              Authorized personnel only. All access is logged.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-widest text-surface-400">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="keroabdurehman@gmail.com"
                  autoComplete="email"
                  className="input-field pl-11"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-widest text-surface-400">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="nexus@0974"
                  autoComplete="current-password"
                  className="input-field pl-11 pr-11"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-surface-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-shine w-full mt-2 py-3.5 rounded-xl font-bold text-sm
                         flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-surface-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-surface-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-surface-500">
              Sheger Drive Management System © {new Date().getFullYear()}
            </p>
            <p className="text-[10px] mt-1 text-surface-600">
              Unauthorized access is strictly monitored and prosecuted
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
