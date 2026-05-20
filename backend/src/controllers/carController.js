// src/controllers/carController.js
const prisma = require('../lib/prisma');

// Get all cars (with optional filters)
const getAllCars = async (req, res) => {
  try {
    const { status, brand, search } = req.query;
    const where = {};
    if (status)            where.Status = status;
    if (brand)             where.Brand  = { contains: brand };
    if (search)            where.OR = [
      { Brand: { contains: search } },
      { Model: { contains: search } },
      { LicensePlate: { contains: search } },
    ];

    const cars = await prisma.car.findMany({
      where,
      include: { category: true, branch: true },
      orderBy: { CarID: 'asc' },
    });
    res.json({ success: true, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get car by ID
const getCarById = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { CarID: parseInt(req.params.id) },
      include: { category: true, branch: true, fuelPolicy: true },
    });
    if (!car) return res.status(404).json({ success: false, error: 'Car not found' });
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create car
const createCar = async (req, res) => {
  try {
    const { CarID, LicensePlate, Model, Brand, Year, Color, Status, DailyRate, Mileage,
            CategoryID, BranchID, PolicyID } = req.body;

    const car = await prisma.car.create({
      data: {
        CarID:        parseInt(CarID),
        LicensePlate: LicensePlate?.toUpperCase(),
        Model,
        Brand,
        Year:         parseInt(Year),
        Color,
        Status:       Status || 'Available',
        DailyRate:    DailyRate ? parseFloat(DailyRate) : undefined,
        Mileage:      Mileage   ? parseInt(Mileage)     : undefined,
        CategoryID:   CategoryID ? parseInt(CategoryID) : undefined,
        BranchID:     BranchID   ? parseInt(BranchID)   : undefined,
        PolicyID:     PolicyID   ? parseInt(PolicyID)   : undefined,
      },
    });
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update car
const updateCar = async (req, res) => {
  try {
    const { LicensePlate, Model, Brand, Year, Color, Status, DailyRate, Mileage,
            CategoryID, BranchID, PolicyID } = req.body;

    const car = await prisma.car.update({
      where: { CarID: parseInt(req.params.id) },
      data: {
        ...(LicensePlate && { LicensePlate: LicensePlate.toUpperCase() }),
        ...(Model        && { Model }),
        ...(Brand        && { Brand }),
        ...(Year         && { Year: parseInt(Year) }),
        ...(Color        && { Color }),
        ...(Status       && { Status }),
        ...(DailyRate    && { DailyRate: parseFloat(DailyRate) }),
        ...(Mileage      && { Mileage: parseInt(Mileage) }),
        ...(CategoryID   && { CategoryID: parseInt(CategoryID) }),
        ...(BranchID     && { BranchID: parseInt(BranchID) }),
        ...(PolicyID     && { PolicyID: parseInt(PolicyID) }),
      },
    });
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update car status only
const updateCarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const car = await prisma.car.update({
      where: { CarID: parseInt(req.params.id) },
      data: { Status: status },
    });
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete car
const deleteCar = async (req, res) => {
  try {
    await prisma.car.delete({ where: { CarID: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Car removed from fleet' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllCars, getCarById, createCar, updateCar, updateCarStatus, deleteCar };
