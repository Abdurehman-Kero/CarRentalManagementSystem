// src/controllers/employeeController.js
const pool = require('../lib/db');

// ── Get all employees ─────────────────────────────────────────────
const getAllEmployees = async (req, res) => {
  try {
    const { branchId } = req.query;
    const where  = branchId ? 'WHERE e.BranchID = ?' : '';
    const params = branchId ? [parseInt(branchId)] : [];

    const [employees] = await pool.query(
      `SELECT e.*, b.BranchName, b.LocationCity
       FROM employee e
       LEFT JOIN branch b ON e.BranchID = b.BranchID
       ${where}
       ORDER BY e.EmployeeID ASC`,
      params
    );
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get employee by ID ────────────────────────────────────────────
const getEmployeeById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, b.BranchName, b.LocationCity
       FROM employee e
       LEFT JOIN branch b ON e.BranchID = b.BranchID
       WHERE e.EmployeeID = ?`,
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create employee ───────────────────────────────────────────────
const createEmployee = async (req, res) => {
  try {
    const { EmployeeID, FullName, Role, Phone, BranchID } = req.body;
    if (!EmployeeID || !FullName || !Role || !Phone || !BranchID)
      return res.status(400).json({ success: false, error: 'All fields are required' });

    // Verify branch exists
    const [branch] = await pool.query('SELECT BranchID FROM branch WHERE BranchID = ?', [parseInt(BranchID)]);
    if (!branch.length)
      return res.status(404).json({ success: false, error: 'Branch not found' });

    await pool.query(
      `INSERT INTO employee (EmployeeID, FullName, Role, Phone, BranchID) VALUES (?, ?, ?, ?, ?)`,
      [parseInt(EmployeeID), FullName.trim(), Role.trim(), Phone.trim(), parseInt(BranchID)]
    );

    const [emp] = await pool.query(
      `SELECT e.*, b.BranchName FROM employee e LEFT JOIN branch b ON e.BranchID = b.BranchID WHERE e.EmployeeID = ?`,
      [parseInt(EmployeeID)]
    );
    res.status(201).json({ success: true, data: emp[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Employee ID already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update employee ───────────────────────────────────────────────
const updateEmployee = async (req, res) => {
  try {
    const { FullName, Role, Phone, BranchID } = req.body;
    const id = req.params.id;
    const sets = [], params = [];

    if (FullName  !== undefined) { sets.push('FullName = ?');  params.push(FullName.trim()); }
    if (Role      !== undefined) { sets.push('Role = ?');      params.push(Role.trim()); }
    if (Phone     !== undefined) { sets.push('Phone = ?');     params.push(Phone.trim()); }
    if (BranchID  !== undefined) { sets.push('BranchID = ?'); params.push(parseInt(BranchID)); }

    if (!sets.length)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    params.push(id);
    await pool.query(`UPDATE employee SET ${sets.join(', ')} WHERE EmployeeID = ?`, params);
    const [emp] = await pool.query(
      `SELECT e.*, b.BranchName FROM employee e LEFT JOIN branch b ON e.BranchID = b.BranchID WHERE e.EmployeeID = ?`,
      [id]
    );
    res.json({ success: true, data: emp[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete employee ───────────────────────────────────────────────
const deleteEmployee = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM employee WHERE EmployeeID = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
