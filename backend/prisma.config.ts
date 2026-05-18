import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT || '8889'),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || 'root',
  database:           process.env.DB_NAME     || 'carrentalmanagement',
  waitForConnections: true,
  connectionLimit:    10,
});

const adapter = new PrismaMariaDb(pool);

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    adapter,
    url: `mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || 'root'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '8889'}/${process.env.DB_NAME || 'carrentalmanagement'}`,
  },
});
