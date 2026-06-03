// src/controllers/carController.js — mysql2 direct queries
const pool = require('../lib/db');

/* helper: search filter fragment */
const searchWhere = (search) =>
  search ? `AND (Brand LIKE ? OR Model LIKE ? OR LicensePlate LIKE ?)` : '';
const searchParams = (search) =>
  search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];

// ── Get all cars ─────────────────────────────────────────────────
const getAllCars = async (req, res) => {
  try {
    const { status, brand, search } = req.query;
    const where  = [];
    const params = [];

    if (status) { where.push('c.Status = ?');       params.push(status); }
    if (brand)  { where.push('c.Brand LIKE ?');     params.push(`%${brand}%`); }
    if (search) {
      where.push('(c.Brand LIKE ? OR c.Model LIKE ? OR c.LicensePlate LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const sql = `
      SELECT c.*,
             cat.CategoryName, cat.PricePerDay,
             b.BranchName, b.LocationCity,
             fp.Description AS PolicyDescription, fp.AdditionalCharge,
             (SELECT ImageURL FROM carimage ci WHERE ci.CarID = c.CarID LIMIT 1) AS ImageURL
      FROM car c
      LEFT JOIN category  cat ON c.CategoryID = cat.CategoryID
      LEFT JOIN branch    b   ON c.BranchID   = b.BranchID
      LEFT JOIN fuelpolicy fp ON c.PolicyID   = fp.PolicyID
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY c.CarID ASC
    `;
    const [cars] = await pool.query(sql, params);
    res.json({ success: true, data: cars });
  } catch (err) {
    require('fs').appendFileSync(require('path').join(__dirname, '../../error.log'), `[${new Date().toISOString()}] GET /api/cars Error: ${err.stack || err}\n`);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get car by ID ────────────────────────────────────────────────
const getCarById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*,
             cat.CategoryName, cat.PricePerDay,
             b.BranchName, b.LocationCity,
             fp.Description AS PolicyDescription, fp.AdditionalCharge,
             (SELECT ImageURL FROM carimage ci WHERE ci.CarID = c.CarID LIMIT 1) AS ImageURL
      FROM car c
      LEFT JOIN category  cat ON c.CategoryID = cat.CategoryID
      LEFT JOIN branch    b   ON c.BranchID   = b.BranchID
      LEFT JOIN fuelpolicy fp ON c.PolicyID   = fp.PolicyID
      WHERE c.CarID = ?
    `, [req.params.id]);

    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Car not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create car ───────────────────────────────────────────────────
const createCar = async (req, res) => {
  try {
    const { CarID, LicensePlate, Model, Brand, Year, Color, Status,
            DailyRate, Mileage, CategoryID, BranchID, PolicyID, ImageURL } = req.body;

    await pool.query(
      `INSERT INTO car (CarID, LicensePlate, Model, Brand, Year, Color, Status,
                        DailyRate, Mileage, CategoryID, BranchID, PolicyID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parseInt(CarID),
        LicensePlate?.toUpperCase(),
        Model, Brand,
        parseInt(Year),
        Color,
        Status || 'Available',
        DailyRate  ? parseFloat(DailyRate) : null,
        Mileage    ? parseInt(Mileage)     : null,
        CategoryID ? parseInt(CategoryID)  : 1,
        BranchID   ? parseInt(BranchID)    : 1,
        PolicyID   ? parseInt(PolicyID)    : 1,
      ]
    );

    if (ImageURL) {
      await pool.query('INSERT INTO carimage (CarID, ImageID, ImageURL) VALUES (?, 1, ?)', [parseInt(CarID), ImageURL]);
    }

    const [car] = await pool.query('SELECT * FROM car WHERE CarID = ?', [parseInt(CarID)]);
    res.status(201).json({ success: true, data: car[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Car ID or License Plate already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update car ───────────────────────────────────────────────────
const updateCar = async (req, res) => {
  try {
    const { LicensePlate, Model, Brand, Year, Color, Status,
            DailyRate, Mileage, CategoryID, BranchID, PolicyID, ImageURL } = req.body;
    const id = req.params.id;

    const sets   = [];
    const params = [];

    if (LicensePlate !== undefined) { sets.push('LicensePlate = ?'); params.push(LicensePlate.toUpperCase()); }
    if (Model        !== undefined) { sets.push('Model = ?');        params.push(Model); }
    if (Brand        !== undefined) { sets.push('Brand = ?');        params.push(Brand); }
    if (Year         !== undefined) { sets.push('Year = ?');         params.push(parseInt(Year)); }
    if (Color        !== undefined) { sets.push('Color = ?');        params.push(Color); }
    if (Status       !== undefined) { sets.push('Status = ?');       params.push(Status); }
    if (DailyRate    !== undefined) { sets.push('DailyRate = ?');    params.push(parseFloat(DailyRate)); }
    if (Mileage      !== undefined) { sets.push('Mileage = ?');      params.push(parseInt(Mileage)); }
    if (CategoryID   !== undefined) { sets.push('CategoryID = ?');   params.push(parseInt(CategoryID)); }
    if (BranchID     !== undefined) { sets.push('BranchID = ?');     params.push(parseInt(BranchID)); }
    if (PolicyID     !== undefined) { sets.push('PolicyID = ?');     params.push(parseInt(PolicyID)); }

    if (!sets.length && ImageURL === undefined)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    if (sets.length) {
      params.push(id);
      await pool.query(`UPDATE car SET ${sets.join(', ')} WHERE CarID = ?`, params);
    }

    if (ImageURL !== undefined) {
      const [existing] = await pool.query('SELECT * FROM carimage WHERE CarID = ? AND ImageID = 1', [id]);
      if (existing.length) {
        if (ImageURL) {
          await pool.query('UPDATE carimage SET ImageURL = ? WHERE CarID = ? AND ImageID = 1', [ImageURL, id]);
        } else {
          await pool.query('DELETE FROM carimage WHERE CarID = ? AND ImageID = 1', [id]);
        }
      } else if (ImageURL) {
        await pool.query('INSERT INTO carimage (CarID, ImageID, ImageURL) VALUES (?, 1, ?)', [id, ImageURL]);
      }
    }

    const [car] = await pool.query('SELECT * FROM car WHERE CarID = ?', [id]);
    res.json({ success: true, data: car[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update car status ────────────────────────────────────────────
const updateCarStatus = async (req, res) => {
  try {
    await pool.query('UPDATE car SET Status = ? WHERE CarID = ?', [req.body.status, req.params.id]);
    const [car] = await pool.query('SELECT * FROM car WHERE CarID = ?', [req.params.id]);
    res.json({ success: true, data: car[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete car ───────────────────────────────────────────────────
const deleteCar = async (req, res) => {
  const id = req.params.id;
  try {
    // 1. Get all BookingIDs associated with this CarID
    const [bookings] = await pool.query('SELECT BookingID FROM booking WHERE CarID = ?', [id]);
    const bookingIds = bookings.map(b => b.BookingID);

    if (bookingIds.length > 0) {
      // 2. Cascade delete from dependent tables for those BookingIDs
      await pool.query('DELETE FROM payment WHERE BookingID IN (?)', [bookingIds]);
      await pool.query('DELETE FROM rental WHERE BookingID IN (?)', [bookingIds]);
      await pool.query('DELETE FROM bookingdriver WHERE BookingID IN (?)', [bookingIds]);
      await pool.query('DELETE FROM bookinginsurance WHERE BookingID IN (?)', [bookingIds]);
      // 3. Delete the bookings themselves
      await pool.query('DELETE FROM booking WHERE BookingID IN (?)', [bookingIds]);
    }

    // 4. Delete maintenance records associated with this CarID
    await pool.query('DELETE FROM maintenance WHERE CarID = ?', [id]);

    // 5. Delete images associated with this CarID
    await pool.query('DELETE FROM carimage WHERE CarID = ?', [id]);

    // 6. Delete reviews associated with this CarID
    await pool.query('DELETE FROM review WHERE CarID = ?', [id]);

    // 7. Finally delete the car itself
    await pool.query('DELETE FROM car WHERE CarID = ?', [id]);

    res.json({ success: true, message: 'Car and all its bookings/records successfully removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllCars, getCarById, createCar, updateCar, updateCarStatus, deleteCar };
