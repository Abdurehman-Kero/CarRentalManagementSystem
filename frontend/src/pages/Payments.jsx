import React, { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';
import paymentMethodService from '../services/paymentMethodService';
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
    <span className="text-[11px] text-primary-400 font-bold uppercase tracking-[0.25em]">Loading payments…</span>
  </div>
);

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(d));
};

const formatCurrency = (val) => {
  if (val == null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

/* ── Payments ────────────────────────────────────────────────────── */
const Payments = () => {
  const [payments, setPayments]     = useState([]);
  const [methods, setMethods]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, mRes] = await Promise.all([
        paymentService.getAllPayments(),
        paymentMethodService.getAllPaymentMethods()
      ]);
      setPayments(Array.isArray(pRes) ? pRes : []);
      setMethods(Array.isArray(mRes) ? mRes : []);
    } catch { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const handleDelete = (payment) => setConfirmDelete({ bookingId: payment.BookingID, paymentId: payment.PaymentID });

  const doDelete = async () => {
    const { bookingId, paymentId } = confirmDelete;
    setConfirmDelete(null);
    try {
      await paymentService.deletePayment(bookingId, paymentId);
      toast.success('Payment deleted');
      fetchData();
    } catch (e) { toast.error(e?.error || 'Failed to delete payment'); }
  };

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const method = methods.find(m => m.MethodID === p.MethodID)?.MethodType || '';
    return (
      p.BookingID?.toString().includes(q) ||
      p.Status?.toLowerCase().includes(q) ||
      method.toLowerCase().includes(q)
    );
  });

  const getMethodName = (p) => p.MethodType || methods.find(m => m.MethodID === p.MethodID)?.MethodType || `Method #${p.MethodID}`;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">{payments.length} total payment{payments.length !== 1 ? 's' : ''} recorded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="relative max-w-xs">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search booking ID, status, method…"
          className="input-field pl-10" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">
              {search ? 'No payments match' : 'No payments yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Booking ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.PaymentID}>
                    <td>
                      <span className="mono-tag">{p.PaymentID}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-surface-800 text-sm">#{p.BookingID}</span>
                    </td>
                    <td>
                      <span className="font-bold text-success-600">{formatCurrency(p.Amount)}</span>
                    </td>
                    <td>
                      <span className="text-sm text-surface-600">{getMethodName(p)}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        p.Status === 'Completed' ? 'badge-success' :
                        p.Status === 'Pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {p.Status}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-surface-700">{formatDate(p.PaymentDate)}</span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(p)}
                        className="btn-xs bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 border border-danger-500/20 rounded-xl font-bold transition-all">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!confirmDelete}
        variant="danger"
        title="Delete Payment"
        message="Are you sure you want to delete this payment record?"
        confirmText="Yes, Delete"
        cancelText="Keep Payment"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Payments;
