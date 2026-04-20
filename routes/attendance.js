const express = require('express');
const router = express.Router();
const pool = require('../db'); // use pg Pool


// GET attendance (last 7 days optional improvement below)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id AS student_id, 
	  s.name, 
	  a.date::text AS date, 
	  a.status
      FROM students s
      LEFT JOIN attendance a 
      ON s.id = a.student_id
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});


// UPDATE attendance (UPSERT)
router.post('/', async (req, res) => {
  const { student_id, date, status } = req.body;

  try {
    await pool.query(
      `INSERT INTO attendance (student_id, date, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, date)
       DO UPDATE SET status = EXCLUDED.status`,
      [student_id, date, status]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;