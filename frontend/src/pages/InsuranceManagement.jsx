import React, { useEffect, useState } from 'react';
import insuranceService from '../services/insuranceService';
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
    <span className="text-[11px] text-primary-400 font-bold uppercase tracking-[0.25em]">Loading insurances…</span>
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

const formatCurrency = (val) => {
  if (val == null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

/* ── InsuranceManagement ────────────────────────────────────────────── */
const InsuranceManagement = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEdit]          = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const emptyForm = { InsuranceID: '', InsuranceType: '', Cost: '' };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { fetchInsurances(); }, []);

  const fetchInsurances = async () => {
    try {
      const res = await insuranceService.getAllInsurances();
      setInsurances(Array.isArray(res) ? res : []);
    } catch { toast.error('Failed to fetch insurances'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await insuranceService.updateInsurance(editing.InsuranceID, form);
        toast.success('Insurance updated successfully');
      } else {
        await insuranceService.createInsurance(form);
        toast.success('Insurance added successfully');
      }
      closeModal(); fetchInsurances();
    } catch (e) { toast.error(e?.error || 'Failed to save insurance'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (i) => { setEdit(i); setForm({ ...i }); setShowModal(true); };
  
  const handleDelete = (id) => setConfirmDelete(id);

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await insuranceService.deleteInsurance(id);
      toast.success('Insurance deleted');
      fetchInsurances();
    } catch (e) { toast.error(e?.error || 'Failed to delete insurance'); }
  };

  const closeModal = () => { setShowModal(false); setEdit(null); setForm(emptyForm); };

  const filtered = insurances.filter((i) => {
    const q = search.toLowerCase();
    return i.InsuranceType?.toLowerCase().includes(q);
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Insurance Plans</h1>
          <p className="page-subtitle">{insurances.length} available plan{insurances.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Insurance
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search insurance types…"
          className="input-field pl-10" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">
              {search ? 'No plans match' : 'No insurance plans yet'}
            </p>
            {!search && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4">Add First Plan</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filtered.map((i) => (
              <div key={i.InsuranceID} className="flex flex-col border border-surface-200 rounded-2xl p-5 hover:border-primary-200 hover:shadow-lg transition-all bg-white relative group">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 bg-gradient-to-br ${getGradient(i.InsuranceID)}`}>
                    {i.InsuranceType?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-900">{i.InsuranceType}</h3>
                    <p className="text-xs text-surface-400">ID: {i.InsuranceID}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-surface-100 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">Fixed Cost</p>
                    <p className="text-xl font-bold text-primary-600">{formatCurrency(i.Cost)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(i)} className="btn-icon bg-surface-100 hover:bg-surface-200 text-surface-600 w-8 h-8">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(i.InsuranceID)} className="btn-icon bg-danger-50 hover:bg-danger-100 text-danger-500 w-8 h-8">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                  {editing ? 'Edit Insurance' : 'Add New Insurance'}
                </h2>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="input-label">Insurance ID</label>
                  <input type="number" placeholder="Unique ID"
                    className="input-field" value={form.InsuranceID}
                    onChange={(ev) => set('InsuranceID', ev.target.value)}
                    required disabled={!!editing} />
                </div>
                <div>
                  <label className="input-label">Insurance Type</label>
                  <input type="text" placeholder="Full Coverage" className="input-field"
                    value={form.InsuranceType} onChange={(ev) => set('InsuranceType', ev.target.value)} required />
                </div>
                <div>
                  <label className="input-label">Cost ($)</label>
                  <input type="number" step="0.01" min="0" placeholder="50.00" className="input-field"
                    value={form.Cost} onChange={(ev) => set('Cost', ev.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Plan'}
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
        title="Delete Insurance Plan"
        message="Are you sure you want to delete this insurance plan? It will be removed from future bookings."
        confirmText="Yes, Delete"
        cancelText="Keep Plan"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default InsuranceManagement;
