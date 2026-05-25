require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcrypt');

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const email = process.env.SEED_EMAIL || 'admin@example.com';
    const password = process.env.SEED_PASSWORD || 'password123';

    const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hash]);
      console.log('Seeded user', email);
    } else {
      console.log('User already exists', email);
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

run();
