import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:             'localhost',
  port:             3306,
  user:             'root',
  password:         'root',
  database:         'crms',
  waitForConnections: true,
  connectionLimit:  10,
});

const adapter = new PrismaMariaDb(pool);

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    adapter,
  },
});
