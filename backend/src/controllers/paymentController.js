// src/controllers/paymentController.js
const pool = require('../lib/db');

// ── Get all payments (optionally filter by bookingId) ─────────────
const getAllPayments = async (req, res) => {
  try {
    const { bookingId } = req.query;
    const where  = bookingId ? 'WHERE p.BookingID = ?' : '';
    const params = bookingId ? [parseInt(bookingId)] : [];

    const [payments] = await pool.query(
      `SELECT p.*,
              pm.MethodType,
              b.PickupDate, b.ReturnDate,
              c.FullName AS CustomerName,
              ca.Brand, ca.Model
       FROM payment p
       LEFT JOIN paymentmethod pm ON p.MethodID    = pm.MethodID
       LEFT JOIN booking        b  ON p.BookingID   = b.BookingID
       LEFT JOIN customer       c  ON b.CustID      = c.CustID
       LEFT JOIN car            ca ON b.CarID       = ca.CarID
       ${where}
       ORDER BY p.PaymentDate DESC`,
      params
    );
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get payments for a booking ────────────────────────────────────
const getPaymentsByBooking = async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT p.*, pm.MethodType
       FROM payment p
       LEFT JOIN paymentmethod pm ON p.MethodID = pm.MethodID
       WHERE p.BookingID = ?
       ORDER BY p.PaymentDate DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Record a payment for a booking ───────────────────────────────
const createPayment = async (req, res) => {
  try {
    const { BookingID, PaymentID, Amount, PaymentDate, Status, MethodID } = req.body;
    if (!BookingID || !PaymentID || Amount === undefined || !PaymentDate || !MethodID)
      return res.status(400).json({ success: false, error: 'BookingID, PaymentID, Amount, PaymentDate and MethodID are required' });

    // Verify booking exists
    const [booking] = await pool.query('SELECT BookingID FROM booking WHERE BookingID = ?', [parseInt(BookingID)]);
    if (!booking.length)
      return res.status(404).json({ success: false, error: 'Booking not found' });

    // Verify payment method exists
    const [method] = await pool.query('SELECT MethodID FROM paymentmethod WHERE MethodID = ?', [parseInt(MethodID)]);
    if (!method.length)
      return res.status(404).json({ success: false, error: 'Payment method not found' });

    await pool.query(
      `INSERT INTO payment (BookingID, PaymentID, Amount, PaymentDate, Status, MethodID)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        parseInt(BookingID),
        parseInt(PaymentID),
        parseFloat(Amount),
        new Date(PaymentDate),
        Status || 'Completed',
        parseInt(MethodID)
      ]
    );

    const [payment] = await pool.query(
      `SELECT p.*, pm.MethodType FROM payment p
       LEFT JOIN paymentmethod pm ON p.MethodID = pm.MethodID
       WHERE p.BookingID = ? AND p.PaymentID = ?`,
      [parseInt(BookingID), parseInt(PaymentID)]
    );
    res.status(201).json({ success: true, data: payment[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Payment ID already exists for this booking' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete a payment ──────────────────────────────────────────────
const deletePayment = async (req, res) => {
  try {
    const { bookingId, paymentId } = req.params;
    const [result] = await pool.query(
      'DELETE FROM payment WHERE BookingID = ? AND PaymentID = ?',
      [bookingId, paymentId]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Payment not found' });
    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get total revenue stats ───────────────────────────────────────
const getRevenueStats = async (req, res) => {
  try {
    const [stats] = await pool.query(
      `SELECT
         SUM(Amount)                             AS TotalRevenue,
         COUNT(*)                                AS TotalPayments,
         SUM(CASE WHEN Status='Completed' THEN Amount ELSE 0 END) AS CompletedRevenue,
         SUM(CASE WHEN Status='Pending'   THEN Amount ELSE 0 END) AS PendingRevenue
       FROM payment`
    );

    const [monthly] = await pool.query(
      `SELECT DATE_FORMAT(PaymentDate, '%Y-%m') AS Month, SUM(Amount) AS Revenue, COUNT(*) AS Count
       FROM payment
       WHERE PaymentDate >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(PaymentDate, '%Y-%m')
       ORDER BY Month ASC`
    );

    res.json({ success: true, data: { ...stats[0], monthly } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllPayments, getPaymentsByBooking, createPayment, deletePayment, getRevenueStats };
