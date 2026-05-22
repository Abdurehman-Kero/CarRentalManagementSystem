// src/controllers/bookingController.js
const prisma = require('../lib/prisma');

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        car:      true,
        rental:   true,
      },
      orderBy: { BookingID: 'desc' },
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { BookingID: parseInt(req.params.id) },
      include: { customer: true, car: true, rental: true },
    });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const { BookingID, BookingDate, PickupDate, ReturnDate, CustID, CarID } = req.body;

    // Check car is available
    const car = await prisma.car.findUnique({ where: { CarID: parseInt(CarID) } });
    if (!car) return res.status(404).json({ success: false, error: 'Car not found' });
    if (car.Status !== 'Available') {
      return res.status(400).json({ success: false, error: 'Car is not available for booking' });
    }

    const booking = await prisma.booking.create({
      data: {
        BookingID:   parseInt(BookingID),
        BookingDate: new Date(BookingDate),
        PickupDate:  new Date(PickupDate),
        ReturnDate:  new Date(ReturnDate),
        Status:      'Pending',
        CustID:      parseInt(CustID),
        CarID:       parseInt(CarID),
      },
      include: { customer: true, car: true },
    });
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { Status } = req.body;
    const booking = await prisma.booking.update({
      where: { BookingID: parseInt(req.params.id) },
      data:  { Status },
    });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Calculate cost
const calculateCost = async (req, res) => {
  try {
    const { CarID, PickupDate, ReturnDate } = req.body;

    const car = await prisma.car.findUnique({
      where: { CarID: parseInt(CarID) },
      include: { category: true },
    });
    if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

    // Use category PricePerDay first, fall back to DailyRate on car
    const pricePerDay = parseFloat(car.category?.PricePerDay || car.DailyRate || 0);
    const pickup  = new Date(PickupDate);
    const returns = new Date(ReturnDate);
    const days    = Math.max(1, Math.ceil((returns - pickup) / (1000 * 60 * 60 * 24)));
    const totalCost = parseFloat((pricePerDay * days).toFixed(2));

    res.json({ success: true, data: { days, pricePerDay, totalCost } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllBookings, getBookingById, createBooking, updateBookingStatus, calculateCost };
