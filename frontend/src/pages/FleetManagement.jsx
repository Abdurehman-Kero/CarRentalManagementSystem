import React, { useEffect, useState } from 'react';
import carService from '../services/carService';
import toast from 'react-hot-toast';

/* ── Helpers ──────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-3">
    <div className="w-9 h-9 border-[3px] border-primary-100 border-t-primary-500 rounded-full animate-spin-slow" />
    <p className="text-sm text-surface-400 font-medium">Loading fleet…</p>
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
  const map = {
    Available:   'badge-green',
    'In Use':    'badge-blue',
    Maintenance: 'badge-yellow',
    Retired:     'badge-red',
  };
  return (
    <span className={map[status] || 'badge-gray'}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />{status}
    </span>
  );
};

/* ── FleetManagement ──────────────────────────────────────────────── */
const FleetManagement = () => {
  const [cars, setCars]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingCar, setEditing]    = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const emptyForm = {
    CarID: '', Brand: '', Model: '', Year: '', Color: '',
    LicensePlate: '', DailyRate: '', Status: 'Available', Mileage: '',
  };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      const res = await carService.getAllCars();
      setCars(res.data || []);
    } catch { toast.error('Failed to load fleet'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCar) {
        await carService.updateCar(editingCar.CarID, form);
        toast.success('Vehicle updated');
      } else {
        await carService.createCar(form);
        toast.success('Vehicle added to fleet');
      }
      closeModal(); fetchCars();
    } catch (e) { toast.error(e?.error || 'Failed to save vehicle'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (car) => { setEditing(car); setForm({ ...car }); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this vehicle from the fleet?')) return;
    try {
      await carService.deleteCar(id);
      toast.success('Vehicle removed'); fetchCars();
    } catch { toast.error('Failed to remove vehicle'); }
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); };

  const counts = {
    Available:   cars.filter((c) => c.Status === 'Available').length,
    'In Use':    cars.filter((c) => c.Status === 'In Use').length,
    Maintenance: cars.filter((c) => c.Status === 'Maintenance').length,
  };

  const filtered = cars.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = (
      c.Brand?.toLowerCase().includes(q) ||
      c.Model?.toLowerCase().includes(q) ||
      c.LicensePlate?.toLowerCase().includes(q)
    );
    const matchStatus = statusFilter ? c.Status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet Management</h1>
          <p className="page-subtitle">{cars.length} vehicle{cars.length !== 1 ? 's' : ''} in fleet</p>
        </div>
        <button id="add-car-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vehicle
        </button>
      </div>

      {/* Summary + Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status pills (clickable filter) */}
        {[
          { label: 'All',         value: '',            cls: 'pill-neutral' },
          { label: `Available (${counts.Available})`,   value: 'Available',   cls: 'pill-success' },
          { label: `In Use (${counts['In Use']})`,      value: 'In Use',      cls: 'pill-info' },
          { label: `Maintenance (${counts.Maintenance})`, value: 'Maintenance', cls: 'pill-warning' },
        ].map(({ label, value, cls }) => (
          <button key={value} onClick={() => setStatusFilter(value)}
            className={`${cls} transition-all cursor-pointer
              ${statusFilter === value ? 'ring-2 ring-offset-1 ring-primary-400' : 'opacity-70 hover:opacity-100'}`}>
            {label}
          </button>
        ))}

        {/* Search */}
        <div className="relative ml-auto">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input id="car-search" type="text" placeholder="Brand, model, plate…"
            className="input-field pl-10 w-56" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1h3l3-3-1-5h-5v8zm-8 0h8" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">
              {search || statusFilter ? 'No vehicles match' : 'No vehicles in fleet'}
            </p>
            <p className="text-surface-400 text-sm mt-1">
              {search || statusFilter ? 'Try different filters' : 'Add your first vehicle to get started.'}
            </p>
            {!(search || statusFilter) && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4">Add Vehicle</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Year</th>
                  <th>Color</th>
                  <th>License Plate</th>
                  <th>Daily Rate</th>
                  <th>Mileage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((car) => (
                  <tr key={car.CarID}>
                    <td>
                      <div>
                        <p className="font-bold text-surface-900 text-sm">
                          {car.Brand} <span className="font-medium text-surface-600">{car.Model}</span>
                        </p>
                        <span className="mono-tag mt-0.5 inline-block">{car.CarID}</span>
                      </div>
                    </td>
                    <td className="tabular text-surface-600">{car.Year}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-surface-200 flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: car.Color?.toLowerCase() }} />
                        <span className="text-surface-600 capitalize text-sm">{car.Color}</span>
                      </div>
                    </td>
                    <td><span className="mono-tag uppercase">{car.LicensePlate}</span></td>
                    <td>
                      <span className="font-bold text-surface-800">${car.DailyRate}</span>
                      <span className="text-surface-400 text-xs">/day</span>
                    </td>
                    <td className="tabular text-surface-500 text-sm">
                      {car.Mileage ? `${Number(car.Mileage).toLocaleString()} mi` : '—'}
                    </td>
                    <td><StatusBadge status={car.Status} /></td>
                    <td>
                      <div className="flex gap-1">
                        <button id={`edit-car-${car.CarID}`} onClick={() => handleEdit(car)}
                          className="btn-sm px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-colors">
                          Edit
                        </button>
                        <button id={`remove-car-${car.CarID}`} onClick={() => handleDelete(car.CarID)}
                          className="btn-sm px-3 py-1.5 text-danger-600 hover:bg-danger-50 rounded-lg font-semibold transition-colors">
                          Remove
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
                  {editingCar ? 'Edit Vehicle' : 'Add Vehicle to Fleet'}
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  {editingCar ? `${editingCar.Brand} ${editingCar.Model}` : 'Enter the vehicle details'}
                </p>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">

                <div>
                  <label className="input-label">Car ID</label>
                  <input id="car-id-input" type="number" placeholder="Unique vehicle ID"
                    className="input-field" value={form.CarID}
                    onChange={(e) => set('CarID', e.target.value)}
                    required disabled={!!editingCar} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Brand</label>
                    <input type="text" placeholder="Toyota" className="input-field"
                      value={form.Brand} onChange={(e) => set('Brand', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Model</label>
                    <input type="text" placeholder="Camry" className="input-field"
                      value={form.Model} onChange={(e) => set('Model', e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Year</label>
                    <input type="number" placeholder="2024" min="1990" max="2030" className="input-field"
                      value={form.Year} onChange={(e) => set('Year', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Color</label>
                    <input type="text" placeholder="Black" className="input-field"
                      value={form.Color} onChange={(e) => set('Color', e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">License Plate</label>
                    <input type="text" placeholder="ABC-1234" className="input-field font-mono uppercase"
                      value={form.LicensePlate} onChange={(e) => set('LicensePlate', e.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Daily Rate ($)</label>
                    <input type="number" step="0.01" min="0" placeholder="75.00" className="input-field"
                      value={form.DailyRate} onChange={(e) => set('DailyRate', e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Mileage (mi)</label>
                    <input type="number" min="0" placeholder="15000" className="input-field"
                      value={form.Mileage} onChange={(e) => set('Mileage', e.target.value)} />
                  </div>
                  <div>
                    <label className="input-label">Status</label>
                    <select className="select-field" value={form.Status}
                      onChange={(e) => set('Status', e.target.value)}>
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button id="save-car-btn" type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : (editingCar ? 'Update Vehicle' : 'Add Vehicle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;