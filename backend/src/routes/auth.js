const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Add JWT_SECRET to backend environment variables in docker-compose.yml
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, mobileNumber } = req.body;
    
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user
    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, mobile_number)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, mobile_number`,
      [email, passwordHash, firstName, lastName, mobileNumber]
    );

    res.status(201).json({
      message: 'Registration successful',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        firstName: user.first_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
