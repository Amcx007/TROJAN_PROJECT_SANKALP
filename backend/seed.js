require('dotenv').config({ path: __dirname + '/.env' });
const pool = require('./db');
const bcrypt = require('bcrypt');

async function run() {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT`);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON users (username)`);

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
    console.log('Patients table ready');

    const username = process.env.SEED_USERNAME || 'admin';
    const email = process.env.SEED_EMAIL || 'admin@example.com';
    const password = process.env.SEED_PASSWORD || 'password123';

    const { rows } = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1',
      [username, email]
    );

    const hash = await bcrypt.hash(password, 10);
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
        [username, email, hash]
      );
      console.log('Seeded user', username);
    } else {
      await pool.query(
        'UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE id = $4',
        [username, email, hash, rows[0].id]
      );
      console.log('Updated seed user', username);
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

run();
