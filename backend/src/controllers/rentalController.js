// src/controllers/rentalController.js
const prisma = require('../lib/prisma');

// Get all rentals
const getAllRentals = async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      include: {
        booking: {
          include: { customer: true, car: true },
        },
      },
      orderBy: { RentalID: 'desc' },
    });
    res.json({ success: true, data: rentals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get rental by ID
const getRentalById = async (req, res) => {
  try {
    const rental = await prisma.rental.findUnique({
      where: { RentalID: parseInt(req.params.id) },
      include: { booking: { include: { customer: true, car: true } } },
    });
    if (!rental) return res.status(404).json({ success: false, error: 'Rental not found' });
    res.json({ success: true, data: rental });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create rental (checkout)
const createRental = async (req, res) => {
  try {
    const { RentalID, StartDate, EndDate, TotalAmount, BookingID } = req.body;

    const existing = await prisma.rental.findUnique({
      where: { BookingID: parseInt(BookingID) },
    });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Booking already has a rental' });
    }

    const rental = await prisma.rental.create({
      data: {
        RentalID:    parseInt(RentalID),
        StartDate:   new Date(StartDate),
        EndDate:     new Date(EndDate),
        TotalAmount: parseFloat(TotalAmount),
        BookingID:   parseInt(BookingID),
      },
    });
    res.status(201).json({ success: true, data: rental });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Return car
const returnCar = async (req, res) => {
  try {
    const { ActualReturnDate } = req.body;
    const rental = await prisma.rental.update({
      where: { RentalID: parseInt(req.params.id) },
      data:  { ActualReturnDate: new Date(ActualReturnDate) },
    });
    res.json({ success: true, data: rental });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllRentals, getRentalById, createRental, returnCar };
