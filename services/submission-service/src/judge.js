const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function judge(sourceCode, inputPath, expectedOutputPath, timeLimit) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-'));
  const srcFile = path.join(tmpDir, 'solution.c');
  const binFile = path.join(tmpDir, 'solution');

  try {
    // Write source code
    fs.writeFileSync(srcFile, sourceCode);

    // Compile
    const compile = spawnSync('gcc', [srcFile, '-o', binFile, '-lm'], {
      timeout: 10000,
    });

    if (compile.status !== 0) {
      return {
        verdict: 'Compilation Error',
        error: compile.stderr.toString(),
        executionTime: 0,
      };
    }

    // Read input
    const input = fs.existsSync(inputPath) ? fs.readFileSync(inputPath, 'utf8') : '';
    const expectedOutput = fs.readFileSync(expectedOutputPath, 'utf8').trim();

    // Run
    const startTime = Date.now();
    const run = spawnSync(binFile, [], {
      input,
      timeout: timeLimit * 1000,
      maxBuffer: 1024 * 1024,
    });
    const executionTime = (Date.now() - startTime) / 1000;

    if (run.signal === 'SIGTERM') {
      return { verdict: 'Time Limit Exceeded', executionTime };
    }

    if (run.status !== 0) {
      return {
        verdict: 'Runtime Error',
        error: run.stderr.toString(),
        executionTime,
      };
    }

    const actualOutput = run.stdout.toString().trim();

    if (actualOutput === expectedOutput) {
      return { verdict: 'Accepted', executionTime };
    } else {
      return { verdict: 'Wrong Answer', executionTime };
    }

  } finally {
    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

module.exports = { judge };
