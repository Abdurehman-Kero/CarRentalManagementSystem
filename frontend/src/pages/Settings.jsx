import React, { useEffect, useState } from "react";
import categoryService from "../services/categoryService";
import fuelPolicyService from "../services/fuelPolicyService";
import paymentMethodService from "../services/paymentMethodService";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

/* ── Helpers ──────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] gap-4 animate-fade-in">
    <div className="relative flex items-center justify-center">
      <div className="absolute w-12 h-12 rounded-full border border-primary-500/10 animate-ping opacity-25" />
      <svg
        className="w-10 h-10 animate-spin text-primary-500"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-10"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  </div>
);

const CloseBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="btn-icon"
    aria-label="Close"
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);

const formatCurrency = (val) => {
  if (val == null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);
};

/* ── Settings ────────────────────────────────────────────────────── */
const Settings = () => {
  const [activeTab, setActiveTab] = useState("categories"); // categories, fuel, payment
  const [categories, setCategories] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Unified form
  const emptyForm = {
    CategoryID: "",
    CategoryName: "",
    Description: "",
    PricePerDay: "",
    PolicyID: "",
    AdditionalCharge: "",
    MethodID: "",
    MethodType: "",
  };
  const [form, setForm] = useState(emptyForm);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [cRes, fRes, pRes] = await Promise.all([
        categoryService.getAllCategories(),
        fuelPolicyService.getAllFuelPolicies(),
        paymentMethodService.getAllPaymentMethods(),
      ]);
      setCategories(Array.isArray(cRes) ? cRes : []);
      setPolicies(Array.isArray(fRes) ? fRes : []);
      setMethods(Array.isArray(pRes) ? pRes : []);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item, type) => {
    setEdit({ ...item, type });
    setForm({ ...emptyForm, ...item });
    setShowModal(true);
  };

  const handleDelete = (id, type) => setConfirmDelete({ id, type });

  const doDelete = async () => {
    const { id, type } = confirmDelete;
    setConfirmDelete(null);
    try {
      if (type === "categories") await categoryService.deleteCategory(id);
      if (type === "fuel") await fuelPolicyService.deleteFuelPolicy(id);
      if (type === "payment")
        await paymentMethodService.deletePaymentMethod(id);
      toast.success("Item deleted");
      fetchAllData();
    } catch (e) {
      toast.error(
        e?.error || "Failed to delete item (check for active references)",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (activeTab === "categories") {
        if (editing)
          await categoryService.updateCategory(editing.CategoryID, form);
        else await categoryService.createCategory(form);
      } else if (activeTab === "fuel") {
        const payload = {
          PolicyID: form.PolicyID,
          Description: form.Description,
          AdditionalCharge: form.AdditionalCharge,
        };
        if (editing)
          await fuelPolicyService.updateFuelPolicy(editing.PolicyID, payload);
        else await fuelPolicyService.createFuelPolicy(payload);
      } else if (activeTab === "payment") {
        if (editing)
          await paymentMethodService.updatePaymentMethod(
            editing.MethodID,
            form,
          );
        else await paymentMethodService.createPaymentMethod(form);
      }
      toast.success("Saved successfully");
      closeModal();
      fetchAllData();
    } catch (e) {
      toast.error(e?.error || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEdit(null);
    setForm(emptyForm);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Manage reference tables and lookups</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-surface-200">
        <button
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === "categories" ? "border-primary-500 text-primary-600" : "border-transparent text-surface-500 hover:text-surface-800"}`}
          onClick={() => setActiveTab("categories")}
        >
          Car Categories
        </button>
        <button
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === "fuel" ? "border-primary-500 text-primary-600" : "border-transparent text-surface-500 hover:text-surface-800"}`}
          onClick={() => setActiveTab("fuel")}
        >
          Fuel Policies
        </button>
        <button
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === "payment" ? "border-primary-500 text-primary-600" : "border-transparent text-surface-500 hover:text-surface-800"}`}
          onClick={() => setActiveTab("payment")}
        >
          Payment Methods
        </button>
      </div>

      {/* Content Area */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-surface-100 flex justify-end bg-surface-50/50">
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add{" "}
            {activeTab === "categories"
              ? "Category"
              : activeTab === "fuel"
                ? "Policy"
                : "Method"}
          </button>
        </div>

        {/* Categories Table */}
        {activeTab === "categories" && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Daily Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.CategoryID}>
                    <td>
                      <span className="mono-tag">{c.CategoryID}</span>
                    </td>
                    <td className="font-semibold text-surface-900">
                      {c.CategoryName}
                    </td>
                    <td
                      className="text-sm text-surface-600 max-w-xs truncate"
                      title={c.Description}
                    >
                      {c.Description}
                    </td>
                    <td className="font-bold text-primary-600">
                      {formatCurrency(c.PricePerDay)}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(c, "categories")}
                          className="btn-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(c.CategoryID, "categories")
                          }
                          className="btn-xs bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 border border-danger-500/20 rounded-xl font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-surface-400 py-8"
                    >
                      No categories
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Fuel Policies Table */}
        {activeTab === "fuel" && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Additional Charge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.PolicyID}>
                    <td>
                      <span className="mono-tag">{p.PolicyID}</span>
                    </td>
                    <td className="text-sm text-surface-600 max-w-sm">
                      {p.Description}
                    </td>
                    <td className="font-semibold text-surface-900">
                      {formatCurrency(p.AdditionalCharge)}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(p, "fuel")}
                          className="btn-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.PolicyID, "fuel")}
                          className="btn-xs bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 border border-danger-500/20 rounded-xl font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {policies.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-surface-400 py-8"
                    >
                      No fuel policies
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Methods Table */}
        {activeTab === "payment" && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Method Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((m) => (
                  <tr key={m.MethodID}>
                    <td>
                      <span className="mono-tag">{m.MethodID}</span>
                    </td>
                    <td className="font-semibold text-surface-900">
                      {m.MethodType}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(m, "payment")}
                          className="btn-xs bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(m.MethodID, "payment")}
                          className="btn-xs bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 border border-danger-500/20 rounded-xl font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {methods.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center text-surface-400 py-8"
                    >
                      No payment methods
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(ev) => ev.target === ev.currentTarget && closeModal()}
        >
          <div className="modal-box max-w-sm">
            <div className="modal-header">
              <h2 className="text-lg font-bold text-surface-900">
                {editing ? "Edit Item" : "Add New Item"}
              </h2>
              <CloseBtn onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                {/* Categories */}
                {activeTab === "categories" && (
                  <>
                    <div>
                      <label className="input-label">Category ID</label>
                      <input
                        type="number"
                        className="input-field"
                        value={form.CategoryID}
                        onChange={(ev) => set("CategoryID", ev.target.value)}
                        required
                        disabled={!!editing}
                      />
                    </div>
                    <div>
                      <label className="input-label">Category Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={form.CategoryName}
                        onChange={(ev) => set("CategoryName", ev.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">Daily Rate ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-field"
                        value={form.PricePerDay}
                        onChange={(ev) => set("PricePerDay", ev.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">Description</label>
                      <textarea
                        className="input-field min-h-[80px] resize-none"
                        value={form.Description}
                        onChange={(ev) => set("Description", ev.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Fuel Policies */}
                {activeTab === "fuel" && (
                  <>
                    <div>
                      <label className="input-label">Policy ID</label>
                      <input
                        type="number"
                        className="input-field"
                        value={form.PolicyID}
                        onChange={(ev) => set("PolicyID", ev.target.value)}
                        required
                        disabled={!!editing}
                      />
                    </div>
                    <div>
                      <label className="input-label">Description</label>
                      <textarea
                        className="input-field min-h-[80px] resize-none"
                        value={form.Description}
                        onChange={(ev) => set("Description", ev.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">
                        Additional Charge ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-field"
                        value={form.AdditionalCharge}
                        onChange={(ev) =>
                          set("AdditionalCharge", ev.target.value)
                        }
                      />
                    </div>
                  </>
                )}

                {/* Payment Methods */}
                {activeTab === "payment" && (
                  <>
                    <div>
                      <label className="input-label">Method ID</label>
                      <input
                        type="number"
                        className="input-field"
                        value={form.MethodID}
                        onChange={(ev) => set("MethodID", ev.target.value)}
                        required
                        disabled={!!editing}
                      />
                    </div>
                    <div>
                      <label className="input-label">Method Type</label>
                      <input
                        type="text"
                        placeholder="Credit Card"
                        className="input-field"
                        value={form.MethodType}
                        onChange={(ev) => set("MethodType", ev.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Saving…" : "Save"}
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
        title="Delete Item"
        message="Are you sure you want to delete this item? This may fail if there are active records referencing it."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Settings;
