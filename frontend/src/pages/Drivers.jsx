import React, { useEffect, useState } from 'react';
import driverService from '../services/driverService';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

/* ── Helpers ──────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in">
    <div className="relative flex items-center justify-center">
      <div className="absolute w-12 h-12 rounded-full border border-primary-500/10 animate-ping opacity-25" />
      <svg className="w-10 h-10 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
    <span className="text-[11px] text-primary-400 font-bold uppercase tracking-[0.25em]">Loading drivers…</span>
  </div>
);

const CloseBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="btn-icon" aria-label="Close">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const getGradient = (id) => {
  const gradients = [
    'from-primary-400 to-primary-600',
    'from-violet-400 to-purple-600',
    'from-info-500 to-primary-500',
    'from-success-500 to-info-500',
    'from-warning-500 to-danger-500',
  ];
  return gradients[id % gradients.length];
};

/* ── Drivers ────────────────────────────────────────────────────── */
const Drivers = () => {
  const [drivers, setDrivers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingDriver, setEdit]    = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const emptyForm = { DriverID: '', FullName: '', LicenseNumber: '', Phone: '' };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    try {
      const res = await driverService.getAllDrivers();
      setDrivers(Array.isArray(res) ? res : []);
    } catch { toast.error('Failed to fetch drivers'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingDriver) {
        await driverService.updateDriver(editingDriver.DriverID, form);
        toast.success('Driver updated successfully');
      } else {
        await driverService.createDriver(form);
        toast.success('Driver added successfully');
      }
      closeModal(); fetchDrivers();
    } catch (e) { toast.error(e?.error || 'Failed to save driver'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (d) => { setEdit(d); setForm({ ...d }); setShowModal(true); };
  
  const handleDelete = (id) => setConfirmDelete(id);

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await driverService.deleteDriver(id);
      toast.success('Driver deleted');
      fetchDrivers();
    } catch (e) { toast.error(e?.error || 'Failed to delete driver'); }
  };

  const closeModal = () => { setShowModal(false); setEdit(null); setForm(emptyForm); };

  const filtered = drivers.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.FullName?.toLowerCase().includes(q) ||
      d.LicenseNumber?.toLowerCase().includes(q) ||
      d.Phone?.includes(q)
    );
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Drivers</h1>
          <p className="page-subtitle">{drivers.length} registered driver{drivers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Driver
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search drivers…"
          className="input-field pl-10" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">
              {search ? 'No drivers match' : 'No drivers yet'}
            </p>
            {!search && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4">Add First Driver</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>License Number</th>
                  <th>Contact Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.DriverID}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                        text-white text-sm font-bold flex-shrink-0
                                        bg-gradient-to-br ${getGradient(d.DriverID)}`}>
                          {d.FullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-surface-900 text-sm">{d.FullName}</p>
                          <p className="text-xs text-surface-400">ID: {d.DriverID}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mono-tag">{d.LicenseNumber}</span>
                    </td>
                    <td>
                      <p className="text-sm text-surface-700 tabular">{d.Phone}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(d)}
                          className="btn-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl font-bold transition-all">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(d.DriverID)}
                          className="btn-xs bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 border border-danger-500/20 rounded-xl font-bold transition-all">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(ev) => ev.target === ev.currentTarget && closeModal()}>
          <div className="modal-box max-w-sm">
            <div className="modal-header">
              <div>
                <h2 className="text-lg font-bold text-surface-900">
                  {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                </h2>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="input-label">Driver ID</label>
                  <input type="number" placeholder="Unique ID"
                    className="input-field" value={form.DriverID}
                    onChange={(ev) => set('DriverID', ev.target.value)}
                    required disabled={!!editingDriver} />
                </div>
                <div>
                  <label className="input-label">Full Name</label>
                  <input type="text" placeholder="Sarah Jenkins" className="input-field"
                    value={form.FullName} onChange={(ev) => set('FullName', ev.target.value)} required />
                </div>
                <div>
                  <label className="input-label">License Number</label>
                  <input type="text" placeholder="DL-XXXXXX" className="input-field font-mono"
                    value={form.LicenseNumber} onChange={(ev) => set('LicenseNumber', ev.target.value)} required />
                </div>
                <div>
                  <label className="input-label">Phone</label>
                  <input type="text" placeholder="+1 555 000 0000" className="input-field"
                    value={form.Phone} onChange={(ev) => set('Phone', ev.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!confirmDelete}
        variant="danger"
        title="Delete Driver"
        message="Are you sure you want to delete this driver? They will be removed from all associated bookings."
        confirmText="Yes, Delete"
        cancelText="Keep Driver"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Drivers;
