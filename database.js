const pool = require('./db');

async function createTables(){

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      birthday DATE,
      subject TEXT,
      grade TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      status TEXT,
      UNIQUE (student_id, date)
    );	
  `);

  console.log('Tables ready');
}

createTables().catch(err => {
  console.error('Table creation failed:', err.message);
});