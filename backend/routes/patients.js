const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

let patientsTableReady = false;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function ensurePatientsTable() {
  if (patientsTableReady) {
    return;
  }

  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '',
      dob TEXT NOT NULL,
      mobile TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS address TEXT DEFAULT ''`);
  await pool.query(`ALTER TABLE patients ALTER COLUMN address SET DEFAULT ''`);
  await pool.query(`UPDATE patients SET address = '' WHERE address IS NULL`);

  patientsTableReady = true;
}

router.get('/', requireAuth, async (_req, res) => {
  try {
    await ensurePatientsTable();

    const { rows } = await pool.query(
      `SELECT id, full_name, address, dob, mobile, created_at
       FROM patients
       ORDER BY created_at DESC`
    );

    return res.json(rows);
  } catch (err) {
    console.error('List patients error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  if (!UUID_REGEX.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid patient ID — please scan a valid QR code' });
  }

  try {
    await ensurePatientsTable();

    const { rows } = await pool.query(
      `SELECT id, full_name, address, dob, mobile, created_at
       FROM patients
       WHERE id = $1
       LIMIT 1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Get patient error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { name, address, dob, mobile } = req.body || {};
  const normalizedAddress = typeof address === 'string' ? address.trim() : '';

  if (!name || !dob || !mobile) {
    return res.status(400).json({ error: 'Name, date of birth, and mobile are required' });
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' });
  }

  try {
    await ensurePatientsTable();

    const { rows } = await pool.query(
      `INSERT INTO patients (full_name, address, dob, mobile)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, address, dob, mobile, created_at`,
      [name, normalizedAddress, dob, mobile]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create patient error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;