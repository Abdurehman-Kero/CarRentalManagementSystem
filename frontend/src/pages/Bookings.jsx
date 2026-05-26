import React, { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import carService from '../services/carService';
import customerService from '../services/customerService';
import toast from 'react-hot-toast';

/* ── Helpers ──────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-3">
    <div className="w-9 h-9 border-[3px] border-primary-100 border-t-primary-500 rounded-full animate-spin-slow" />
    <p className="text-sm text-surface-400 font-medium">Loading bookings…</p>
  </div>
);

const CloseBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="btn-icon" aria-label="Close">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const StatusBadge = ({ status }) => {
  const map = { Active: 'badge-green', Completed: 'badge-blue', Pending: 'badge-yellow', Cancelled: 'badge-red' };
  return (
    <span className={map[status] || 'badge-gray'}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />{status}
    </span>
  );
};

/* ── Bookings ─────────────────────────────────────────────────────── */
const Bookings = () => {
  const [bookings, setBookings]       = useState([]);
  const [cars, setCars]               = useState([]);
  const [customers, setCustomers]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [costCalc, setCostCalc]       = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [calculating, setCalculating] = useState(false);

  const emptyForm = {
    BookingID: '', BookingDate: new Date().toISOString().split('T')[0],
    PickupDate: '', ReturnDate: '', CustID: '', CarID: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bRes, cRes, cuRes] = await Promise.all([
        bookingService.getAllBookings(),
        carService.getAllCars(),
        customerService.getAllCustomers(),
      ]);
      setBookings(bRes.data || []);
      setCars(cRes.data || []);
      setCustomers(cuRes.data || []);
    } catch { toast.error('Failed to load bookings data'); }
    finally { setLoading(false); }
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleCalc = async () => {
    if (!form.CarID || !form.PickupDate || !form.ReturnDate) {
      toast.error('Select car, pickup and return dates first');
      return;
    }
    setCalculating(true);
    try {
      const res = await bookingService.calculateCost({
        CarID: parseInt(form.CarID),
        PickupDate: form.PickupDate,
        ReturnDate: form.ReturnDate,
      });
      setCostCalc(res.data);
    } catch (e) { toast.error(e?.error || 'Failed to calculate cost'); }
    finally { setCalculating(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookingService.createBooking({
        BookingID:   parseInt(form.BookingID),
        BookingDate: form.BookingDate,
        PickupDate:  form.PickupDate,
        ReturnDate:  form.ReturnDate,
        CustID:      parseInt(form.CustID),
        CarID:       parseInt(form.CarID),
      });
      toast.success('Booking created successfully!');
      closeModal(); fetchData();
    } catch (e) { toast.error(e?.error || 'Failed to create booking'); }
    finally { setSubmitting(false); }
  };

  const closeModal = () => { setShowModal(false); setForm(emptyForm); setCostCalc(null); };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <button id="new-booking-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">No bookings yet</p>
            <p className="text-surface-400 text-sm mt-1">Create your first booking to get started.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
              Create First Booking
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Pickup</th>
                  <th>Return</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.BookingID}>
                    <td><span className="mono-tag">#{b.BookingID}</span></td>
                    <td className="font-semibold text-surface-900">{b.customer?.FullName || 'N/A'}</td>
                    <td className="text-surface-600">{b.car?.Brand} {b.car?.Model}</td>
                    <td className="text-surface-400 text-xs tabular">
                      {new Date(b.PickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="text-surface-400 text-xs tabular">
                      {new Date(b.ReturnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td><StatusBadge status={b.Status} /></td>
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
          <div className="modal-box max-w-md">
            <div className="modal-header">
              <div>
                <h2 className="text-lg font-bold text-surface-900">New Booking</h2>
                <p className="text-xs text-surface-400 mt-0.5">Fill in reservation details below</p>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">

                <div>
                  <label className="input-label">Booking ID</label>
                  <input id="booking-id-input" type="number" placeholder="e.g. 101"
                    className="input-field" value={form.BookingID}
                    onChange={(e) => set('BookingID', e.target.value)} required />
                </div>

                <div>
                  <label className="input-label">Customer</label>
                  <select id="customer-select" className="select-field" value={form.CustID}
                    onChange={(e) => set('CustID', e.target.value)} required>
                    <option value="">Select a customer…</option>
                    {customers.map((c) => (
                      <option key={c.CustID} value={c.CustID}>{c.FullName} — {c.Email}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Vehicle</label>
                  <select id="car-select" className="select-field" value={form.CarID}
                    onChange={(e) => set('CarID', e.target.value)} required>
                    <option value="">Select available vehicle…</option>
                    {cars.filter((c) => c.Status === 'Available').map((c) => (
                      <option key={c.CarID} value={c.CarID}>
                        {c.Brand} {c.Model} — {c.LicensePlate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Pickup Date</label>
                    <input id="pickup-date" type="date" className="input-field"
                      value={form.PickupDate} onChange={(e) => set('PickupDate', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Return Date</label>
                    <input id="return-date" type="date" className="input-field"
                      value={form.ReturnDate} onChange={(e) => set('ReturnDate', e.target.value)} required />
                  </div>
                </div>

                <button type="button" id="calc-cost-btn" onClick={handleCalc}
                  className="btn-secondary w-full" disabled={calculating}>
                  {calculating ? (
                    <span className="w-4 h-4 border-2 border-surface-300 border-t-primary-500 rounded-full animate-spin-slow" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {calculating ? 'Calculating…' : 'Calculate Cost'}
                </button>

                {costCalc && (
                  <div className="rounded-2xl overflow-hidden border border-primary-100 animate-slide-up">
                    <div className="bg-gradient-primary px-4 py-2">
                      <p className="text-white text-xs font-semibold uppercase tracking-wider">Cost Breakdown</p>
                    </div>
                    <div className="p-4 bg-primary-50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-500">Duration</span>
                        <span className="font-semibold text-surface-800">{costCalc.days} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-500">Daily rate</span>
                        <span className="font-semibold text-surface-800">${costCalc.pricePerDay}</span>
                      </div>
                      <div className="divider" />
                      <div className="flex justify-between">
                        <span className="font-bold text-surface-800">Total</span>
                        <span className="text-xl font-bold text-primary-700">${costCalc.totalCost}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button id="create-booking-submit" type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Creating…' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
