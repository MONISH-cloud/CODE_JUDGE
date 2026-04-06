const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all problems
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, difficulty, topic, time_limit, memory_limit, created_at FROM problems ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single problem by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM problems WHERE id = $1', [id]
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

// POST create problem
router.post('/', async (req, res) => {
  try {
    const { title, description, difficulty, topic, time_limit, memory_limit } = req.body;
    const result = await pool.query(
      'INSERT INTO problems (title, description, difficulty, topic, time_limit, memory_limit) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, difficulty, topic, time_limit || 2, memory_limit || 256]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update problem
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, topic, time_limit, memory_limit } = req.body;
    const result = await pool.query(
      'UPDATE problems SET title=$1, description=$2, difficulty=$3, topic=$4, time_limit=$5, memory_limit=$6 WHERE id=$7 RETURNING *',
      [title, description, difficulty, topic, time_limit, memory_limit, id]
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

// DELETE problem
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM problems WHERE id = $1 RETURNING *', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// GET sample test case (first non-hidden one) for a problem
router.get('/:id/sample', async (req, res) => {
  try {
    const fs = require('fs');
    const tc = await require('../db').query(
      'SELECT * FROM test_cases WHERE problem_id = $1 AND is_hidden = false LIMIT 1',
      [req.params.id]
    );
    if (tc.rows.length === 0) return res.json({ input: '', output: '' });
    const input = fs.existsSync(tc.rows[0].input_path) ? fs.readFileSync(tc.rows[0].input_path, 'utf8') : '';
    const output = fs.existsSync(tc.rows[0].output_path) ? fs.readFileSync(tc.rows[0].output_path, 'utf8') : '';
    res.json({ input, output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
