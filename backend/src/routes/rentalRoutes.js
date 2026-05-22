// src/routes/rentalRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllRentals,
  getRentalById,
  createRental,
  returnCar,
} = require('../controllers/rentalController');

router.get('/',            getAllRentals);
router.get('/:id',         getRentalById);
router.post('/',           createRental);
router.put('/:id/return',  returnCar);

module.exports = router;
