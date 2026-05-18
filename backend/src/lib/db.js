// src/lib/db.js — shared mysql2 pool (proven to connect on port 8889)
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT || '8889'),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || 'root',
  database:           process.env.DB_NAME     || 'carrentalmanagement',
  waitForConnections: true,
  connectionLimit:    20,
  queueLimit:         0,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,
});

// Test the pool on startup
pool.getConnection()
  .then(conn => { conn.release(); console.log('✅ mysql2 pool ready'); })
  .catch(err => console.error('❌ mysql2 pool error:', err.message));

module.exports = pool;
