import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

/* ── Stat Card ────────────────────────────────────────────────────── */
const StatCard = ({ title, value, icon, gradient, delta, loading }) => (
  <div className="card-hover p-5 flex flex-col gap-4 group">
    <div className="flex items-start justify-between">
      <div className={`stat-icon-box ${gradient}`}>
        {icon}
      </div>
      {delta !== undefined && (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full
          ${delta >= 0
            ? 'bg-success-50 text-success-700 ring-1 ring-success-100'
            : 'bg-danger-50 text-danger-700 ring-1 ring-danger-100'}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-1.5">{title}</p>
      {loading ? (
        <div className="h-8 w-28 skeleton" />
      ) : (
        <p className="text-3xl font-bold text-surface-900 tracking-tight">{value}</p>
      )}
    </div>
  </div>
);

/* ── Status badge ─────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    Active:    'badge-green',
    Completed: 'badge-blue',
    Pending:   'badge-yellow',
    Cancelled: 'badge-red',
  };
  return (
    <span className={map[status] || 'badge-gray'}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {status}
    </span>
  );
};

/* ── Dashboard ────────────────────────────────────────────────────── */
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRentals: 0, availableCars: 0, totalCustomers: 0, revenue: 0, loading: true,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 900));
        setStats({ totalRentals: 45, availableCars: 23, totalCustomers: 156, revenue: 12450, loading: false });
        setRecentBookings([
          { id: 1, customerName: 'John Doe',     carModel: 'Toyota Camry',      startDate: '2024-06-01', endDate: '2024-06-05', status: 'Active',    amount: 320 },
          { id: 2, customerName: 'Jane Smith',   carModel: 'Honda Civic',       startDate: '2024-06-02', endDate: '2024-06-04', status: 'Completed', amount: 180 },
          { id: 3, customerName: 'Mike Johnson', carModel: 'BMW X5',            startDate: '2024-06-03', endDate: '2024-06-10', status: 'Active',    amount: 850 },
          { id: 4, customerName: 'Sarah Wilson', carModel: 'Mercedes C-Class',  startDate: '2024-06-01', endDate: '2024-06-03', status: 'Completed', amount: 450 },
          { id: 5, customerName: 'Alex Turner',  carModel: 'Audi Q5',           startDate: '2024-06-05', endDate: '2024-06-08', status: 'Pending',   amount: 540 },
        ]);
        setLoadingBookings(false);
      } catch {
        toast.error('Failed to load dashboard data');
        setStats((p) => ({ ...p, loading: false }));
        setLoadingBookings(false);
      }
    };
    load();
  }, []);

  const statCards = [
    {
      title: 'Active Rentals',
      value: stats.totalRentals,
      delta: 12,
      gradient: 'bg-gradient-primary',
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>,
    },
    {
      title: 'Available Cars',
      value: stats.availableCars,
      delta: 5,
      gradient: 'bg-gradient-success',
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1h3l3-3-1-5h-5v8zm-8 0h8" />
      </svg>,
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      delta: 8,
      gradient: 'bg-gradient-info',
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>,
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      delta: 18,
      gradient: 'bg-gradient-warning',
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>,
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Good morning, Admin 👋</h1>
          <p className="page-subtitle">Here's what's happening with your fleet today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-surface-400 font-medium
                        bg-white border border-surface-100 px-3 py-2 rounded-xl shadow-card">
          <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse-dot" />
          All systems operational
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} loading={stats.loading} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Bookings table */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
            <div>
              <h2 className="text-base font-bold text-surface-800">Recent Bookings</h2>
              <p className="text-xs text-surface-400 mt-0.5">Latest 5 reservations</p>
            </div>
            <span className="pill-primary">Live</span>
          </div>

          {loadingBookings ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="skeleton h-4 w-1/4" />
                  <div className="skeleton h-4 w-1/4" />
                  <div className="skeleton h-4 w-1/5" />
                  <div className="skeleton h-4 w-1/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Car</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
                            {b.customerName.charAt(0)}
                          </div>
                          <span className="font-semibold text-surface-900 text-sm">{b.customerName}</span>
                        </div>
                      </td>
                      <td className="text-surface-600 text-sm">{b.carModel}</td>
                      <td className="text-xs text-surface-400 tabular">
                        {b.startDate} → {b.endDate}
                      </td>
                      <td><StatusBadge status={b.status} /></td>
                      <td className="text-right font-bold text-surface-800">${b.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-surface-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-primary inline-block" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Add New Vehicle',  gradient: 'bg-gradient-primary', icon: '🚗' },
                { label: 'New Booking',      gradient: 'bg-gradient-success', icon: '📅' },
                { label: 'Add Customer',     gradient: 'bg-gradient-info',    icon: '👤' },
              ].map(({ label, gradient, icon }) => (
                <button key={label}
                  className={`w-full ${gradient} text-white btn-md justify-start gap-3 text-sm font-semibold
                              rounded-xl shadow-sm hover:brightness-110 active:scale-[.97] transition-all`}>
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-surface-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-success inline-block" />
              System Status
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Database',    status: 'Online',    color: 'bg-success-500', ok: true },
                { label: 'API Server',  status: 'Running',   color: 'bg-success-500', ok: true },
                { label: 'Last Backup', status: '2 hrs ago', color: null,             ok: false },
              ].map(({ label, status, color, ok }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-surface-500">{label}</span>
                  <span className={`flex items-center gap-1.5 font-semibold text-xs
                    ${ok ? 'text-success-700' : 'text-surface-400'}`}>
                    {color && <span className={`w-2 h-2 rounded-full ${color} animate-pulse-dot`} />}
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-surface-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-warning inline-block" />
              Alerts
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-50 border border-warning-100">
                <span className="text-warning-500 mt-0.5 text-base flex-shrink-0">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-warning-900">Maintenance Due</p>
                  <p className="text-xs text-warning-600 mt-0.5">3 vehicles need service soon</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
                <span className="text-primary-500 mt-0.5 text-base flex-shrink-0">📋</span>
                <div>
                  <p className="text-sm font-semibold text-primary-900">New Booking</p>
                  <p className="text-xs text-primary-600 mt-0.5">Received 5 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;