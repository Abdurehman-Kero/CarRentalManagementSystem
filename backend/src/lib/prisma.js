// src/lib/prisma.js — shared Prisma client using MariaDB adapter for MAMP MySQL
const { PrismaClient }  = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql             = require('mysql2/promise');

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || 'root',
  database:           process.env.DB_NAME     || 'crms',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

const adapter = new PrismaMariaDb(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development'
    ? ['warn', 'error']
    : ['error'],
});

module.exports = prisma;
