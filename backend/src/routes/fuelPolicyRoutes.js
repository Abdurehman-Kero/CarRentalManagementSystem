// src/routes/fuelPolicyRoutes.js
const express = require('express');
const router  = express.Router();
const { getAllFuelPolicies, getFuelPolicyById, createFuelPolicy, updateFuelPolicy, deleteFuelPolicy } = require('../controllers/fuelPolicyController');

router.get('/',     getAllFuelPolicies);
router.get('/:id',  getFuelPolicyById);
router.post('/',    createFuelPolicy);
router.put('/:id',  updateFuelPolicy);
router.delete('/:id', deleteFuelPolicy);

module.exports = router;
