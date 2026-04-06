const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  host: 'localhost', port: 5432,
  database: 'codejudge', user: 'postgres', password: 'postgres',
})

const problems = [
  {
    title: 'Swap Two Numbers',
    description: 'Given two integers A and B, print their values after swapping.\n\nInput: Two integers A and B.\nOutput: Print B then A on the same line.',
    difficulty: 'easy', topic: 'Basics',
    testcases: [
      { input: '3 7\n', output: '7 3\n' },
      { input: '10 20\n', output: '20 10\n' },
      { input: '0 5\n', output: '5 0\n' },
    ]
  },
  {
    title: 'Absolute Value',
    description: 'Given an integer N, print its absolute value.\n\nInput: A single integer N.\nOutput: Print |N|.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '-5\n', output: '5\n' },
      { input: '7\n', output: '7\n' },
      { input: '0\n', output: '0\n' },
    ]
  },
  {
    title: 'Celsius to Fahrenheit',
    description: 'Convert Celsius to Fahrenheit. Formula: F = (C * 9/5) + 32.\n\nInput: A single integer C.\nOutput: Print the Fahrenheit value as integer.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '0\n', output: '32\n' },
      { input: '100\n', output: '212\n' },
      { input: '37\n', output: '98\n' },
    ]
  },
  {
    title: 'Count Digits',
    description: 'Given a positive integer N, print the number of digits in it.\n\nInput: A single positive integer N.\nOutput: Print the count of digits.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '12345\n', output: '5\n' },
      { input: '7\n', output: '1\n' },
      { input: '1000\n', output: '4\n' },
    ]
  },
  {
    title: 'LCM of Two Numbers',
    description: 'Given two integers A and B, print their LCM.\n\nInput: Two integers A and B.\nOutput: Print LCM(A, B).',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '4 6\n', output: '12\n' },
      { input: '3 7\n', output: '21\n' },
      { input: '12 18\n', output: '36\n' },
    ]
  },
  {
    title: 'Perfect Number',
    description: 'A perfect number equals the sum of its proper divisors. Given N, print "YES" or "NO".\n\nInput: A single integer N.\nOutput: Print YES or NO.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '6\n', output: 'YES\n' },
      { input: '28\n', output: 'YES\n' },
      { input: '10\n', output: 'NO\n' },
    ]
  },
  {
    title: 'Print Multiplication Table',
    description: 'Given N and K, print the first K multiples of N.\n\nInput: Two integers N and K.\nOutput: K lines, each containing N*i for i from 1 to K.',
    difficulty: 'easy', topic: 'Basics',
    testcases: [
      { input: '3 4\n', output: '3\n6\n9\n12\n' },
      { input: '5 3\n', output: '5\n10\n15\n' },
      { input: '1 5\n', output: '1\n2\n3\n4\n5\n' },
    ]
  },
  {
    title: 'Average of Array',
    description: 'Given N integers, print their average rounded down to nearest integer.\n\nInput: First line N, second line N integers.\nOutput: Print the floor of average.',
    difficulty: 'easy', topic: 'Arrays',
    testcases: [
      { input: '4\n1 2 3 4\n', output: '2\n' },
      { input: '3\n10 20 30\n', output: '20\n' },
      { input: '2\n7 8\n', output: '7\n' },
    ]
  },
  {
    title: 'Remove Duplicates',
    description: 'Given N integers, print only the unique elements in their first order of appearance.\n\nInput: First line N, second line N integers.\nOutput: Print unique elements space-separated.',
    difficulty: 'medium', topic: 'Arrays',
    testcases: [
      { input: '6\n1 2 3 2 1 4\n', output: '1 2 3 4\n' },
      { input: '4\n5 5 5 5\n', output: '5\n' },
      { input: '3\n1 2 3\n', output: '1 2 3\n' },
    ]
  },
  {
    title: 'Two Sum',
    description: 'Given an array of N integers and a target T, print the indices (0-based) of the two numbers that add up to T. Guaranteed exactly one solution exists.\n\nInput: First line N and T, second line N integers.\nOutput: Print two indices separated by space.',
    difficulty: 'medium', topic: 'Arrays',
    testcases: [
      { input: '4 9\n2 7 11 15\n', output: '0 1\n' },
      { input: '3 6\n3 2 4\n', output: '1 2\n' },
      { input: '2 6\n3 3\n', output: '0 1\n' },
    ]
  },
  {
    title: 'Largest Subarray Sum',
    description: 'Given an array of N integers (may include negatives), find the maximum subarray sum (Kadane\'s algorithm).\n\nInput: First line N, second line N integers.\nOutput: Print the maximum subarray sum.',
    difficulty: 'medium', topic: 'Arrays',
    testcases: [
      { input: '8\n-2 1 -3 4 -1 2 1 -5\n', output: '6\n' },
      { input: '1\n-1\n', output: '-1\n' },
      { input: '5\n1 2 3 4 5\n', output: '15\n' },
    ]
  },
  {
    title: 'Check Sorted Array',
    description: 'Given an array of N integers, print "YES" if it is sorted in non-decreasing order, otherwise "NO".\n\nInput: First line N, second line N integers.\nOutput: Print YES or NO.',
    difficulty: 'easy', topic: 'Arrays',
    testcases: [
      { input: '4\n1 2 3 4\n', output: 'YES\n' },
      { input: '3\n3 1 2\n', output: 'NO\n' },
      { input: '3\n1 1 2\n', output: 'YES\n' },
    ]
  },
  {
    title: 'Merge Two Sorted Arrays',
    description: 'Given two sorted arrays of size M and N, merge and print the result in sorted order.\n\nInput: First line M and N, second line M integers, third line N integers.\nOutput: Print merged sorted array.',
    difficulty: 'medium', topic: 'Arrays',
    testcases: [
      { input: '3 3\n1 3 5\n2 4 6\n', output: '1 2 3 4 5 6\n' },
      { input: '2 1\n1 3\n2\n', output: '1 2 3\n' },
      { input: '1 1\n5\n1\n', output: '1 5\n' },
    ]
  },
  {
    title: 'Count Consonants',
    description: 'Given a string, print the number of consonants (non-vowel alphabetic characters, case insensitive).\n\nInput: A single string.\nOutput: Print the count.',
    difficulty: 'easy', topic: 'Strings',
    testcases: [
      { input: 'hello\n', output: '3\n' },
      { input: 'aeiou\n', output: '0\n' },
      { input: 'rhythm\n', output: '6\n' },
    ]
  },
  {
    title: 'String Uppercase',
    description: 'Given a string, print it in uppercase.\n\nInput: A single string.\nOutput: Print the uppercase version.',
    difficulty: 'easy', topic: 'Strings',
    testcases: [
      { input: 'hello\n', output: 'HELLO\n' },
      { input: 'World\n', output: 'WORLD\n' },
      { input: 'abc123\n', output: 'ABC123\n' },
    ]
  },
  {
    title: 'Count Words',
    description: 'Given a sentence, print the number of words (words are separated by single spaces).\n\nInput: A single line of text.\nOutput: Print the word count.',
    difficulty: 'easy', topic: 'Strings',
    testcases: [
      { input: 'hello world\n', output: '2\n' },
      { input: 'one two three four\n', output: '4\n' },
      { input: 'single\n', output: '1\n' },
    ]
  },
  {
    title: 'Insertion Sort',
    description: 'Given an array of N integers, sort them using insertion sort and print the result.\n\nInput: First line N, second line N integers.\nOutput: Print sorted array space-separated.',
    difficulty: 'medium', topic: 'Sorting',
    testcases: [
      { input: '5\n5 3 1 4 2\n', output: '1 2 3 4 5\n' },
      { input: '3\n3 1 2\n', output: '1 2 3\n' },
      { input: '1\n7\n', output: '7\n' },
    ]
  },
  {
    title: 'Selection Sort',
    description: 'Given an array of N integers, sort them using selection sort and print the result.\n\nInput: First line N, second line N integers.\nOutput: Print sorted array space-separated.',
    difficulty: 'medium', topic: 'Sorting',
    testcases: [
      { input: '5\n64 25 12 22 11\n', output: '11 12 22 25 64\n' },
      { input: '3\n3 1 2\n', output: '1 2 3\n' },
      { input: '1\n9\n', output: '9\n' },
    ]
  },
  {
    title: 'Recursive Sum',
    description: 'Given N, compute sum of 1 to N using recursion and print the result.\n\nInput: A single integer N (1 <= N <= 1000).\nOutput: Print the sum.',
    difficulty: 'easy', topic: 'Recursion',
    testcases: [
      { input: '5\n', output: '15\n' },
      { input: '1\n', output: '1\n' },
      { input: '10\n', output: '55\n' },
    ]
  },
  {
    title: 'Power Using Recursion',
    description: 'Given base B and exponent E, compute B^E using recursion.\n\nInput: Two integers B and E (0 <= E <= 20).\nOutput: Print B^E.',
    difficulty: 'medium', topic: 'Recursion',
    testcases: [
      { input: '2 10\n', output: '1024\n' },
      { input: '3 3\n', output: '27\n' },
      { input: '5 0\n', output: '1\n' },
    ]
  },
]

