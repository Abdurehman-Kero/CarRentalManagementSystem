// src/routes/paymentRoutes.js
const express = require('express');
const router  = express.Router();
const { getAllPayments, getPaymentsByBooking, createPayment, deletePayment, getRevenueStats } = require('../controllers/paymentController');

router.get('/stats',                    getRevenueStats);
router.get('/',                         getAllPayments);         // supports ?bookingId=X
router.get('/booking/:id',              getPaymentsByBooking);
router.post('/',                        createPayment);
router.delete('/:bookingId/:paymentId', deletePayment);

module.exports = router;
