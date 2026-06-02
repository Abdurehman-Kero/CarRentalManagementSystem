// src/routes/maintenanceRoutes.js
const express = require('express');
const router  = express.Router();
const { getAllMaintenance, getMaintenanceByCar, createMaintenance, updateMaintenance, deleteMaintenance } = require('../controllers/maintenanceController');

router.get('/',                              getAllMaintenance);         // supports ?carId=X
router.get('/car/:carId',                    getMaintenanceByCar);
router.post('/',                             createMaintenance);
router.put('/:carId/:maintenanceId',         updateMaintenance);
router.delete('/:carId/:maintenanceId',      deleteMaintenance);

module.exports = router;
