// src/controllers/rentalController.js — mysql2 direct queries
const pool = require('../lib/db');

// ── Get all rentals ──────────────────────────────────────────────
const getAllRentals = async (req, res) => {
  try {
    const [rentals] = await pool.query(`
      SELECT r.*,
             b.BookingDate, b.PickupDate, b.ReturnDate, b.Status AS BookingStatus,
             c.FullName AS CustomerName, c.Email AS CustomerEmail, c.Phone AS CustomerPhone,
             ca.Brand, ca.Model, ca.LicensePlate
      FROM rental r
      LEFT JOIN booking  b  ON r.BookingID = b.BookingID
      LEFT JOIN customer c  ON b.CustID   = c.CustID
      LEFT JOIN car      ca ON b.CarID    = ca.CarID
      ORDER BY r.RentalID DESC
    `);
    res.json({ success: true, data: rentals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get rental by ID ─────────────────────────────────────────────
const getRentalById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*,
             b.BookingDate, b.PickupDate, b.ReturnDate, b.Status AS BookingStatus,
             c.FullName AS CustomerName, c.Email AS CustomerEmail,
             ca.Brand, ca.Model, ca.LicensePlate
      FROM rental r
      LEFT JOIN booking  b  ON r.BookingID = b.BookingID
      LEFT JOIN customer c  ON b.CustID   = c.CustID
      LEFT JOIN car      ca ON b.CarID    = ca.CarID
      WHERE r.RentalID = ?
    `, [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Rental not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create rental (checkout) ─────────────────────────────────────
const createRental = async (req, res) => {
  try {
    const { RentalID, StartDate, EndDate, TotalAmount, BookingID } = req.body;

    const [existing] = await pool.query('SELECT RentalID FROM rental WHERE BookingID = ?', [BookingID]);
    if (existing.length)
      return res.status(400).json({ success: false, error: 'Booking already has a rental' });

    await pool.query(
      `INSERT INTO rental (RentalID, StartDate, EndDate, TotalAmount, BookingID)
       VALUES (?, ?, ?, ?, ?)`,
      [parseInt(RentalID), new Date(StartDate), new Date(EndDate), parseFloat(TotalAmount), parseInt(BookingID)]
    );

    const [rental] = await pool.query('SELECT * FROM rental WHERE RentalID = ?', [parseInt(RentalID)]);
    res.status(201).json({ success: true, data: rental[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Rental ID already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Return car ───────────────────────────────────────────────────
const returnCar = async (req, res) => {
  try {
    const { ActualReturnDate } = req.body;
    await pool.query(
      'UPDATE rental SET ActualReturnDate = ? WHERE RentalID = ?',
      [new Date(ActualReturnDate), req.params.id]
    );
    const [rental] = await pool.query('SELECT * FROM rental WHERE RentalID = ?', [req.params.id]);
    res.json({ success: true, data: rental[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllRentals, getRentalById, createRental, returnCar };
