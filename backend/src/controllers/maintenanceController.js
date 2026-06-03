// src/controllers/maintenanceController.js
const pool = require('../lib/db');

// ── Get all maintenance records ───────────────────────────────────
const getAllMaintenance = async (req, res) => {
  try {
    const { carId } = req.query;
    const where  = carId ? 'WHERE m.CarID = ?' : '';
    const params = carId ? [parseInt(carId)] : [];

    const [records] = await pool.query(
      `SELECT m.*, c.Brand, c.Model, c.LicensePlate
       FROM maintenance m
       LEFT JOIN car c ON m.CarID = c.CarID
       ${where}
       ORDER BY m.CarID ASC, m.MaintenanceID ASC`,
      params
    );
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get maintenance by car ID ─────────────────────────────────────
const getMaintenanceByCar = async (req, res) => {
  try {
    const [records] = await pool.query(
      `SELECT m.*, c.Brand, c.Model
       FROM maintenance m
       LEFT JOIN car c ON m.CarID = c.CarID
       WHERE m.CarID = ?
       ORDER BY m.MaintenanceID DESC`,
      [req.params.carId]
    );
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create maintenance record ─────────────────────────────────────
const createMaintenance = async (req, res) => {
  try {
    const { CarID, MaintenanceID, ServiceShop, Description, Cost, CompletionDate } = req.body;
    if (!CarID || !MaintenanceID || !ServiceShop || !Description || Cost === undefined)
      return res.status(400).json({ success: false, error: 'CarID, MaintenanceID, ServiceShop, Description and Cost are required' });

    // Verify car exists
    const [car] = await pool.query('SELECT CarID FROM car WHERE CarID = ?', [parseInt(CarID)]);
    if (!car.length)
      return res.status(404).json({ success: false, error: 'Car not found' });

    await pool.query(
      `INSERT INTO maintenance (CarID, MaintenanceID, ServiceShop, Description, Cost, CompletionDate)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        parseInt(CarID),
        parseInt(MaintenanceID),
        ServiceShop.trim(),
        Description.trim(),
        parseFloat(Cost),
        CompletionDate ? new Date(CompletionDate) : null
      ]
    );

    const [record] = await pool.query(
      `SELECT m.*, c.Brand, c.Model FROM maintenance m LEFT JOIN car c ON m.CarID = c.CarID
       WHERE m.CarID = ? AND m.MaintenanceID = ?`,
      [parseInt(CarID), parseInt(MaintenanceID)]
    );
    res.status(201).json({ success: true, data: record[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, error: 'Maintenance record already exists for this car and ID' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Update maintenance record ─────────────────────────────────────
const updateMaintenance = async (req, res) => {
  try {
    const { carId, maintenanceId } = req.params;
    const { ServiceShop, Description, Cost, CompletionDate } = req.body;
    const sets = [], params = [];

    if (ServiceShop     !== undefined) { sets.push('ServiceShop = ?');     params.push(ServiceShop.trim()); }
    if (Description     !== undefined) { sets.push('Description = ?');     params.push(Description.trim()); }
    if (Cost            !== undefined) { sets.push('Cost = ?');            params.push(parseFloat(Cost)); }
    if (CompletionDate  !== undefined) { sets.push('CompletionDate = ?');  params.push(CompletionDate ? new Date(CompletionDate) : null); }

    if (!sets.length)
      return res.status(400).json({ success: false, error: 'No fields to update' });

    params.push(carId, maintenanceId);
    await pool.query(`UPDATE maintenance SET ${sets.join(', ')} WHERE CarID = ? AND MaintenanceID = ?`, params);
    const [record] = await pool.query(
      `SELECT m.*, c.Brand, c.Model FROM maintenance m LEFT JOIN car c ON m.CarID = c.CarID
       WHERE m.CarID = ? AND m.MaintenanceID = ?`,
      [carId, maintenanceId]
    );
    res.json({ success: true, data: record[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete maintenance record ─────────────────────────────────────
const deleteMaintenance = async (req, res) => {
  try {
    const { carId, maintenanceId } = req.params;
    const [result] = await pool.query(
      'DELETE FROM maintenance WHERE CarID = ? AND MaintenanceID = ?',
      [carId, maintenanceId]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, error: 'Maintenance record not found' });
    res.json({ success: true, message: 'Maintenance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllMaintenance, getMaintenanceByCar, createMaintenance, updateMaintenance, deleteMaintenance };
