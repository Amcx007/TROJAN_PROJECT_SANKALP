const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { name, address, dob, mobile } = req.body || {};

  if (!name || !address || !dob || !mobile) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO patients (full_name, address, dob, mobile)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, address, dob, mobile, created_at`,
      [name, address, dob, mobile]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create patient error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;