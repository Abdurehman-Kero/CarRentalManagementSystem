// src/controllers/categoryController.js
const pool = require('../lib/db');

// ── Get all categories ────────────────────────────────────────────
const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT cat.*, COUNT(c.CarID) AS CarCount
       FROM Category cat
       LEFT JOIN Car c ON cat.CategoryID = c.CategoryID
       GROUP BY cat.CategoryID
       ORDER BY cat.CategoryID ASC`
    );
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get category by ID ────────────────────────────────────────────
const getCategoryById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Category WHERE CategoryID = ?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Category not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create category ───────────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { CategoryID, CategoryName, PricePerDay } = req.body;
    if (!CategoryID || !CategoryName || PricePerDay === undefined)
      return res.status(400).json({ success: false, error: 'CategoryID, CategoryName and PricePerDay are required' });

    await pool.query(
      `INSERT INTO Category (CategoryID, CategoryName, PricePerDay) VALUES (?, ?, ?)`,
      [parseInt(CategoryID), CategoryName.trim(), parseFloat(PricePerDay)]
    );

    const [cat] = await pool.query('SELECT * FROM Category WHERE CategoryID = ?', [parseInt(CategoryID)]);
    res.status(201).json({ success: true, data: cat[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Category ID already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update category ───────────────────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const { CategoryName, PricePerDay } = req.body;
    const id = req.params.id;
    const sets = [], params = [];

    if (CategoryName !== undefined) { sets.push('CategoryName = ?'); params.push(CategoryName.trim()); }
    if (PricePerDay  !== undefined) { sets.push('PricePerDay = ?');  params.push(parseFloat(PricePerDay)); }

    if (!sets.length)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    params.push(id);
    await pool.query(`UPDATE Category SET ${sets.join(', ')} WHERE CategoryID = ?`, params);
    const [cat] = await pool.query('SELECT * FROM Category WHERE CategoryID = ?', [id]);
    res.json({ success: true, data: cat[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete category ───────────────────────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Category WHERE CategoryID = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Category not found' });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2')
      return res.status(409).json({ success: false, error: 'Cannot delete category — it is assigned to cars' });
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
