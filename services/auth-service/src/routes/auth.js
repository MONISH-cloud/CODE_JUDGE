const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role || 'student']
    );

    // Issue JWT
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      role: user.rows[0].role
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// Update name
router.put('/update', async (req, res) => {
  try {
    const { user_id, name } = req.body
    if (!name || !user_id) return res.status(400).json({ message: 'user_id and name required' })
    const result = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, role',
      [name, user_id]
    )
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.role,
        COUNT(DISTINCT CASE WHEN s.verdict = 'Accepted' THEN s.problem_id END) as problems_solved,
        COUNT(s.id) as total_submissions,
        COUNT(CASE WHEN s.verdict = 'Accepted' THEN 1 END) as total_accepted
      FROM users u
      LEFT JOIN submissions s ON u.id = s.user_id
      WHERE u.role = 'student'
      GROUP BY u.id, u.name, u.role
      ORDER BY problems_solved DESC, total_submissions ASC
      LIMIT 10
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})