async function seed() {
  console.log('Seeding 20 more problems...')
  const tcDir = path.join(__dirname, 'testcases')

  for (const p of problems) {
    const res = await pool.query(
      `INSERT INTO problems (title, description, difficulty, topic, time_limit, memory_limit)
       VALUES ($1, $2, $3, $4, 2, 256) RETURNING id`,
      [p.title, p.description, p.difficulty, p.topic]
    )
    const problemId = res.rows[0].id
    console.log(`✓ Problem: ${p.title} (id=${problemId})`)

    for (let i = 0; i < p.testcases.length; i++) {
      const tc = p.testcases[i]
      const inputPath = path.join(tcDir, `p${problemId}_tc${i+1}.in`)
      const outputPath = path.join(tcDir, `p${problemId}_tc${i+1}.out`)
      fs.writeFileSync(inputPath, tc.input)
      fs.writeFileSync(outputPath, tc.output)
      await pool.query(
        `INSERT INTO test_cases (problem_id, input_path, output_path, is_hidden)
         VALUES ($1, $2, $3, $4)`,
        [problemId, inputPath, outputPath, i > 0]
      )
    }
  }

  console.log(`\n✅ Seeded 20 more problems! Total now: 51`)
  await pool.end()
}

seed().catch(err => { console.error(err); process.exit(1) })
