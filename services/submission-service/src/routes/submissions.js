const express = require('express');
const router = express.Router();
const pool = require('../db');
const { judge } = require('../judge');
const path = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');

// POST run code (returns actual output, no DB save)
router.post('/run', async (req, res) => {
  const { source_code, input } = req.body;
  if (!source_code) return res.status(400).json({ message: 'source_code required' });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'run-'));
  const srcFile = path.join(tmpDir, 'solution.c');
  const binFile = path.join(tmpDir, 'solution');

  try {
    fs.writeFileSync(srcFile, source_code);
    const compile = spawnSync('gcc', [srcFile, '-o', binFile, '-lm'], { timeout: 10000 });
    if (compile.status !== 0) {
      return res.json({ success: false, error: compile.stderr.toString(), output: null });
    }
    const run = spawnSync(binFile, [], {
      input: input || '',
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    });
    if (run.signal === 'SIGTERM') {
      return res.json({ success: false, error: 'Time Limit Exceeded', output: null });
    }
    if (run.status !== 0) {
      return res.json({ success: false, error: run.stderr.toString(), output: null });
    }
    return res.json({ success: true, output: run.stdout.toString(), error: null });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// POST submit code
router.post('/', async (req, res) => {
  const { user_id, problem_id, source_code, language } = req.body;
  if (!user_id || !problem_id || !source_code) {
    return res.status(400).json({ message: 'user_id, problem_id and source_code are required' });
  }
  try {
    const problemResult = await pool.query('SELECT * FROM problems WHERE id = $1', [problem_id]);
    if (problemResult.rows.length === 0) return res.status(404).json({ message: 'Problem not found' });
    const problem = problemResult.rows[0];

    const testCasesResult = await pool.query('SELECT * FROM test_cases WHERE problem_id = $1', [problem_id]);
    if (testCasesResult.rows.length === 0) return res.status(400).json({ message: 'No test cases found' });

    let finalVerdict = 'Accepted';
    let totalTime = 0;
    let errorLog = null;

    for (const testCase of testCasesResult.rows) {
      const result = judge(source_code, testCase.input_path, testCase.output_path, problem.time_limit);
      totalTime = Math.max(totalTime, result.executionTime || 0);
      if (result.verdict !== 'Accepted') {
        finalVerdict = result.verdict;
        errorLog = result.error || null;
        break;
      }
    }

    const submission = await pool.query(
      `INSERT INTO submissions (user_id, problem_id, source_code, language, verdict, execution_time, error_log)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, problem_id, source_code, language || 'c', finalVerdict, totalTime, errorLog]
    );
    res.status(201).json(submission.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET submissions by user
router.get('/user/:user_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.title as problem_title FROM submissions s
       JOIN problems p ON s.problem_id = p.id
       WHERE s.user_id = $1 ORDER BY s.created_at DESC`,
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET submissions by problem
router.get('/problem/:problem_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as user_name FROM submissions s
       JOIN users u ON s.user_id = u.id
       WHERE s.problem_id = $1 ORDER BY s.created_at DESC`,
      [req.params.problem_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
