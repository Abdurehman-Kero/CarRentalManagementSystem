// src/routes/bookingRoutes.js
const express = require('express');
const router  = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  calculateCost,
  addDriverToBooking,
  removeDriverFromBooking,
  addInsuranceToBooking,
  removeInsuranceFromBooking,
} = require('../controllers/bookingController');

router.get('/',                  getAllBookings);
router.get('/:id',               getBookingById);
router.post('/',                 createBooking);
router.put('/:id/status',        updateBookingStatus);
router.post('/calculate-cost',   calculateCost);

// Drivers
router.post('/:id/drivers',               addDriverToBooking);
router.delete('/:id/drivers/:driverId',   removeDriverFromBooking);

// Insurances
router.post('/:id/insurances',                 addInsuranceToBooking);
router.delete('/:id/insurances/:insuranceId',  removeInsuranceFromBooking);

module.exports = router;
