// src/controllers/customerController.js
const prisma = require('../lib/prisma');

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { bookings: true },
      orderBy: { CustID: 'asc' },
    });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { CustID: parseInt(req.params.id) },
      include: { bookings: true },
    });
    if (!customer) return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create customer
const createCustomer = async (req, res) => {
  try {
    const { CustID, FullName, Email, Phone, StreetAddress, City, State, ZipCode, DriverLicenseNo } = req.body;

    const existing = await prisma.customer.findFirst({
      where: { OR: [{ Email }, { DriverLicenseNo }] },
    });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email or Driver License already exists' });
    }

    const customer = await prisma.customer.create({
      data: {
        CustID: parseInt(CustID),
        FullName, Email, Phone, StreetAddress, City, State, ZipCode, DriverLicenseNo,
      },
    });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { FullName, Email, Phone, StreetAddress, City, State, ZipCode, DriverLicenseNo } = req.body;
    const customer = await prisma.customer.update({
      where: { CustID: parseInt(req.params.id) },
      data: {
        ...(FullName        && { FullName }),
        ...(Email           && { Email }),
        ...(Phone           && { Phone }),
        ...(StreetAddress   && { StreetAddress }),
        ...(City            && { City }),
        ...(State           && { State }),
        ...(ZipCode         && { ZipCode }),
        ...(DriverLicenseNo && { DriverLicenseNo }),
      },
    });
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    await prisma.customer.delete({ where: { CustID: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
