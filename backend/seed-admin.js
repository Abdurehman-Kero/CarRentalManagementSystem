/**
 * seed-admin.js
 * Run with: node seed-admin.js
 * Creates the super admin account directly via mysql2 (bypasses Prisma adapter timing issues).
 */
require('dotenv').config();
const mysql   = require('mysql2/promise');
const bcrypt  = require('bcryptjs');

const SUPER_ADMIN = {
  FullName: 'Super Admin',
  Email:    'keroabdurehman@gmail.com',
  Password: 'nexus@0974',
  Role:     'superadmin',
};

async function seed() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '8889'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME     || 'carrentalmanagement',
  });

  try {
    console.log('🔌 Connected to MySQL');

    // Ensure Admin table exists
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`Admin\` (
        \`AdminID\`   INT NOT NULL AUTO_INCREMENT,
        \`FullName\`  VARCHAR(150) NOT NULL,
        \`Email\`     VARCHAR(150) NOT NULL,
        \`Password\`  VARCHAR(255) NOT NULL,
        \`Role\`      VARCHAR(50)  NOT NULL DEFAULT 'admin',
        \`CreatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`AdminID\`),
        UNIQUE KEY \`Admin_Email_key\` (\`Email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ Admin table ready');

    // Check if super admin already exists
    const [rows] = await conn.query(
      'SELECT AdminID FROM `Admin` WHERE Email = ?',
      [SUPER_ADMIN.Email]
    );

    if (rows.length > 0) {
      console.log(`ℹ️  Super admin already exists (${SUPER_ADMIN.Email}). Updating password…`);
      const hashed = await bcrypt.hash(SUPER_ADMIN.Password, 12);
      await conn.query(
        'UPDATE `Admin` SET Password = ?, Role = ?, FullName = ? WHERE Email = ?',
        [hashed, SUPER_ADMIN.Role, SUPER_ADMIN.FullName, SUPER_ADMIN.Email]
      );
      console.log('✅ Super admin password updated!');
    } else {
      const hashed = await bcrypt.hash(SUPER_ADMIN.Password, 12);
      await conn.query(
        'INSERT INTO `Admin` (FullName, Email, Password, Role) VALUES (?, ?, ?, ?)',
        [SUPER_ADMIN.FullName, SUPER_ADMIN.Email, hashed, SUPER_ADMIN.Role]
      );
      console.log(`✅ Super admin created: ${SUPER_ADMIN.Email} / ${SUPER_ADMIN.Password}`);
    }
  } finally {
    await conn.end();
    console.log('🔌 Connection closed');
  }
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
