// src/controllers/customerController.js — mysql2 direct queries
const pool = require('../lib/db');

// ── Get all customers ────────────────────────────────────────────
const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let sql    = 'SELECT * FROM Customer';
    const params = [];
    if (search) {
      sql += ' WHERE FullName LIKE ? OR Email LIKE ? OR Phone LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY CustID ASC';
    const [customers] = await pool.query(sql, params);
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get customer by ID ───────────────────────────────────────────
const getCustomerById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE CustID = ?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create customer ──────────────────────────────────────────────
const createCustomer = async (req, res) => {
  try {
    const { CustID, FullName, Email, Phone, StreetAddress, City, State, ZipCode, DriverLicenseNo } = req.body;

    const [existing] = await pool.query(
      'SELECT CustID FROM Customer WHERE Email = ? OR DriverLicenseNo = ?',
      [Email, DriverLicenseNo]
    );
    if (existing.length)
      return res.status(400).json({ success: false, error: 'Email or Driver License already exists' });

    await pool.query(
      `INSERT INTO Customer (CustID, FullName, Email, Phone, StreetAddress, City, State, ZipCode, DriverLicenseNo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [parseInt(CustID), FullName, Email, Phone, StreetAddress, City, State, ZipCode, DriverLicenseNo]
    );
    const [customer] = await pool.query('SELECT * FROM Customer WHERE CustID = ?', [parseInt(CustID)]);
    res.status(201).json({ success: true, data: customer[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Customer already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update customer ──────────────────────────────────────────────
const updateCustomer = async (req, res) => {
  try {
    const { FullName, Email, Phone, StreetAddress, City, State, ZipCode, DriverLicenseNo } = req.body;
    const id = req.params.id;
    const sets = []; const params = [];

    if (FullName        !== undefined) { sets.push('FullName = ?');        params.push(FullName); }
    if (Email           !== undefined) { sets.push('Email = ?');           params.push(Email); }
    if (Phone           !== undefined) { sets.push('Phone = ?');           params.push(Phone); }
    if (StreetAddress   !== undefined) { sets.push('StreetAddress = ?');   params.push(StreetAddress); }
    if (City            !== undefined) { sets.push('City = ?');            params.push(City); }
    if (State           !== undefined) { sets.push('State = ?');           params.push(State); }
    if (ZipCode         !== undefined) { sets.push('ZipCode = ?');         params.push(ZipCode); }
    if (DriverLicenseNo !== undefined) { sets.push('DriverLicenseNo = ?'); params.push(DriverLicenseNo); }

    if (!sets.length)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    params.push(id);
    await pool.query(`UPDATE Customer SET ${sets.join(', ')} WHERE CustID = ?`, params);
    const [customer] = await pool.query('SELECT * FROM Customer WHERE CustID = ?', [id]);
    res.json({ success: true, data: customer[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete customer ──────────────────────────────────────────────
const deleteCustomer = async (req, res) => {
  try {
    await pool.query('DELETE FROM Customer WHERE CustID = ?', [req.params.id]);
    res.json({ success: true, message: 'Customer deleted' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2')
      return res.status(400).json({ success: false, error: 'Cannot delete — customer has bookings' });
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
