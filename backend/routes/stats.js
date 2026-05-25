const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const patientsRes = await pool.query('SELECT COUNT(*)::int AS count FROM patients');
    const patients = patientsRes.rows[0]?.count || 0;

    // Try to count visits/pending if tables exist; otherwise return 0
    let visits = 0;
    try {
      const v = await pool.query('SELECT COUNT(*)::int AS count FROM visits');
      visits = v.rows[0]?.count || 0;
    } catch (e) {
      visits = 0;
    }

    let pending = 0;
    try {
      const p = await pool.query('SELECT COUNT(*)::int AS count FROM pending_sync');
      pending = p.rows[0]?.count || 0;
    } catch (e) {
      pending = 0;
    }

    // Placeholder clinical counts — to be computed later from real data
    const hypertension = 0;
    const critical = 0;
    const diabetes = 0;
    const controlled = 0;

    return res.json({
      patients,
      visits,
      pending,
      hypertension,
      critical,
      diabetes,
      controlled,
    });
  } catch (err) {
    console.error('Stats error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
