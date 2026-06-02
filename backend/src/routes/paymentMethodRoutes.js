// src/routes/paymentMethodRoutes.js
const express = require('express');
const router  = express.Router();
const { getAllPaymentMethods, getPaymentMethodById, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } = require('../controllers/paymentMethodController');

router.get('/',     getAllPaymentMethods);
router.get('/:id',  getPaymentMethodById);
router.post('/',    createPaymentMethod);
router.put('/:id',  updatePaymentMethod);
router.delete('/:id', deletePaymentMethod);

module.exports = router;
