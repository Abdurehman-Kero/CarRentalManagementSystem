import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

/* ── Helpers ──────────────────────────────────────────────────── */
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

/* ── Role badge ───────────────────────────────────────────────── */
const RoleBadge = ({ role }) => {
  const isSA = role === 'superadmin';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold
      ${isSA
        ? 'bg-violet-950/40 text-violet-400 ring-1 ring-violet-500/25'
        : 'bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/25'}`}>
      {isSA ? '⭐' : '🛡️'} {isSA ? 'Super Admin' : 'Admin'}
    </span>
  );
};

/* ── Add Admin Modal ──────────────────────────────────────────── */
const AddAdminModal = ({ onClose, onAdded }) => {
  const [form, setForm]     = useState({ fullName: '', email: '', password: '' });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      toast.error('All fields are required');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/admins', form);
      toast.success(`Admin "${res.data.data.FullName}" added!`);
      onAdded(res.data.data);
      onClose();
    } catch {
      // error toast shown by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="text-base font-bold text-surface-900">Add New Admin</h2>
            <p className="text-xs text-surface-400 mt-0.5">They'll receive full dashboard access</p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            <div>
              <label className="input-label">Full Name</label>
              <input
                className="input-field"
                placeholder="John Smith"
                value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  disabled={loading}
                />
                <button type="button" onClick={() => setShow(p => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-surface-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {show
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Adding…</>
                : '+ Add Admin'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Delete Confirm Modal ─────────────────────────────────────── */
const DeleteModal = ({ admin, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/auth/admins/${admin.AdminID}`);
      toast.success(`Admin "${admin.FullName}" removed`);
      onDeleted(admin.AdminID);
      onClose();
    } catch {
      // interceptor shows error
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-base font-bold text-surface-900">Remove Admin</h2>
          <button onClick={onClose} className="btn-icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 border border-danger-500/10 mb-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-bold text-danger-500">This cannot be undone</p>
              <p className="text-xs text-surface-400 mt-0.5">
                <strong>{admin.FullName}</strong> will lose all access immediately.
              </p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
          <button onClick={handleDelete} className="btn-danger" disabled={loading}>
            {loading ? 'Removing…' : 'Yes, Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const AdminsManagement = () => {
  const { admin: currentAdmin, isSuperAdmin } = useAuth();
  const [admins, setAdmins]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/admins');
      setAdmins(res.data.data || []);
    } catch {
      // interceptor shows error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg,#f43f5e,#e11d48)' }}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-surface-900">Access Restricted</h2>
        <p className="text-sm text-surface-400 mt-2 max-w-xs">
          Only the Super Admin can manage admin accounts.
        </p>
      </div>
    );
  }

  const onAdded   = (newAdmin) => setAdmins(p => [...p, newAdmin]);
  const onDeleted = (id)       => setAdmins(p => p.filter(a => a.AdminID !== id));

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Management</h1>
          <p className="page-subtitle">
            Manage who has access to the Sheger Drive dashboard
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Admin
        </button>
      </div>

      {/* Super Admin notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl
                      bg-surface-900 border border-violet-500/25">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-violet-400">You're logged in as Super Admin</p>
          <p className="text-xs text-surface-400 mt-0.5">
            Only you can add or remove admin accounts. Your account cannot be deleted.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Admins', value: loading ? '—' : admins.length,
            icon: '👥', color: 'bg-gradient-primary' },
          { label: 'Regular Admins', value: loading ? '—' : admins.filter(a => a.Role === 'admin').length,
            icon: '🛡️', color: 'bg-gradient-success' },
          { label: 'Super Admins', value: loading ? '—' : admins.filter(a => a.Role === 'superadmin').length,
            icon: '⭐', color: 'bg-gradient-warning' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card-hover p-4 flex items-center gap-3">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-surface-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Admins table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <div>
            <h2 className="text-base font-bold text-surface-800">All Admins</h2>
            <p className="text-xs text-surface-400 mt-0.5">
              {admins.length} account{admins.length !== 1 ? 's' : ''} with dashboard access
            </p>
          </div>
          <button onClick={fetchAdmins} className="btn-icon" title="Refresh">
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3.5 w-1/3" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
                <div className="skeleton h-5 w-20 rounded-full" />
                <div className="skeleton h-5 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        ) : admins.length === 0 ? (
          <div className="empty-state">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-surface-800">No admins yet</h3>
            <p className="text-sm text-surface-400 mt-1">Add your first admin to get started.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Added</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(a => {
                    const isSelf = a.Email === currentAdmin?.email;
                    const isSA   = a.Role === 'superadmin';
                    const initial = a.FullName?.[0]?.toUpperCase() || 'A';
                    return (
                      <tr key={a.AdminID}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background: isSA
                                ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                                : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                              {initial}
                            </div>
                            <div>
                              <p className="font-semibold text-surface-900 text-sm">{a.FullName}</p>
                              {isSelf && <span className="text-[10px] text-primary-500 font-bold">(You)</span>}
                            </div>
                          </div>
                        </td>
                        <td className="text-surface-500 text-sm">{a.Email}</td>
                        <td><RoleBadge role={a.Role} /></td>
                        <td className="text-xs text-surface-400">{formatDate(a.CreatedAt)}</td>
                        <td className="text-right">
                          {!isSA ? (
                            <button
                              onClick={() => setDeleteTarget(a)}
                              className="btn-xs bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 border border-danger-500/20 rounded-xl font-bold transition-all flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          ) : (
                            <span className="text-xs text-surface-300 italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-surface-50">
              {admins.map(a => {
                const isSelf = a.Email === currentAdmin?.email;
                const isSA   = a.Role === 'superadmin';
                const initial = a.FullName?.[0]?.toUpperCase() || 'A';
                return (
                  <div key={a.AdminID} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: isSA
                        ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                        : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-bold text-surface-900">{a.FullName}</p>
                        {isSelf && <span className="text-[10px] text-primary-500 font-bold">(You)</span>}
                        <RoleBadge role={a.Role} />
                      </div>
                      <p className="text-xs text-surface-400 truncate mt-0.5">{a.Email}</p>
                      <p className="text-xs text-surface-300 mt-0.5">Added {formatDate(a.CreatedAt)}</p>
                    </div>
                    {!isSA && (
                      <button
                        onClick={() => setDeleteTarget(a)}
                        className="p-2 rounded-xl text-danger-500 hover:bg-danger-500/10 hover:text-danger-400 transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showAdd     && <AddAdminModal onClose={() => setShowAdd(false)} onAdded={onAdded} />}
      {deleteTarget && <DeleteModal admin={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={onDeleted} />}
    </div>
  );
};

export default AdminsManagement;
