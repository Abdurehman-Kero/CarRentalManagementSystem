import React, { useEffect, useState } from 'react';
import rentalService from '../services/rentalService';
import bookingService from '../services/bookingService';
import carService from '../services/carService';
import toast from 'react-hot-toast';

/* ── Helpers ──────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-3">
    <div className="w-9 h-9 border-[3px] border-primary-100 border-t-primary-500 rounded-full animate-spin-slow" />
    <p className="text-sm text-surface-400 font-medium">Loading rentals…</p>
  </div>
);

const CloseBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="btn-icon" aria-label="Close">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

/* ── Rentals ──────────────────────────────────────────────────────── */
const Rentals = () => {
  const [rentals, setRentals]               = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [showModal, setShowModal]           = useState(false);
  const [submitting, setSubmitting]         = useState(false);

  const emptyForm = {
    RentalID: '', StartDate: new Date().toISOString().split('T')[0],
    EndDate: '', TotalAmount: '', BookingID: '',
  };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [rRes, bRes] = await Promise.all([
        rentalService.getAllRentals(),
        bookingService.getAllBookings(),
      ]);
      setRentals(rRes.data || []);
      const pending = (bRes.data || []).filter((b) => b.Status === 'Pending' && !b.rental);
      setPendingBookings(pending);
    } catch { toast.error('Failed to fetch rentals data'); }
    finally { setLoading(false); }
  };

  const handleBookingSelect = (bookingId) => {
    const booking = pendingBookings.find((b) => b.BookingID === parseInt(bookingId));
    if (booking) {
      setForm((p) => ({
        ...p,
        BookingID: bookingId,
        StartDate: booking.PickupDate.split('T')[0],
        EndDate:   booking.ReturnDate.split('T')[0],
      }));
    } else {
      set('BookingID', bookingId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const booking = pendingBookings.find((b) => b.BookingID === parseInt(form.BookingID));
      await rentalService.createRental({
        RentalID:    parseInt(form.RentalID),
        StartDate:   form.StartDate,
        EndDate:     form.EndDate,
        TotalAmount: parseFloat(form.TotalAmount),
        BookingID:   parseInt(form.BookingID),
      });
      await bookingService.updateBookingStatus(form.BookingID, 'Active');
      if (booking) await carService.updateCarStatus(booking.CarID, 'In Use');
      toast.success('Vehicle checked out successfully!');
      closeModal(); fetchData();
    } catch (e) { toast.error(e?.error || 'Failed to create rental'); }
    finally { setSubmitting(false); }
  };

  const handleReturn = async (rentalId, bookingId, carId) => {
    if (!window.confirm('Confirm car return? Booking will be marked Completed.')) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await rentalService.returnCar(rentalId, today);
      await bookingService.updateBookingStatus(bookingId, 'Completed');
      await carService.updateCarStatus(carId, 'Available');
      toast.success('Car returned successfully!');
      fetchData();
    } catch { toast.error('Failed to return car'); }
  };

  const closeModal = () => { setShowModal(false); setForm(emptyForm); };

  if (loading) return <Spinner />;

  const active   = rentals.filter((r) => !r.ActualReturnDate);
  const returned = rentals.filter((r) => r.ActualReturnDate);

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Rentals</h1>
          <p className="page-subtitle">{active.length} active · {returned.length} returned</p>
        </div>
        <button id="new-checkout-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
          </svg>
          New Checkout
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        <span className="pill-success">
          <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse-dot" />
          {active.length} Active
        </span>
        <span className="pill-neutral">
          <span className="w-2 h-2 rounded-full bg-surface-400" />
          {returned.length} Returned
        </span>
        <span className="pill-primary">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          {pendingBookings.length} Pending Checkout
        </span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {rentals.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">No rentals yet</p>
            <p className="text-surface-400 text-sm mt-1">Check out a vehicle from a pending booking.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-4">New Checkout</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rental</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => (
                  <tr key={r.RentalID}>
                    <td>
                      <div>
                        <span className="mono-tag">#{r.RentalID}</span>
                        <p className="text-[10px] text-surface-400 mt-1">Booking #{r.booking?.BookingID}</p>
                      </div>
                    </td>
                    <td className="font-semibold text-surface-900 text-sm">
                      {r.booking?.customer?.FullName || 'N/A'}
                    </td>
                    <td className="text-surface-600 text-sm">
                      {r.booking?.car?.Brand} {r.booking?.car?.Model}
                    </td>
                    <td className="text-xs text-surface-400 tabular">
                      {new Date(r.StartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="text-xs text-surface-400 tabular">
                      {new Date(r.EndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="font-bold text-surface-800">${r.TotalAmount}</td>
                    <td>
                      {!r.ActualReturnDate ? (
                        <span className="badge-green">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-pulse-dot" />Active
                        </span>
                      ) : (
                        <span className="badge-gray">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />Returned
                        </span>
                      )}
                    </td>
                    <td>
                      {!r.ActualReturnDate && (
                        <button id={`return-car-${r.RentalID}`}
                          onClick={() => handleReturn(r.RentalID, r.booking?.BookingID, r.booking?.CarID)}
                          className="btn-sm px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100
                                     border border-primary-200 rounded-xl font-semibold transition-all">
                          ↩ Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box max-w-md">
            <div className="modal-header">
              <div>
                <h2 className="text-lg font-bold text-surface-900">Vehicle Checkout</h2>
                <p className="text-xs text-surface-400 mt-0.5">Convert a pending booking into an active rental</p>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">

                <div>
                  <label className="input-label">Rental ID</label>
                  <input id="rental-id-input" type="number" placeholder="Unique rental ID"
                    className="input-field" value={form.RentalID}
                    onChange={(e) => set('RentalID', e.target.value)} required />
                </div>

                <div>
                  <label className="input-label">Pending Booking</label>
                  {pendingBookings.length === 0 ? (
                    <div className="alert-warn">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>No pending bookings available. Create a booking first.</span>
                    </div>
                  ) : (
                    <select id="booking-select" className="select-field"
                      value={form.BookingID}
                      onChange={(e) => handleBookingSelect(e.target.value)} required>
                      <option value="">Select a pending booking…</option>
                      {pendingBookings.map((b) => (
                        <option key={b.BookingID} value={b.BookingID}>
                          #{b.BookingID} — {b.customer?.FullName} · {b.car?.Brand} {b.car?.Model}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Start Date</label>
                    <input type="date" className="input-field" value={form.StartDate} readOnly />
                  </div>
                  <div>
                    <label className="input-label">End Date</label>
                    <input type="date" className="input-field" value={form.EndDate} readOnly />
                  </div>
                </div>

                <div>
                  <label className="input-label">Total Amount ($)</label>
                  <input id="total-amount-input" type="number" step="0.01" min="0"
                    placeholder="0.00" className="input-field tabular"
                    value={form.TotalAmount}
                    onChange={(e) => set('TotalAmount', e.target.value)} required />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button id="checkout-submit-btn" type="submit" className="btn-primary"
                  disabled={submitting || pendingBookings.length === 0}>
                  {submitting ? 'Processing…' : '✓ Checkout Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;
