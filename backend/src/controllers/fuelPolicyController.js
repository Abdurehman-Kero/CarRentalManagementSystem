// src/controllers/fuelPolicyController.js
const pool = require('../lib/db');

// ── Get all fuel policies ─────────────────────────────────────────
const getAllFuelPolicies = async (req, res) => {
  try {
    const [policies] = await pool.query(
      `SELECT fp.*, COUNT(c.CarID) AS CarCount
       FROM fuelpolicy fp
       LEFT JOIN car c ON fp.PolicyID = c.PolicyID
       GROUP BY fp.PolicyID
       ORDER BY fp.PolicyID ASC`
    );
    res.json({ success: true, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get fuel policy by ID ─────────────────────────────────────────
const getFuelPolicyById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fuelpolicy WHERE PolicyID = ?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Fuel policy not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create fuel policy ────────────────────────────────────────────
const createFuelPolicy = async (req, res) => {
  try {
    const { PolicyID, Description, AdditionalCharge } = req.body;
    if (!PolicyID || !Description)
      return res.status(400).json({ success: false, error: 'PolicyID and Description are required' });

    await pool.query(
      `INSERT INTO fuelpolicy (PolicyID, Description, AdditionalCharge) VALUES (?, ?, ?)`,
      [parseInt(PolicyID), Description.trim(), parseFloat(AdditionalCharge || 0)]
    );

    const [policy] = await pool.query('SELECT * FROM fuelpolicy WHERE PolicyID = ?', [parseInt(PolicyID)]);
    res.status(201).json({ success: true, data: policy[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Policy ID already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update fuel policy ────────────────────────────────────────────
const updateFuelPolicy = async (req, res) => {
  try {
    const { Description, AdditionalCharge } = req.body;
    const id = req.params.id;
    const sets = [], params = [];

    if (Description      !== undefined) { sets.push('Description = ?');      params.push(Description.trim()); }
    if (AdditionalCharge !== undefined) { sets.push('AdditionalCharge = ?'); params.push(parseFloat(AdditionalCharge)); }

    if (!sets.length)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    params.push(id);
    await pool.query(`UPDATE fuelpolicy SET ${sets.join(', ')} WHERE PolicyID = ?`, params);
    const [policy] = await pool.query('SELECT * FROM fuelpolicy WHERE PolicyID = ?', [id]);
    res.json({ success: true, data: policy[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete fuel policy ────────────────────────────────────────────
const deleteFuelPolicy = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM fuelpolicy WHERE PolicyID = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Fuel policy not found' });
    res.json({ success: true, message: 'Fuel policy deleted successfully' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2')
      return res.status(409).json({ success: false, error: 'Cannot delete — policy is assigned to cars' });
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllFuelPolicies, getFuelPolicyById, createFuelPolicy, updateFuelPolicy, deleteFuelPolicy };
