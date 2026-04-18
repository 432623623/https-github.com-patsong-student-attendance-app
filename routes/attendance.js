const express = require('express');
const router = express.Router();
const db = require('../database');

//GET attendance for last 7 days
router.get('/',(req,res)=>{
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
router.post('/',(req,res)=>{
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