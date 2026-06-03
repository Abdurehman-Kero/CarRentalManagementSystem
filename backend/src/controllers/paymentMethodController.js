// src/controllers/paymentMethodController.js
const pool = require('../lib/db');

// ── Get all payment methods ───────────────────────────────────────
const getAllPaymentMethods = async (req, res) => {
  try {
    const [methods] = await pool.query(
      `SELECT pm.*, COUNT(p.PaymentID) AS PaymentCount
       FROM paymentmethod pm
       LEFT JOIN payment p ON pm.MethodID = p.MethodID
       GROUP BY pm.MethodID
       ORDER BY pm.MethodID ASC`
    );
    res.json({ success: true, data: methods });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get payment method by ID ──────────────────────────────────────
const getPaymentMethodById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM paymentmethod WHERE MethodID = ?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Payment method not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create payment method ─────────────────────────────────────────
const createPaymentMethod = async (req, res) => {
  try {
    const { MethodID, MethodType } = req.body;
    if (!MethodID || !MethodType)
      return res.status(400).json({ success: false, error: 'MethodID and MethodType are required' });

    await pool.query(
      `INSERT INTO paymentmethod (MethodID, MethodType) VALUES (?, ?)`,
      [parseInt(MethodID), MethodType.trim()]
    );

    const [method] = await pool.query('SELECT * FROM paymentmethod WHERE MethodID = ?', [parseInt(MethodID)]);
    res.status(201).json({ success: true, data: method[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'MethodID already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update payment method ─────────────────────────────────────────
const updatePaymentMethod = async (req, res) => {
  try {
    const { MethodType } = req.body;
    if (!MethodType)
      return res.status(400).json({ success: false, error: 'MethodType is required' });

    await pool.query('UPDATE paymentmethod SET MethodType = ? WHERE MethodID = ?', [MethodType.trim(), req.params.id]);
    const [method] = await pool.query('SELECT * FROM paymentmethod WHERE MethodID = ?', [req.params.id]);
    res.json({ success: true, data: method[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete payment method ─────────────────────────────────────────
const deletePaymentMethod = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM paymentmethod WHERE MethodID = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Payment method not found' });
    res.json({ success: true, message: 'Payment method deleted successfully' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2')
      return res.status(409).json({ success: false, error: 'Cannot delete — method is used in payments' });
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllPaymentMethods, getPaymentMethodById, createPaymentMethod, updatePaymentMethod, deletePaymentMethod };
