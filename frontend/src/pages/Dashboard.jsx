import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import carService      from '../services/carService';
import customerService from '../services/customerService';
import bookingService  from '../services/bookingService';
import rentalService   from '../services/rentalService';

/* ── Stat Card ────────────────────────────────────────────────────── */
const StatCard = ({ title, value, icon, gradient, delta, loading }) => (
  <div className="card-hover p-5 flex flex-col gap-4 group">
    <div className="flex items-start justify-between">
      <div className={`stat-icon-box ${gradient}`}>
        {icon}
      </div>
      {delta !== undefined && (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full
          ${delta >= 0
            ? 'bg-success-50/20 text-success-500 ring-1 ring-success-500/20'
            : 'bg-danger-50/20 text-danger-400 ring-1 ring-danger-500/20'}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5">{title}</p>
      {loading ? (
        <div className="h-8 w-28 skeleton" />
      ) : (
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
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
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRentals: 0, availableCars: 0, totalCustomers: 0, revenue: 0, loading: true,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cars, customers, bookings, rentals] = await Promise.all([
          carService.getAllCars(),
          customerService.getAllCustomers(),
          bookingService.getAllBookings(),
          rentalService.getAllRentals(),
        ]);

        const carsArr      = Array.isArray(cars)      ? cars      : [];
        const customersArr = Array.isArray(customers)  ? customers : [];
        const bookingsArr  = Array.isArray(bookings)   ? bookings  : [];
        const rentalsArr   = Array.isArray(rentals)    ? rentals   : [];

        const available   = carsArr.filter(c => c.Status === 'Available').length;
        const activeRents = rentalsArr.filter(r => !r.ActualReturnDate).length;
        const revenue     = rentalsArr.reduce((s, r) => s + parseFloat(r.TotalAmount || 0), 0);

        setStats({
          totalRentals:   activeRents,
          availableCars:  available,
          totalCustomers: customersArr.length,
          revenue:        Math.round(revenue),
          loading:        false,
        });

        // 5 most recent bookings
        setRecentBookings(
          bookingsArr.slice(0, 5).map(b => ({
            id:           b.BookingID,
            customerName: b.CustomerName || 'N/A',
            carModel:     `${b.Brand || ''} ${b.Model || ''}`.trim() || 'N/A',
            startDate:    b.PickupDate ? new Date(b.PickupDate).toLocaleDateString() : 'N/A',
            endDate:      b.ReturnDate ? new Date(b.ReturnDate).toLocaleDateString() : 'N/A',
            status:       b.Status,
            amount:       b.TotalAmount || 0,
          }))
        );
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
      icon: <svg className="w-6 h-6 text-surface-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>,
    },
    {
      title: 'Available Cars',
      value: stats.availableCars,
      delta: 5,
      gradient: 'bg-gradient-success',
      icon: <svg className="w-6 h-6 text-surface-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
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
          <h1 className="page-title">Welcome Back, Admin 👋</h1>
          <p className="page-subtitle">Here is the luxury fleet overview for today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-surface-400 font-bold
                        bg-surface-900 border border-surface-800 px-3.5 py-2.5 rounded-xl shadow-card">
          <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse-dot" />
          All luxury systems active
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
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800">
            <div>
              <h2 className="text-base font-bold text-white">Recent Reservations</h2>
              <p className="text-xs text-surface-400 mt-0.5">Latest premium vehicle bookings</p>
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
                    <th>Car Model</th>
                    <th>Rental Period</th>
                    <th>Status</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-surface-950 text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #D5B277, #846029)' }}>
                            {b.customerName.charAt(0)}
                          </div>
                          <span className="font-semibold text-white text-sm">{b.customerName}</span>
                        </div>
                      </td>
                      <td className="text-surface-300 text-sm font-medium">{b.carModel}</td>
                      <td className="text-xs text-surface-400 tabular font-medium">
                        {b.startDate} — {b.endDate}
                      </td>
                      <td><StatusBadge status={b.status} /></td>
                      <td className="text-right font-bold text-white">${b.amount}</td>
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
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-primary inline-block" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Add New Vehicle',  gradient: 'btn-primary text-surface-950', icon: '🚗', path: '/dashboard/cars' },
                { label: 'New Reservation',  gradient: 'bg-success-600 hover:bg-success-700 text-white', icon: '📅', path: '/dashboard/bookings' },
                { label: 'Register Customer', gradient: 'bg-info-600 hover:bg-info-700 text-white',    icon: '👤', path: '/dashboard/customers' },
              ].map(({ label, gradient, icon, path }) => (
                <button key={label}
                  onClick={() => navigate(path, { state: { openAddModal: true } })}
                  className={`w-full ${gradient} btn-md justify-start gap-3 text-sm font-semibold
                              rounded-xl shadow-sm active:scale-[.97] transition-all`}>
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-success inline-block" />
              System Diagnostics
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Database Service', status: 'Online',    color: 'bg-success-500', ok: true },
                { label: 'API Server Host', status: 'Running',   color: 'bg-success-500', ok: true },
                { label: 'Last Cloud Backup', status: '2 hrs ago', color: null,             ok: false },
              ].map(({ label, status, color, ok }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-surface-400 font-medium">{label}</span>
                  <span className={`flex items-center gap-1.5 font-bold text-xs
                    ${ok ? 'text-success-500' : 'text-surface-400'}`}>
                    {color && <span className={`w-2 h-2 rounded-full ${color} animate-pulse-dot`} />}
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-warning inline-block" />
              System Alerts
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-50/5 border border-warning-500/10">
                <span className="text-warning-500 mt-0.5 text-base flex-shrink-0">⚠️</span>
                <div>
                  <p className="text-sm font-bold text-warning-500">Fleet Maintenance Due</p>
                  <p className="text-xs text-surface-400 mt-0.5">3 vehicles need inspections soon</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-primary-950/20 border border-primary-500/10">
                <span className="text-primary-400 mt-0.5 text-base flex-shrink-0">📋</span>
                <div>
                  <p className="text-sm font-bold text-primary-400">Reservation Confirmed</p>
                  <p className="text-xs text-surface-400 mt-0.5">Received 5 minutes ago</p>
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