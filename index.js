require('dotenv').config();
require('./database');

const express = require('express');
const app = express();
const path = require('path');

const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const pool = require('./db');

pool.query('SELECT NOW()')
  .then(res => console.log('DB connected:', res.rows[0]))
  .catch(err => console.error('DB connection error:', err.message));
  

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));