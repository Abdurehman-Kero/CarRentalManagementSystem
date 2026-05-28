import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Fleet',
    href: '/dashboard/cars',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1h3l3-3-1-5h-5v8zm-8 0h8" />
      </svg>
    ),
  },
  {
    name: 'Bookings',
    href: '/dashboard/bookings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: 'Rentals',
    href: '/dashboard/rentals',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { admin, logout, isSuperAdmin } = useAuth();
  const [isLight, setIsLight] = useState(document.body.classList.contains('light-theme'));

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      setIsLight(true);
    } else {
      document.body.classList.remove('light-theme');
      setIsLight(false);
    }
  }, []);

  const toggleTheme = () => {
    if (document.body.classList.contains('light-theme')) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  const isActive = (href) =>
    href === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(href);

  const currentPage = navigation.find((n) => isActive(n.href))?.name || 'Dashboard';

  const handleLogout = () => {
    navigate('/login', { replace: true });
    setTimeout(() => {
      logout();
      toast.success('Signed out successfully');
    }, 50);
  };

  const initials = admin?.fullName
    ? admin.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <div className="flex min-h-screen bg-surface-950 text-surface-100 w-full">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          shadow-sidebar border-r border-surface-900
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ background: 'linear-gradient(180deg, #05070B 0%, #111827 50%, #05070B 100%)' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-surface-900 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FFEAA7 0%, #C39348 100%)', boxShadow: '0 4px 12px rgba(195,147,72,0.4)' }}>
            <svg className="w-5 h-5 text-surface-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1h3l3-3-1-5h-5v8zm-8 0h8" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight leading-none">Sheger Drive</p>
            <p className="text-[10px] text-primary-400 mt-0.5 uppercase tracking-[0.2em] font-semibold">Luxury Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
          <p className="px-3.5 mb-3 text-[10px] font-bold text-surface-500 uppercase tracking-[0.2em]">
            Navigation
          </p>
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={active ? 'nav-item-active' : 'nav-item-inactive'}
              >
                {active && (
                  <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none" />
                )}
                <span className={`flex-shrink-0 ${active ? 'text-surface-950' : 'text-surface-500'}`}>
                  {item.icon}
                </span>
                <span className={active ? 'text-surface-950 font-bold' : ''}>{item.name}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-surface-950 animate-pulse-dot" />
                )}
              </Link>
            );
          })}

          {/* Admin section (super admin only) */}
          {isSuperAdmin && (
            <>
              <p className="px-3.5 mt-5 mb-3 text-[10px] font-bold text-surface-500 uppercase tracking-[0.2em]">
                Super Admin
              </p>
              <Link
                to="/dashboard/admins"
                onClick={() => setSidebarOpen(false)}
                className={location.pathname === '/dashboard/admins' ? 'nav-item-active' : 'nav-item-inactive'}
              >
                <span className={`flex-shrink-0 ${location.pathname === '/dashboard/admins' ? 'text-surface-950' : 'text-surface-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <span className={location.pathname === '/dashboard/admins' ? 'text-surface-950 font-bold' : ''}>Manage Admins</span>
              </Link>
            </>
          )}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-surface-900" />

        {/* User profile + logout */}
        <div className="flex-shrink-0 px-3 py-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-900 border border-surface-800">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-surface-950 text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D5B277, #846029)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{admin?.fullName || 'Admin'}</p>
              <p className="text-xs text-surface-400 truncate">{admin?.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-surface-800 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════
          MAIN AREA
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-950">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-4 sm:px-6
                           bg-surface-950/70 backdrop-blur-xl border-b border-surface-900/80
                           shadow-sm flex-shrink-0">

          {/* Hamburger */}
          <button
            id="sidebar-toggle"
            type="button"
            className="btn-icon lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-surface-500 hidden sm:block text-xs">Pages</span>
            <svg className="w-3 h-3 text-surface-800 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-semibold text-white text-sm">{currentPage}</span>
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-2">

            {/* Super Admin badge */}
            {isSuperAdmin && (
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(195,147,72,0.1)', color: '#DFBA73', border: '1px solid rgba(195,147,72,0.2)' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Super Admin
              </span>
            )}

            {/* Date */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-surface-300 font-medium
                            bg-surface-900 border border-surface-800 px-3 py-1.5 rounded-xl">
              <svg className="w-3.5 h-3.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>

            {/* Theme Toggler */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-primary-400 transition-colors border border-surface-800 hover:border-primary-500/30"
              title="Toggle Color Theme"
            >
              {isLight ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-4.95a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zm1.414 8.486a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464a1 1 0 111.414-1.414l-.707-.707a1 1 0 01-1.414 1.414l.707.707zm1.414 8.486a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Profile dropdown toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(p => !p)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-950 text-sm font-bold
                           cursor-pointer ring-2 ring-surface-800 hover:ring-primary-500 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #D5B277, #846029)' }}
                aria-label="Profile menu"
              >
                {initials}
              </button>

              {/* Click outside to close dropdown */}
              {profileOpen && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setProfileOpen(false)} />
              )}

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface-900 rounded-2xl shadow-modal
                                border border-surface-800 overflow-hidden z-50 animate-slide-up">
                  <div className="px-4 py-3 border-b border-surface-800">
                    <p className="text-sm font-bold text-white truncate">{admin?.fullName}</p>
                    <p className="text-xs text-surface-400 truncate">{admin?.email}</p>
                    <span className="inline-flex mt-1 items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: isSuperAdmin ? 'rgba(195,147,72,0.1)' : 'rgba(16,185,129,0.1)',
                               color: isSuperAdmin ? '#D5B277' : '#059669' }}>
                      {isSuperAdmin ? '⭐ Super Admin' : '🛡️ Admin'}
                    </span>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-semibold
                               text-danger-400 hover:bg-danger-50/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-surface-900 bg-surface-950/50">
          <p className="text-xs text-surface-500 text-center">
            Sheger Drive Management System &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;