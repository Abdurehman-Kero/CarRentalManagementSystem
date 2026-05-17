const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
dotenv.config();

const prisma = require('./src/lib/prisma');

// ── Routes ──────────────────────────────────────────────
const customerRoutes = require('./src/routes/customerRoutes');
const carRoutes      = require('./src/routes/carRoutes');
const bookingRoutes  = require('./src/routes/bookingRoutes');
const rentalRoutes   = require('./src/routes/rentalRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Health check ─────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:    'OK',
    message:   'Car Rental API is running',
    timestamp: new Date().toISOString(),
  });
});

// ── API info ─────────────────────────────────────────────
app.get('/api', (_req, res) => {
  res.json({
    message: 'Car Rental Management System API',
    version: '1.0.0',
    endpoints: {
      customers: '/api/customers',
      cars:      '/api/cars',
      bookings:  '/api/bookings',
      rentals:   '/api/rentals',
    },
  });
});

// ── Mount routes ─────────────────────────────────────────
app.use('/api/customers', customerRoutes);
app.use('/api/cars',      carRoutes);
app.use('/api/bookings',  bookingRoutes);
app.use('/api/rentals',   rentalRoutes);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error:   `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Global error handler ──────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err);

  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'Duplicate entry — record already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ success: false, error: 'Foreign key constraint failed' });
  }

  res.status(500).json({
    success: false,
    error:   process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// ── Startup ────────────────────────────────────────────────
async function startServer() {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('✅ Connected to MAMP MySQL database (crms)');

    app.listen(PORT, () => {
      console.log(`🚀 API running at http://localhost:${PORT}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('\n💡 Make sure MAMP is running and MySQL is on port 3306');
    process.exit(1);
  }
}

process.on('SIGINT',  async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

module.exports = { app, prisma };

if (require.main === module) startServer();