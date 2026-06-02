// src/routes/employeeRoutes.js
const express = require('express');
const router  = express.Router();
const { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

router.get('/',     getAllEmployees);   // supports ?branchId=X
router.get('/:id',  getEmployeeById);
router.post('/',    createEmployee);
router.put('/:id',  updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
