// src/routes/bookingRoutes.js
const express = require('express');
const router  = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  calculateCost,
} = require('../controllers/bookingController');

router.get('/',                  getAllBookings);
router.get('/:id',               getBookingById);
router.post('/',                 createBooking);
router.put('/:id/status',        updateBookingStatus);
router.post('/calculate-cost',   calculateCost);

module.exports = router;
