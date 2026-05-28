const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const customerRoutes = require('./routes/customerRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRMS Backend is running!' });
});

app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/rentals', rentalRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Ì∫Ä Server running on http://localhost:${PORT}`);
  console.log(`Ì≥Å API endpoints available at /api/`);
});
