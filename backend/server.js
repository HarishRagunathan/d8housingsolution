require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const workRequestRoutes = require('./routes/workRequestRoutes');

const app = express();
const PORT = process.env.PORT;

// Middleware

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/works', workRequestRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed', err));

// Start the server
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
