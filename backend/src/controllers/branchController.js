// src/controllers/branchController.js
const pool = require('../lib/db');

// ── Get all branches ──────────────────────────────────────────────
const getAllBranches = async (req, res) => {
  try {
    const [branches] = await pool.query(
      `SELECT b.*, COUNT(e.EmployeeID) AS EmployeeCount, COUNT(c.CarID) AS CarCount
       FROM branch b
       LEFT JOIN employee e ON b.BranchID = e.BranchID
       LEFT JOIN car      c ON b.BranchID = c.BranchID
       GROUP BY b.BranchID
       ORDER BY b.BranchID ASC`
    );
    res.json({ success: true, data: branches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get branch by ID ──────────────────────────────────────────────
const getBranchById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM branch WHERE BranchID = ?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Branch not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create branch ─────────────────────────────────────────────────
const createBranch = async (req, res) => {
  try {
    const { BranchID, BranchName, LocationCity, LocationState, Phone } = req.body;
    if (!BranchID || !BranchName || !LocationCity || !LocationState || !Phone)
      return res.status(400).json({ success: false, error: 'All fields are required' });

    await pool.query(
      `INSERT INTO branch (BranchID, BranchName, LocationCity, LocationState, Phone)
       VALUES (?, ?, ?, ?, ?)`,
      [parseInt(BranchID), BranchName.trim(), LocationCity.trim(), LocationState.trim(), Phone.trim()]
    );

    const [branch] = await pool.query('SELECT * FROM branch WHERE BranchID = ?', [parseInt(BranchID)]);
    res.status(201).json({ success: true, data: branch[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Branch ID already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update branch ─────────────────────────────────────────────────
const updateBranch = async (req, res) => {
  try {
    const { BranchName, LocationCity, LocationState, Phone } = req.body;
    const id = req.params.id;
    const sets = [], params = [];

    if (BranchName    !== undefined) { sets.push('BranchName = ?');    params.push(BranchName.trim()); }
    if (LocationCity  !== undefined) { sets.push('LocationCity = ?');  params.push(LocationCity.trim()); }
    if (LocationState !== undefined) { sets.push('LocationState = ?'); params.push(LocationState.trim()); }
    if (Phone         !== undefined) { sets.push('Phone = ?');         params.push(Phone.trim()); }

    if (!sets.length)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    params.push(id);
    await pool.query(`UPDATE branch SET ${sets.join(', ')} WHERE BranchID = ?`, params);
    const [branch] = await pool.query('SELECT * FROM branch WHERE BranchID = ?', [id]);
    res.json({ success: true, data: branch[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete branch ─────────────────────────────────────────────────
const deleteBranch = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM branch WHERE BranchID = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Branch not found' });
    res.json({ success: true, message: 'Branch deleted successfully' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2')
      return res.status(409).json({ success: false, error: 'Cannot delete branch — it has cars or employees assigned' });
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllBranches, getBranchById, createBranch, updateBranch, deleteBranch };
