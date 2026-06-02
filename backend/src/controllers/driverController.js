// src/controllers/driverController.js
const pool = require('../lib/db');

// ── Get all drivers ───────────────────────────────────────────────
const getAllDrivers = async (req, res) => {
  try {
    const [drivers] = await pool.query(
      `SELECT d.*, COUNT(bd.BookingID) AS BookingCount
       FROM Driver d
       LEFT JOIN BookingDriver bd ON d.DriverID = bd.DriverID
       GROUP BY d.DriverID
       ORDER BY d.DriverID ASC`
    );
    res.json({ success: true, data: drivers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get driver by ID ──────────────────────────────────────────────
const getDriverById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Driver WHERE DriverID = ?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Driver not found' });

    // Also fetch their bookings
    const [bookings] = await pool.query(
      `SELECT b.BookingID, b.PickupDate, b.ReturnDate, b.Status,
              c.FullName AS CustomerName, ca.Brand, ca.Model
       FROM BookingDriver bd
       JOIN Booking b ON bd.BookingID = b.BookingID
       JOIN Customer c ON b.CustID = c.CustID
       JOIN Car ca ON b.CarID = ca.CarID
       WHERE bd.DriverID = ?
       ORDER BY b.PickupDate DESC`, [req.params.id]
    );

    res.json({ success: true, data: { ...rows[0], bookings } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create driver ─────────────────────────────────────────────────
const createDriver = async (req, res) => {
  try {
    const { DriverID, FullName, LicenseNumber, Phone } = req.body;
    if (!DriverID || !FullName || !LicenseNumber || !Phone)
      return res.status(400).json({ success: false, error: 'All fields are required' });

    await pool.query(
      `INSERT INTO Driver (DriverID, FullName, LicenseNumber, Phone) VALUES (?, ?, ?, ?)`,
      [parseInt(DriverID), FullName.trim(), LicenseNumber.trim(), Phone.trim()]
    );

    const [driver] = await pool.query('SELECT * FROM Driver WHERE DriverID = ?', [parseInt(DriverID)]);
    res.status(201).json({ success: true, data: driver[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Driver ID or License Number already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update driver ─────────────────────────────────────────────────
const updateDriver = async (req, res) => {
  try {
    const { FullName, LicenseNumber, Phone } = req.body;
    const id = req.params.id;
    const sets = [], params = [];

    if (FullName       !== undefined) { sets.push('FullName = ?');       params.push(FullName.trim()); }
    if (LicenseNumber  !== undefined) { sets.push('LicenseNumber = ?');  params.push(LicenseNumber.trim()); }
    if (Phone          !== undefined) { sets.push('Phone = ?');          params.push(Phone.trim()); }

    if (!sets.length)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    params.push(id);
    await pool.query(`UPDATE Driver SET ${sets.join(', ')} WHERE DriverID = ?`, params);
    const [driver] = await pool.query('SELECT * FROM Driver WHERE DriverID = ?', [id]);
    res.json({ success: true, data: driver[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete driver ─────────────────────────────────────────────────
const deleteDriver = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Driver WHERE DriverID = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Driver not found' });
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2')
      return res.status(409).json({ success: false, error: 'Cannot delete — driver is assigned to bookings' });
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver };
