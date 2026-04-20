const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create student
router.post('/', async (req, res) => {
  const { name, birthday, subject, grade } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO students (name, birthday, subject, grade)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, birthday, subject, grade]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
	  if (err.code === '23505') {
		return res.status(400).json({ error: 'Student already exists' });
	  }
	  res.status(500).json({ error: err.message });
	}
});


// Read all students
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Read one student
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update student
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, birthday, subject, grade } = req.body;

  try {
    const result = await pool.query(
      `UPDATE students
       SET name = $1, birthday = $2, subject = $3, grade = $4
       WHERE id = $5
       RETURNING *`,
      [name, birthday, subject, grade, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete student
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    res.json({ deletedID: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET attendance
router.get('/attendance', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id AS student_id, s.name, a.date, a.status
      FROM students s
      LEFT JOIN attendance a
      ON s.id = a.student_id
      ORDER BY s.id, a.date
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});


// UPDATE attendance (UPSERT)
router.post('/attendance', async (req, res) => {
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