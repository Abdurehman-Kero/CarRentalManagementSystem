// src/controllers/authController.js
const pool    = require('../lib/db');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

const JWT_SECRET        = process.env.JWT_SECRET || 'crms-super-secret-jwt-key-2026';
const SUPER_ADMIN_EMAIL = 'keroabdurehman@gmail.com';

// ── Login ────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password are required' });

    const [rows] = await pool.query(
      'SELECT * FROM `admin` WHERE Email = ?',
      [email.toLowerCase().trim()]
    );
    if (!rows.length)
      return res.status(401).json({ success: false, error: 'Invalid email or password' });

    const admin = rows[0];
    const ok    = await bcrypt.compare(password, admin.Password);
    if (!ok)
      return res.status(401).json({ success: false, error: 'Invalid email or password' });

    const token = jwt.sign(
      { adminId: admin.AdminID, email: admin.Email, role: admin.Role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id:       admin.AdminID,
          fullName: admin.FullName,
          email:    admin.Email,
          role:     admin.Role,
        },
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get current admin ────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT AdminID, FullName, Email, Role, CreatedAt FROM `admin` WHERE AdminID = ?',
      [req.admin.adminId]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Admin not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get all admins (super admin only) ───────────────────────────
const getAllAdmins = async (req, res) => {
  try {
    if (req.admin.email !== SUPER_ADMIN_EMAIL)
      return res.status(403).json({ success: false, error: 'Only the super admin can view all admins' });

    const [rows] = await pool.query(
      'SELECT AdminID, FullName, Email, Role, CreatedAt FROM `admin` ORDER BY CreatedAt ASC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Add admin (super admin only) ────────────────────────────────
const addAdmin = async (req, res) => {
  try {
    if (req.admin.email !== SUPER_ADMIN_EMAIL)
      return res.status(403).json({ success: false, error: 'Only the super admin can add new admins' });

    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required' });

    const cleanEmail = email.toLowerCase().trim();
    const [existing] = await pool.query('SELECT AdminID FROM `admin` WHERE Email = ?', [cleanEmail]);
    if (existing.length)
      return res.status(409).json({ success: false, error: 'An admin with this email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO `admin` (FullName, Email, Password, Role) VALUES (?, ?, ?, ?)',
      [fullName.trim(), cleanEmail, hashed, 'admin']
    );

    const [newAdmin] = await pool.query(
      'SELECT AdminID, FullName, Email, Role, CreatedAt FROM `admin` WHERE AdminID = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newAdmin[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete admin (super admin only) ─────────────────────────────
const deleteAdmin = async (req, res) => {
  try {
    if (req.admin.email !== SUPER_ADMIN_EMAIL)
      return res.status(403).json({ success: false, error: 'Only the super admin can remove admins' });

    const [rows] = await pool.query('SELECT * FROM `admin` WHERE AdminID = ?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Admin not found' });
    if (rows[0].Email === SUPER_ADMIN_EMAIL)
      return res.status(400).json({ success: false, error: 'Cannot delete the super admin account' });

    await pool.query('DELETE FROM `admin` WHERE AdminID = ?', [req.params.id]);
    res.json({ success: true, message: 'Admin removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Seed super admin (called on startup) ─────────────────────────
const seedSuperAdmin = async () => {
  try {
    const [rows] = await pool.query('SELECT AdminID FROM `admin` WHERE Email = ?', [SUPER_ADMIN_EMAIL]);
    if (!rows.length) {
      const hashed = await bcrypt.hash('nexus@0974', 12);
      await pool.query(
        'INSERT INTO `admin` (FullName, Email, Password, Role) VALUES (?, ?, ?, ?)',
        ['Super Admin', SUPER_ADMIN_EMAIL, hashed, 'superadmin']
      );
      console.log(`✅ Super admin seeded: ${SUPER_ADMIN_EMAIL}`);
    } else {
      console.log(`ℹ️  Super admin already exists`);
    }
  } catch (err) {
    console.error('❌ Failed to seed super admin:', err.message);
  }
};

module.exports = { login, getMe, getAllAdmins, addAdmin, deleteAdmin, seedSuperAdmin };
