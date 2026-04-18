const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(()=>{
	db.run(`CREATE TABLE IF NOT EXISTS students(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		birthday TEXT,
		subject TEXT,
		grade TEXT
	)`);	
	db.run(`CREATE TABLE IF NOT EXISTS attendance(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		student_id INTEGER,
		date TEXT,
		status TEXT,
		UNIQUE(student_id, date),
		FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
	)`);
	db.run("PRAGMA foreign_keys = ON");
});

module.exports = db;