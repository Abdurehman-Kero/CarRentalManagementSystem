import React, { useEffect, useState } from 'react';
import branchService from '../services/branchService';
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
    <span className="text-[11px] text-primary-400 font-bold uppercase tracking-[0.25em]">Loading branches…</span>
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

/* ── Branches ────────────────────────────────────────────────────── */
const Branches = () => {
  const [branches, setBranches]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingBranch, setEdit]    = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const emptyForm = { BranchID: '', BranchName: '', City: '', State: '', Phone: '' };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try {
      const res = await branchService.getAllBranches();
      setBranches(Array.isArray(res) ? res : []);
    } catch { toast.error('Failed to fetch branches'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBranch) {
        await branchService.updateBranch(editingBranch.BranchID, form);
        toast.success('Branch updated successfully');
      } else {
        await branchService.createBranch(form);
        toast.success('Branch added successfully');
      }
      closeModal(); fetchBranches();
    } catch (e) { toast.error(e?.error || 'Failed to save branch'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (b) => { setEdit(b); setForm({ ...b }); setShowModal(true); };
  
  const handleDelete = (id) => setConfirmDelete(id);

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await branchService.deleteBranch(id);
      toast.success('Branch deleted');
      fetchBranches();
    } catch (e) { toast.error(e?.error || 'Failed to delete branch. Ensure it has no cars.'); }
  };

  const closeModal = () => { setShowModal(false); setEdit(null); setForm(emptyForm); };

  const filtered = branches.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.BranchName?.toLowerCase().includes(q) ||
      b.City?.toLowerCase().includes(q) ||
      b.State?.toLowerCase().includes(q) ||
      b.Phone?.includes(q)
    );
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Branches</h1>
          <p className="page-subtitle">{branches.length} active branch{branches.length !== 1 ? 'es' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Branch
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search branches…"
          className="input-field pl-10" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">
              {search ? 'No branches match' : 'No branches yet'}
            </p>
            {!search && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4">Add First Branch</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Location</th>
                  <th>Contact Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.BranchID}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                        text-white text-sm font-bold flex-shrink-0
                                        bg-gradient-to-br ${getGradient(b.BranchID)}`}>
                          {b.BranchName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-surface-900 text-sm">{b.BranchName}</p>
                          <p className="text-xs text-surface-400">ID: {b.BranchID}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm text-surface-700">{b.City}</p>
                      <p className="text-xs text-surface-400">{b.State}</p>
                    </td>
                    <td>
                      <p className="text-sm text-surface-700 tabular">{b.Phone}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(b)}
                          className="btn-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl font-bold transition-all">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(b.BranchID)}
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
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box max-w-sm">
            <div className="modal-header">
              <div>
                <h2 className="text-lg font-bold text-surface-900">
                  {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                </h2>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="input-label">Branch ID</label>
                  <input type="number" placeholder="Unique ID"
                    className="input-field" value={form.BranchID}
                    onChange={(e) => set('BranchID', e.target.value)}
                    required disabled={!!editingBranch} />
                </div>
                <div>
                  <label className="input-label">Branch Name</label>
                  <input type="text" placeholder="Downtown Hub" className="input-field"
                    value={form.BranchName} onChange={(e) => set('BranchName', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">City</label>
                    <input type="text" placeholder="City" className="input-field"
                      value={form.City} onChange={(e) => set('City', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">State</label>
                    <input type="text" placeholder="NY" className="input-field"
                      value={form.State} onChange={(e) => set('State', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Phone</label>
                  <input type="text" placeholder="+1 555 000 0000" className="input-field"
                    value={form.Phone} onChange={(e) => set('Phone', e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Branch'}
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
        title="Delete Branch"
        message="Are you sure you want to delete this branch? Make sure it has no cars associated with it."
        confirmText="Yes, Delete"
        cancelText="Keep Branch"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Branches;
