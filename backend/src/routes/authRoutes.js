// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, getMe, getAllAdmins, addAdmin, deleteAdmin } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Public
router.post('/login', login);

// Protected
router.get('/me',     requireAuth, getMe);
router.get('/admins', requireAuth, getAllAdmins);
router.post('/admins', requireAuth, addAdmin);
router.delete('/admins/:id', requireAuth, deleteAdmin);

module.exports = router;
