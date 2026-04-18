const express = require('express');
const app = express();
const path = require('path');

const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));