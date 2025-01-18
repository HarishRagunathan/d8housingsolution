const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, role, phone } = req.body;
  try {
    const newUser = await User.create({ username, password, role, phone });
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: 'User registration failed' });
  }
});

router.get('/searchuser/:id', async (req, res) => {
    const user_Id = req.params.id; // Get user ID from URL parameters
    try {
      // Find the user by ID and exclude the password field
      const user = await User.findById(user_Id).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Server error while fetching user' });
    }
  });

  router.get('/workers', async (req, res) => {
    try {
      // Find all users with role 'worker' and exclude the password field
      const workers = await User.find({ role: 'worker' }).select('-password');
      
      if (!workers || workers.length === 0) {
        return res.status(404).json({ error: 'No workers found' });
      }
  
      res.status(200).json({ workers });
    } catch (error) {
      console.error('Error fetching workers:', error);
      res.status(500).json({ error: 'Server error while fetching workers' });
    }
  });
  
  

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const userData= await User.findOne({ username }).select('-password');

    res.status(200).json({ message: 'Login successful', token,userData });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
