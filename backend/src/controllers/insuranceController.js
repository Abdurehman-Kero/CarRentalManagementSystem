// src/controllers/insuranceController.js
const pool = require('../lib/db');

// ── Get all insurance types ───────────────────────────────────────
const getAllInsurances = async (req, res) => {
  try {
    const [insurances] = await pool.query(
      `SELECT i.*, COUNT(bi.BookingID) AS UsageCount
       FROM insurance i
       LEFT JOIN bookinginsurance bi ON i.InsuranceID = bi.InsuranceID
       GROUP BY i.InsuranceID
       ORDER BY i.InsuranceID ASC`
    );
    res.json({ success: true, data: insurances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get insurance by ID ───────────────────────────────────────────
const getInsuranceById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM insurance WHERE InsuranceID = ?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Insurance not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create insurance ──────────────────────────────────────────────
const createInsurance = async (req, res) => {
  try {
    const { InsuranceID, InsuranceType, Cost } = req.body;
    if (!InsuranceID || !InsuranceType || Cost === undefined)
      return res.status(400).json({ success: false, error: 'InsuranceID, InsuranceType and Cost are required' });

    await pool.query(
      `INSERT INTO insurance (InsuranceID, InsuranceType, Cost) VALUES (?, ?, ?)`,
      [parseInt(InsuranceID), InsuranceType.trim(), parseFloat(Cost)]
    );

    const [ins] = await pool.query('SELECT * FROM insurance WHERE InsuranceID = ?', [parseInt(InsuranceID)]);
    res.status(201).json({ success: true, data: ins[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'InsuranceID already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update insurance ──────────────────────────────────────────────
const updateInsurance = async (req, res) => {
  try {
    const { InsuranceType, Cost } = req.body;
    const id = req.params.id;
    const sets = [], params = [];

    if (InsuranceType !== undefined) { sets.push('InsuranceType = ?'); params.push(InsuranceType.trim()); }
    if (Cost          !== undefined) { sets.push('Cost = ?');          params.push(parseFloat(Cost)); }

    if (!sets.length)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    params.push(id);
    await pool.query(`UPDATE insurance SET ${sets.join(', ')} WHERE InsuranceID = ?`, params);
    const [ins] = await pool.query('SELECT * FROM insurance WHERE InsuranceID = ?', [id]);
    res.json({ success: true, data: ins[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete insurance ──────────────────────────────────────────────
const deleteInsurance = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM insurance WHERE InsuranceID = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Insurance not found' });
    res.json({ success: true, message: 'Insurance deleted successfully' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2')
      return res.status(409).json({ success: false, error: 'Cannot delete — insurance is linked to bookings' });
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllInsurances, getInsuranceById, createInsurance, updateInsurance, deleteInsurance };
