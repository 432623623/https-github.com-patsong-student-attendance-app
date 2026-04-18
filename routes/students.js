const express = require('express');
const router = express.Router();
const db = require('../database');

// Create student
router.post('/', (req, res) => {
  const { name, birthday, subject, grade } = req.body;
  const sql = 'INSERT INTO students (name, birthday, subject, grade) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, birthday, subject, grade], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, birthday, subject, grade });
  });
});

// Read all students
router.get('/', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Read one student
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

// Update student
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, birthday, subject, grade } = req.body;
  const sql = 'UPDATE students SET name = ?, birthday = ?, subject = ?, grade = ? WHERE id = ?';
  db.run(sql, [name, birthday, subject, grade, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updatedID: id, name, birthday, subject, grade });
  });
});

// Delete student
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM students WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletedID: id });
  });
});

//GET attendance for last 7 days
router.get('/attendance',(req,res)=>{
	const query = `
		SELECT s.id as student_id, s.name, a.date, a.status
		FROM students s
		LEFT JOIN attendance a 
		ON s.id = a.student_id
		ORDER BY s.id, a.date
	`;
	db.all(query,[],(err, rows)=>{
		if (err) return res.status(500).json(err);
		res.json(rows);
	});
});


//UPDATE attendance
router.post('/attendance',(req,res)=>{
	const { student_id, date, status } = req.body;
	
	db.run(
		`INSERT INTO attendance (student_id, date, status)
		VALUES (?,?,?)
		ON CONFLICT (student_id, date)
		DO UPDATE SET status = excluded.status`,
		[student_id, date, status],
		function (err){
			if (err) return res.status(500).json(err);
			res.json({success: true});
		}
	);
});

module.exports = router;