import React, { useEffect, useState } from 'react';
import maintenanceService from '../services/maintenanceService';
import carService from '../services/carService';
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
    <span className="text-[11px] text-primary-400 font-bold uppercase tracking-[0.25em]">Loading maintenance…</span>
  </div>
);

const CloseBtn = ({ onClick }) => (
  <button type="button" onClick={onClick} className="btn-icon" aria-label="Close">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(d));
};

const formatCurrency = (val) => {
  if (val == null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

/* ── Maintenance ────────────────────────────────────────────────────── */
const Maintenance = () => {
  const [records, setRecords]       = useState([]);
  const [cars, setCars]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingRecord, setEdit]    = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState('');
  const [carFilter, setCarFilter]   = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const emptyForm = { MaintenanceID: '', CarID: '', Description: '', CompletionDate: '', Cost: '', ServiceShop: '' };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchRecords(); }, [carFilter]);

  const fetchData = async () => {
    try {
      const cRes = await carService.getAllCars();
      setCars(Array.isArray(cRes) ? cRes : []);
    } catch { toast.error('Failed to fetch cars'); }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let res;
      if (carFilter) {
        res = await maintenanceService.getMaintenanceByCarId(carFilter);
      } else {
        res = await maintenanceService.getAllMaintenance();
      }
      setRecords(Array.isArray(res) ? res : []);
    } catch { toast.error('Failed to fetch maintenance records'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRecord) {
        await maintenanceService.updateMaintenance(editingRecord.CarID, editingRecord.MaintenanceID, form);
        toast.success('Record updated successfully');
      } else {
        await maintenanceService.createMaintenance(form);
        toast.success('Record added successfully');
      }
      closeModal(); fetchRecords();
    } catch (e) { toast.error(e?.error || 'Failed to save record'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (r) => {
    setEdit(r);
    setForm({
      ...r,
      CompletionDate: r.CompletionDate ? new Date(r.CompletionDate).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };
  
  const handleDelete = (carId, maintenanceId) => setConfirmDelete({ carId, maintenanceId });

  const doDelete = async () => {
    const { carId, maintenanceId } = confirmDelete;
    setConfirmDelete(null);
    try {
      await maintenanceService.deleteMaintenance(carId, maintenanceId);
      toast.success('Record deleted');
      fetchRecords();
    } catch (e) { toast.error(e?.error || 'Failed to delete record'); }
  };

  const closeModal = () => { setShowModal(false); setEdit(null); setForm(emptyForm); };

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const car = cars.find(c => c.CarID === r.CarID);
    const carStr = car ? `${car.Brand} ${car.Model} ${car.LicensePlate}`.toLowerCase() : '';
    return (
      r.Description?.toLowerCase().includes(q) ||
      r.ServiceShop?.toLowerCase().includes(q) ||
      carStr.includes(q)
    );
  });

  const getCarString = (id) => {
    const c = cars.find(car => car.CarID === id);
    return c ? `${c.Brand} ${c.Model} (${c.LicensePlate})` : `Car #${id}`;
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance Logs</h1>
          <p className="page-subtitle">{records.length} total record{records.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Maintenance
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative max-w-xs flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search description, shop, car…"
            className="input-field pl-10" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field max-w-xs" value={carFilter} onChange={e => setCarFilter(e.target.value)}>
          <option value="">All Cars</option>
          {cars.map(c => (
            <option key={c.CarID} value={c.CarID}>{c.Brand} {c.Model} ({c.LicensePlate})</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <p className="text-surface-700 font-semibold text-base">
              {search ? 'No records match' : 'No maintenance records yet'}
            </p>
            {!search && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4">Log First Maintenance</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Car</th>
                  <th>Description</th>
                  <th>Shop & Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={`${r.CarID}-${r.MaintenanceID}`}>
                    <td>
                      <p className="font-medium text-surface-900 text-sm whitespace-nowrap">{formatDate(r.CompletionDate)}</p>
                    </td>
                    <td>
                      <span className="font-semibold text-surface-800 text-sm">{getCarString(r.CarID)}</span>
                    </td>
                    <td>
                      <p className="text-sm text-surface-700 max-w-xs truncate" title={r.Description}>{r.Description}</p>
                    </td>
                    <td>
                      <p className="text-sm font-bold text-surface-900">{formatCurrency(r.Cost)}</p>
                      <p className="text-xs text-surface-400">{r.ServiceShop}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(r)}
                          className="btn-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl font-bold transition-all">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(r.CarID, r.MaintenanceID)}
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
          <div className="modal-box max-w-md">
            <div className="modal-header">
              <div>
                <h2 className="text-lg font-bold text-surface-900">
                  {editingRecord ? 'Edit Maintenance' : 'Log Maintenance'}
                </h2>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Maintenance ID</label>
                    <input type="number" placeholder="Unique ID"
                      className="input-field" value={form.MaintenanceID}
                      onChange={(ev) => set('MaintenanceID', ev.target.value)}
                      required disabled={!!editingRecord} />
                  </div>
                  <div>
                    <label className="input-label">Car</label>
                    {cars.length === 0 ? (
                      <div className="text-xs text-warning-600 mt-1 bg-warning-50 p-2.5 rounded-xl border border-warning-200 flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <span>Please add cars in Fleet Management first.</span>
                      </div>
                    ) : (
                      <select className="input-field" value={form.CarID} onChange={ev => set('CarID', ev.target.value)} required disabled={!!editingRecord}>
                        <option value="">Select Car</option>
                        {cars.map(c => (
                          <option key={c.CarID} value={c.CarID}>{c.Brand} {c.Model} ({c.LicensePlate})</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="input-label">Description</label>
                  <input type="text" placeholder="Oil change, tire rotation…" className="input-field"
                    value={form.Description} onChange={(ev) => set('Description', ev.target.value)} required />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Date</label>
                    <input type="date" className="input-field"
                      value={form.CompletionDate} onChange={(ev) => set('CompletionDate', ev.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Cost ($)</label>
                    <input type="number" step="0.01" min="0" placeholder="150.00" className="input-field"
                      value={form.Cost} onChange={(ev) => set('Cost', ev.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="input-label">Shop Name</label>
                  <input type="text" placeholder="Auto Repair Shop" className="input-field"
                    value={form.ServiceShop} onChange={(ev) => set('ServiceShop', ev.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Record'}
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
        title="Delete Record"
        message="Are you sure you want to delete this maintenance record?"
        confirmText="Yes, Delete"
        cancelText="Keep Record"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Maintenance;
