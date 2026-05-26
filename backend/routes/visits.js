const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

let visitsTableReady = false;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function ensureVisitsTable() {
  if (visitsTableReady) return;

  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID NOT NULL,
      scheduled_time TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending',
      risk_level TEXT NOT NULL DEFAULT 'Unknown',
      visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
      notes TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  visitsTableReady = true;
}

// GET /visits — today's visits with patient names
router.get('/', requireAuth, async (_req, res) => {
  try {
    await ensureVisitsTable();

    const { rows } = await pool.query(`
      SELECT
        v.id,
        v.patient_id,
        p.full_name AS patient_name,
        v.scheduled_time,
        v.status,
        v.risk_level,
        v.visit_date
      FROM visits v
      LEFT JOIN patients p ON p.id = v.patient_id
      WHERE v.visit_date = CURRENT_DATE
      ORDER BY v.scheduled_time ASC, v.created_at ASC
    `);

    return res.json(rows);
  } catch (err) {
    console.error('List visits error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /visits — schedule a new visit
router.post('/', requireAuth, async (req, res) => {
  const { patient_id, scheduled_time, risk_level } = req.body || {};

  if (!patient_id) {
    return res.status(400).json({ error: 'patient_id is required' });
  }

  if (!UUID_REGEX.test(patient_id)) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  try {
    await ensureVisitsTable();

    const { rows } = await pool.query(
      `INSERT INTO visits (patient_id, scheduled_time, risk_level)
       VALUES ($1, $2, $3)
       RETURNING id, patient_id, scheduled_time, status, risk_level, visit_date`,
      [patient_id, scheduled_time || '', risk_level || 'Unknown']
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create visit error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /visits/:id/status — update visit status
router.patch('/:id/status', requireAuth, async (req, res) => {
  if (!UUID_REGEX.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid visit ID' });
  }

  const { status } = req.body || {};
  const VALID_STATUSES = ['Pending', 'Processing', 'Completed'];

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await ensureVisitsTable();

    const { rows } = await pool.query(
      `UPDATE visits SET status = $1 WHERE id = $2 RETURNING id, status`,
      [status, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Update visit status error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;