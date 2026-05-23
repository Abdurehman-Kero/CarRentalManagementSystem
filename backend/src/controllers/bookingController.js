// src/controllers/bookingController.js — mysql2 direct queries
const pool = require('../lib/db');

// ── Get all bookings ─────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*,
             c.FullName AS CustomerName, c.Email AS CustomerEmail, c.Phone AS CustomerPhone,
             ca.Brand, ca.Model, ca.LicensePlate, ca.Status AS CarStatus,
             r.RentalID, r.TotalAmount, r.ActualReturnDate
      FROM Booking b
      LEFT JOIN Customer c  ON b.CustID = c.CustID
      LEFT JOIN Car      ca ON b.CarID  = ca.CarID
      LEFT JOIN Rental   r  ON b.BookingID = r.BookingID
      ORDER BY b.BookingID DESC
    `);
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get booking by ID ────────────────────────────────────────────
const getBookingById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*,
             c.FullName AS CustomerName, c.Email AS CustomerEmail,
             ca.Brand, ca.Model, ca.LicensePlate,
             r.RentalID, r.TotalAmount, r.ActualReturnDate
      FROM Booking b
      LEFT JOIN Customer c  ON b.CustID = c.CustID
      LEFT JOIN Car      ca ON b.CarID  = ca.CarID
      LEFT JOIN Rental   r  ON b.BookingID = r.BookingID
      WHERE b.BookingID = ?
    `, [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create booking ───────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { BookingID, BookingDate, PickupDate, ReturnDate, CustID, CarID } = req.body;

    const [carRows] = await pool.query('SELECT * FROM Car WHERE CarID = ?', [CarID]);
    if (!carRows.length)
      return res.status(404).json({ success: false, error: 'Car not found' });
    if (carRows[0].Status !== 'Available')
      return res.status(400).json({ success: false, error: 'Car is not available for booking' });

    await pool.query(
      `INSERT INTO Booking (BookingID, BookingDate, PickupDate, ReturnDate, Status, CustID, CarID)
       VALUES (?, ?, ?, ?, 'Pending', ?, ?)`,
      [parseInt(BookingID), new Date(BookingDate), new Date(PickupDate), new Date(ReturnDate),
       parseInt(CustID), parseInt(CarID)]
    );

    const [booking] = await pool.query(`
      SELECT b.*, c.FullName AS CustomerName, ca.Brand, ca.Model
      FROM Booking b
      LEFT JOIN Customer c ON b.CustID = c.CustID
      LEFT JOIN Car ca ON b.CarID = ca.CarID
      WHERE b.BookingID = ?
    `, [parseInt(BookingID)]);

    res.status(201).json({ success: true, data: booking[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Booking ID already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update booking status ────────────────────────────────────────
const updateBookingStatus = async (req, res) => {
  try {
    const { Status } = req.body;
    await pool.query('UPDATE Booking SET Status = ? WHERE BookingID = ?', [Status, req.params.id]);
    const [booking] = await pool.query('SELECT * FROM Booking WHERE BookingID = ?', [req.params.id]);
    res.json({ success: true, data: booking[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Calculate cost ───────────────────────────────────────────────
const calculateCost = async (req, res) => {
  try {
    const { CarID, PickupDate, ReturnDate } = req.body;
    const [carRows] = await pool.query(`
      SELECT c.*, cat.PricePerDay
      FROM Car c LEFT JOIN Category cat ON c.CategoryID = cat.CategoryID
      WHERE c.CarID = ?
    `, [CarID]);
    if (!carRows.length)
      return res.status(404).json({ success: false, error: 'Car not found' });

    const car        = carRows[0];
    const pricePerDay = parseFloat(car.PricePerDay || car.DailyRate || 0);
    const days       = Math.max(1, Math.ceil((new Date(ReturnDate) - new Date(PickupDate)) / 86400000));
    const totalCost  = parseFloat((pricePerDay * days).toFixed(2));

    res.json({ success: true, data: { days, pricePerDay, totalCost } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllBookings, getBookingById, createBooking, updateBookingStatus, calculateCost };
