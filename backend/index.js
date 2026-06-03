const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
dotenv.config();

// ── DB pool (mysql2 — no Prisma adapter) ─────────────────────────
const pool = require('./src/lib/db');

// ── Routes ──────────────────────────────────────────────
const authRoutes          = require('./src/routes/authRoutes');
const customerRoutes      = require('./src/routes/customerRoutes');
const carRoutes           = require('./src/routes/carRoutes');
const bookingRoutes       = require('./src/routes/bookingRoutes');
const rentalRoutes        = require('./src/routes/rentalRoutes');
const branchRoutes        = require('./src/routes/branchRoutes');
const categoryRoutes      = require('./src/routes/categoryRoutes');
const fuelPolicyRoutes    = require('./src/routes/fuelPolicyRoutes');
const paymentMethodRoutes = require('./src/routes/paymentMethodRoutes');
const insuranceRoutes     = require('./src/routes/insuranceRoutes');
const driverRoutes        = require('./src/routes/driverRoutes');
const employeeRoutes      = require('./src/routes/employeeRoutes');
const maintenanceRoutes   = require('./src/routes/maintenanceRoutes');
const reviewRoutes        = require('./src/routes/reviewRoutes');
const paymentRoutes       = require('./src/routes/paymentRoutes');

// ── Auth middleware ──────────────────────────────────────
const { requireAuth } = require('./src/middleware/auth');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://sheger.abdurehman.com',
    'https://www.sheger.abdurehman.com',
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
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', message: 'Car Rental API is running', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'ERROR', message: 'Database unreachable' });
  }
});

// ── API info ─────────────────────────────────────────────
app.get('/api', (_req, res) => {
  res.json({
    message: 'Car Rental Management System API',
    version: '1.0.0',
    endpoints: {
      auth:      '/api/auth',
      customers: '/api/customers',
      cars:      '/api/cars',
      bookings:  '/api/bookings',
      rentals:   '/api/rentals',
    },
  });
});

// ── Mount routes ─────────────────────────────────────────
app.use('/api/auth',            authRoutes);
app.use('/api/customers',       requireAuth, customerRoutes);
app.use('/api/cars',            requireAuth, carRoutes);
app.use('/api/bookings',        requireAuth, bookingRoutes);
app.use('/api/rentals',         requireAuth, rentalRoutes);
app.use('/api/branches',        requireAuth, branchRoutes);
app.use('/api/categories',      requireAuth, categoryRoutes);
app.use('/api/fuel-policies',   requireAuth, fuelPolicyRoutes);
app.use('/api/payment-methods', requireAuth, paymentMethodRoutes);
app.use('/api/insurances',      requireAuth, insuranceRoutes);
app.use('/api/drivers',         requireAuth, driverRoutes);
app.use('/api/employees',       requireAuth, employeeRoutes);
app.use('/api/maintenance',     requireAuth, maintenanceRoutes);
app.use('/api/reviews',         requireAuth, reviewRoutes);
app.use('/api/payments',        requireAuth, paymentRoutes);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Global error handler ──────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err);
  require('fs').appendFileSync(require('path').join(__dirname, 'error.log'), `[${new Date().toISOString()}] Global Error: ${err.stack || err}\n`);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// ── Startup ────────────────────────────────────────────────
async function startServer() {
  try {
    // Verify DB connection
    await pool.query('SELECT 1');
    console.log('✅ Connected to MySQL database (carrentalmanagement)');

    // Seed super admin
    const { seedSuperAdmin } = require('./src/controllers/authController');
    await seedSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 API running at http://localhost:${PORT}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('\n💡 Make sure MAMP is running and MySQL is on port 8889');
    process.exit(1);
  }
}

process.on('SIGINT',  async () => { await pool.end(); process.exit(0); });
process.on('SIGTERM', async () => { await pool.end(); process.exit(0); });

module.exports = { app, pool };

if (require.main === module) startServer();