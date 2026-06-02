// src/routes/insuranceRoutes.js
const express = require('express');
const router  = express.Router();
const { getAllInsurances, getInsuranceById, createInsurance, updateInsurance, deleteInsurance } = require('../controllers/insuranceController');

router.get('/',     getAllInsurances);
router.get('/:id',  getInsuranceById);
router.post('/',    createInsurance);
router.put('/:id',  updateInsurance);
router.delete('/:id', deleteInsurance);

module.exports = router;
