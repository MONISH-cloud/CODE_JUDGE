const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Multer setup for test case uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/testcases/${req.params.id}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET all problems
router.get('/', verifyToken, async (req, res) => {
  try {
    const { difficulty, topic } = req.query;
    let query = 'SELECT id, title, difficulty, topic, time_limit, memory_limit FROM problems';
    const params = [];
    const conditions = [];

    if (difficulty) {
      params.push(difficulty);
      conditions.push(`difficulty = $${params.length}`);
    }
    if (topic) {
      params.push(topic);
      conditions.push(`topic = $${params.length}`);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single problem
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM problems WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create problem (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, difficulty, topic, time_limit, memory_limit } = req.body;
    const result = await pool.query(
      `INSERT INTO problems (title, description, difficulty, topic, time_limit, memory_limit)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, difficulty, topic, time_limit || 2, memory_limit || 256]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST upload test cases (admin only)
router.post('/:id/testcases', verifyToken, verifyAdmin,
  upload.fields([{ name: 'input' }, { name: 'output' }]),
  async (req, res) => {
    try {
      const inputFile = req.files['input'][0].path;
      const outputFile = req.files['output'][0].path;

      await pool.query(
        `INSERT INTO test_cases (problem_id, input_path, output_path, is_hidden)
         VALUES ($1, $2, $3, $4)`,
        [req.params.id, inputFile, outputFile, true]
      );

      res.status(201).json({ message: 'Test case uploaded successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;