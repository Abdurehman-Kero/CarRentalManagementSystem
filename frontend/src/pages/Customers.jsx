import React, { useEffect, useState } from 'react';
import customerService from '../services/customerService';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
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
    <span className="text-[11px] text-primary-400 font-bold uppercase tracking-[0.25em]">Loading customers…</span>
  </div>
);

const CloseBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="btn-icon" aria-label="Close">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const avatarGradients = [
  'from-primary-400 to-primary-600',
  'from-violet-400 to-purple-600',
  'from-info-500 to-primary-500',
  'from-success-500 to-info-500',
  'from-warning-500 to-danger-500',
];
const getGradient = (id) => avatarGradients[id % avatarGradients.length];

/* ── Customers ────────────────────────────────────────────────────── */
const Customers = () => {
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingCustomer, setEdit]  = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // customer id to delete

  const emptyForm = {
    CustID: '', FullName: '', Email: '', Phone: '',
    StreetAddress: '', City: '', State: '', ZipCode: '', DriverLicenseNo: '',
  };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const location = useLocation();

  useEffect(() => {
    fetchCustomers();
    if (location.state?.openAddModal) {
      setShowModal(true);
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchCustomers = async () => {
    try {
      const res = await customerService.getAllCustomers();
      setCustomers(Array.isArray(res) ? res : []);
    } catch { toast.error('Failed to fetch customers'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.CustID, form);
        toast.success('Customer updated successfully');
      } else {
        await customerService.createCustomer(form);
        toast.success('Customer added successfully');
      }
      closeModal(); fetchCustomers();
    } catch (e) { toast.error(e?.error || 'Failed to save customer'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (c) => { setEdit(c); setForm({ ...c }); setShowModal(true); };

  const handleDelete = (id, hasBookings) => {
    if (hasBookings) { toast.error('Cannot delete customer with active bookings'); return; }
    setConfirmDelete(id);
  };

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await customerService.deleteCustomer(id);
      toast.success('Customer deleted');
      fetchCustomers();
    } catch { toast.error('Failed to delete customer'); }
  };

  const closeModal = () => { setShowModal(false); setEdit(null); setForm(emptyForm); };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.FullName?.toLowerCase().includes(q) ||
      c.Email?.toLowerCase().includes(q) ||
      c.Phone?.includes(q) ||
      c.City?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{customers.length} registered customer{customers.length !== 1 ? 's' : ''}</p>
        </div>
        <button id="add-customer-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input id="customer-search" type="text" placeholder="Search name, email, city…"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">
              {search ? 'No customers match' : 'No customers yet'}
            </p>
            <p className="text-surface-400 text-sm mt-1">
              {search ? `No results for "${search}"` : 'Add your first customer to get started.'}
            </p>
            {!search && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4">Add First Customer</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Driver License</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.CustID}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                        text-white text-sm font-bold flex-shrink-0
                                        bg-gradient-to-br ${getGradient(c.CustID)}`}>
                          {c.FullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-surface-900 text-sm">{c.FullName}</p>
                          <p className="text-xs text-surface-400">ID: {c.CustID}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm text-surface-700">{c.Email}</p>
                      <p className="text-xs text-surface-400 tabular mt-0.5">{c.Phone}</p>
                    </td>
                    <td>
                      <span className="mono-tag">{c.DriverLicenseNo}</span>
                    </td>
                    <td className="text-surface-600 text-sm">{c.City}{c.State ? `, ${c.State}` : ''}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button id={`edit-customer-${c.CustID}`} onClick={() => handleEdit(c)}
                          className="btn-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl font-bold transition-all">
                          Edit
                        </button>
                        <button id={`delete-customer-${c.CustID}`}
                          onClick={() => handleDelete(c.CustID, c.bookings?.length > 0)}
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
          <div className="modal-box max-w-lg">
            <div className="modal-header">
              <div>
                <h2 className="text-lg font-bold text-surface-900">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  {editingCustomer ? `Editing ${editingCustomer.FullName}` : 'Fill in customer details'}
                </p>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">

                <div>
                  <label className="input-label">Customer ID</label>
                  <input id="cust-id-input" type="number" placeholder="Unique ID"
                    className="input-field" value={form.CustID}
                    onChange={(e) => set('CustID', e.target.value)}
                    required disabled={!!editingCustomer} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Full Name</label>
                    <input type="text" placeholder="Jane Doe" className="input-field"
                      value={form.FullName} onChange={(e) => set('FullName', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Email</label>
                    <input type="email" placeholder="jane@example.com" className="input-field"
                      value={form.Email} onChange={(e) => set('Email', e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Phone</label>
                    <input type="text" placeholder="+1 555 000 0000" className="input-field"
                      value={form.Phone} onChange={(e) => set('Phone', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Driver License No.</label>
                    <input type="text" placeholder="DL-XXXXXXX" className="input-field font-mono"
                      value={form.DriverLicenseNo} onChange={(e) => set('DriverLicenseNo', e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="input-label">Street Address</label>
                  <input type="text" placeholder="123 Main Street" className="input-field"
                    value={form.StreetAddress} onChange={(e) => set('StreetAddress', e.target.value)} required />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="input-label">City</label>
                    <input type="text" placeholder="City" className="input-field"
                      value={form.City} onChange={(e) => set('City', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">State</label>
                    <input type="text" placeholder="NY" className="input-field"
                      value={form.State} onChange={(e) => set('State', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Zip Code</label>
                    <input type="text" placeholder="10001" className="input-field tabular"
                      value={form.ZipCode} onChange={(e) => set('ZipCode', e.target.value)} required />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button id="save-customer-btn" type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : (editingCustomer ? 'Update Customer' : 'Add Customer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation */}
      <ConfirmModal
        open={!!confirmDelete}
        variant="danger"
        title="Delete Customer"
        message="This will permanently delete the customer and all their data. This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Keep Customer"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Customers;
