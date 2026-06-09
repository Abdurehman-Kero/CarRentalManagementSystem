import React, { useEffect, useState } from 'react';
import employeeService from '../services/employeeService';
import branchService from '../services/branchService';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

/* ── Helpers ──────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] gap-4 animate-fade-in">
    <div className="relative flex items-center justify-center">
      <div className="absolute w-12 h-12 rounded-full border border-primary-500/10 animate-ping opacity-25" />
      <svg className="w-10 h-10 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
    <span className="text-[11px] text-primary-400 font-bold uppercase tracking-[0.25em]">Loading employees…</span>
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

/* ── Employees ────────────────────────────────────────────────────── */
const Employees = () => {
  const [employees, setEmployees]   = useState([]);
  const [branches, setBranches]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingEmployee, setEdit]  = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const emptyForm = { EmployeeID: '', FullName: '', Role: '', Phone: '', BranchID: '' };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchEmployees(); }, [branchFilter]);

  const fetchData = async () => {
    try {
      const bRes = await branchService.getAllBranches();
      setBranches(Array.isArray(bRes) ? bRes : []);
    } catch { toast.error('Failed to fetch branches'); }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAllEmployees(branchFilter || null);
      setEmployees(Array.isArray(res) ? res : []);
    } catch { toast.error('Failed to fetch employees'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.EmployeeID, form);
        toast.success('Employee updated successfully');
      } else {
        await employeeService.createEmployee(form);
        toast.success('Employee added successfully');
      }
      closeModal(); fetchEmployees();
    } catch (e) { toast.error(e?.error || 'Failed to save employee'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (e) => { setEdit(e); setForm({ ...e }); setShowModal(true); };
  
  const handleDelete = (id) => setConfirmDelete(id);

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await employeeService.deleteEmployee(id);
      toast.success('Employee deleted');
      fetchEmployees();
    } catch (e) { toast.error(e?.error || 'Failed to delete employee'); }
  };

  const closeModal = () => { setShowModal(false); setEdit(null); setForm(emptyForm); };

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.FullName?.toLowerCase().includes(q) ||
      e.Role?.toLowerCase().includes(q) ||
      e.Phone?.includes(q)
    );
  });

  const getBranchName = (id) => branches.find(b => b.BranchID === id)?.BranchName || 'Unknown';

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{employees.length} active employee{employees.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative max-w-xs flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search name, role…"
            className="input-field pl-10" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field max-w-xs" value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          {branches.map(b => (
            <option key={b.BranchID} value={b.BranchID}>{b.BranchName}</option>
          ))}
        </select>
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
              {search ? 'No employees match' : 'No employees yet'}
            </p>
            {!search && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4">Add First Employee</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Branch</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.EmployeeID}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                        text-white text-sm font-bold flex-shrink-0
                                        bg-gradient-to-br ${getGradient(e.EmployeeID)}`}>
                          {e.FullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-surface-900 text-sm">{e.FullName}</p>
                          <p className="text-xs text-surface-400">ID: {e.EmployeeID}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mono-tag">{e.Role}</span>
                    </td>
                    <td>
                      <p className="text-sm text-surface-700 tabular">{e.Phone}</p>
                    </td>
                    <td>
                      <span className="text-sm text-surface-600">{getBranchName(e.BranchID)}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(e)}
                          className="btn-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl font-bold transition-all">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(e.EmployeeID)}
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
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
              </div>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="input-label">Employee ID</label>
                  <input type="number" placeholder="Unique ID"
                    className="input-field" value={form.EmployeeID}
                    onChange={(ev) => set('EmployeeID', ev.target.value)}
                    required disabled={!!editingEmployee} />
                </div>
                <div>
                  <label className="input-label">Full Name</label>
                  <input type="text" placeholder="John Smith" className="input-field"
                    value={form.FullName} onChange={(ev) => set('FullName', ev.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Role</label>
                    <input type="text" placeholder="Manager" className="input-field"
                      value={form.Role} onChange={(ev) => set('Role', ev.target.value)} required />
                  </div>
                  <div>
                    <label className="input-label">Phone</label>
                    <input type="text" placeholder="+1 555 000 0000" className="input-field"
                      value={form.Phone} onChange={(ev) => set('Phone', ev.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Branch</label>
                  {branches.length === 0 ? (
                    <div className="text-xs text-warning-600 mt-1 bg-warning-50 p-2.5 rounded-xl border border-warning-200 flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      <span>Please add branches in the Branches module first.</span>
                    </div>
                  ) : (
                    <select className="input-field" value={form.BranchID} onChange={ev => set('BranchID', ev.target.value)} required>
                      <option value="">Select Branch</option>
                      {branches.map(b => (
                        <option key={b.BranchID} value={b.BranchID}>{b.BranchName}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Employee'}
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
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
        confirmText="Yes, Delete"
        cancelText="Keep Employee"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Employees;
