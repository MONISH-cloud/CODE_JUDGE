const express = require('express');
const router = express.Router();
const pool = require('../db');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const tcDir = '/Users/a91959/Downloads/ased project/seed/testcases';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tcDir),
  filename: (req, file, cb) => {
    const ext = file.originalname.endsWith('.in') ? '.in' : '.out';
    cb(null, `upload_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// GET all problems (admin)
router.get('/problems', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, COUNT(t.id) as testcase_count 
       FROM problems p 
       LEFT JOIN test_cases t ON p.id = t.problem_id 
       GROUP BY p.id ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create problem
router.post('/problems', async (req, res) => {
  try {
    const { title, description, difficulty, topic, time_limit, memory_limit } = req.body;
    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: 'title, description, difficulty required' });
    }
    const result = await pool.query(
      `INSERT INTO problems (title, description, difficulty, topic, time_limit, memory_limit)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, difficulty, topic || null, time_limit || 2, memory_limit || 256]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE problem
router.delete('/problems/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM test_cases WHERE problem_id = $1', [req.params.id]);
    await pool.query('DELETE FROM submissions WHERE problem_id = $1', [req.params.id]);
    await pool.query('DELETE FROM problems WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET test cases for a problem
router.get('/problems/:id/testcases', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM test_cases WHERE problem_id = $1 ORDER BY id',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add test case (file upload)
router.post('/problems/:id/testcases', upload.fields([
  { name: 'input', maxCount: 1 },
  { name: 'output', maxCount: 1 }
]), async (req, res) => {
  try {
    const { is_hidden } = req.body;
    const problemId = req.params.id;

    if (!req.files?.input || !req.files?.output) {
      return res.status(400).json({ message: 'Both input and output files required' });
    }

    const inputPath = req.files.input[0].path;
    const outputPath = req.files.output[0].path;

    // Rename to proper format
    const tcCount = await pool.query('SELECT COUNT(*) FROM test_cases WHERE problem_id = $1', [problemId]);
    const idx = parseInt(tcCount.rows[0].count) + 1;
    const newInput = path.join(tcDir, `p${problemId}_tc${idx}.in`);
    const newOutput = path.join(tcDir, `p${problemId}_tc${idx}.out`);
    fs.renameSync(inputPath, newInput);
    fs.renameSync(outputPath, newOutput);

    const result = await pool.query(
      `INSERT INTO test_cases (problem_id, input_path, output_path, is_hidden)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [problemId, newInput, newOutput, is_hidden === 'true']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE test case
router.delete('/testcases/:id', async (req, res) => {
  try {
    const tc = await pool.query('SELECT * FROM test_cases WHERE id = $1', [req.params.id]);
    if (tc.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    try { fs.unlinkSync(tc.rows[0].input_path); } catch {}
    try { fs.unlinkSync(tc.rows[0].output_path); } catch {}
    await pool.query('DELETE FROM test_cases WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, total_points, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
