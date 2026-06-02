import React, { useEffect, useState } from 'react';
import reviewService from '../services/reviewService';
import carService from '../services/carService';
import customerService from '../services/customerService';
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
    <span className="text-[11px] text-primary-400 font-bold uppercase tracking-[0.25em]">Loading reviews…</span>
  </div>
);

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(d));
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex text-warning-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= rating ? 'fill-current' : 'text-surface-200 fill-current'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

/* ── Reviews ────────────────────────────────────────────────────── */
const Reviews = () => {
  const [reviews, setReviews]       = useState([]);
  const [cars, setCars]             = useState([]);
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, cRes, cuRes] = await Promise.all([
        reviewService.getAllReviews(),
        carService.getAllCars(),
        customerService.getAllCustomers()
      ]);
      setReviews(Array.isArray(rRes) ? rRes : []);
      setCars(Array.isArray(cRes) ? cRes : []);
      setCustomers(Array.isArray(cuRes) ? cuRes : []);
    } catch { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const handleDelete = (id) => setConfirmDelete(id);

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await reviewService.deleteReview(id);
      toast.success('Review deleted');
      fetchData();
    } catch (e) { toast.error(e?.error || 'Failed to delete review'); }
  };

  const getCarString = (id) => {
    const c = cars.find(car => car.CarID === id);
    return c ? `${c.Brand} ${c.Model}` : `Car #${id}`;
  };

  const getCustomerName = (id) => {
    const c = customers.find(cust => cust.CustID === id);
    return c ? c.FullName : `Customer #${id}`;
  };

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    const carStr = getCarString(r.CarID).toLowerCase();
    const custStr = getCustomerName(r.CustID).toLowerCase();
    return (
      r.Comment?.toLowerCase().includes(q) ||
      carStr.includes(q) ||
      custStr.includes(q) ||
      r.Rating?.toString().includes(q)
    );
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Reviews</h1>
          <p className="page-subtitle">{reviews.length} review{reviews.length !== 1 ? 's' : ''} submitted</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search comments, car, customer…"
          className="input-field pl-10" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">
              {search ? 'No reviews match' : 'No reviews yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {filtered.map((r) => (
              <div key={r.ReviewID} className="flex flex-col border border-surface-200 rounded-2xl p-5 bg-white relative group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-surface-900 text-sm">{getCustomerName(r.CustID)}</h3>
                    <p className="text-xs text-surface-400">{getCarString(r.CarID)} • {formatDate(r.ReviewDate)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StarRating rating={r.Rating} />
                    <button onClick={() => handleDelete(r.ReviewID)} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-danger-500 hover:text-danger-600">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-surface-700 bg-surface-50 p-4 rounded-xl flex-grow">
                  "{r.Comment}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!confirmDelete}
        variant="danger"
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Keep Review"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Reviews;
