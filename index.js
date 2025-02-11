const express = require('express');
const connectDB = require('./db');
const { PORT } = require('./config');
const login = require('./route/login')
const lab = require('./route/Lab-details')
const register = require('./route/register')
const transferRoute = require('./route/transfer')
const studentProfile = require('./route/student-profile')
const passlogin = require('./route/auth')
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/login',login);
app.use('/api/passlogin',passlogin);
app.use('/api/lab',lab);
app.use('/api/register',register);
app.use('/api/transfer',transferRoute);
app.use('/api/profile',studentProfile);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
