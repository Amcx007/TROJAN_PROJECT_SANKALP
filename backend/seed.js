require('dotenv').config({ path: __dirname + '/.env' });
const pool = require('./db');

// The `users` table is now owned by the admin panel's Prisma migrations.
// This seed only ensures the Express-owned tables exist.

async function run() {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        address TEXT NOT NULL,
        dob TEXT NOT NULL,
        mobile TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('patients table ready');

    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

run();