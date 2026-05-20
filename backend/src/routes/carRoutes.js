// src/routes/carRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  updateCarStatus,
  deleteCar,
} = require('../controllers/carController');

router.get('/',              getAllCars);
router.get('/:id',           getCarById);
router.post('/',             createCar);
router.put('/:id',           updateCar);
router.put('/:id/status',    updateCarStatus);
router.delete('/:id',        deleteCar);

module.exports = router;
