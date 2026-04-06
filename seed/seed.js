const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'codejudge',
  user: 'postgres',
  password: 'postgres',
})

const problems = [
  {
    title: 'Sum of Two Numbers',
    description: 'Given two integers A and B, print their sum.\n\nInput: Two integers A and B on a single line.\nOutput: Print A + B.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '3 5\n', output: '8\n' },
      { input: '10 20\n', output: '30\n' },
      { input: '-5 5\n', output: '0\n' },
    ]
  },
  {
    title: 'Sum of N Numbers',
    description: 'Given N integers, print their sum.\n\nInput: First line contains N. Second line contains N space-separated integers.\nOutput: Print the sum.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '5\n1 2 3 4 5\n', output: '15\n' },
      { input: '3\n10 20 30\n', output: '60\n' },
      { input: '1\n42\n', output: '42\n' },
    ]
  },
  {
    title: 'Factorial',
    description: 'Given a non-negative integer N, print N! (N factorial).\n\nInput: A single integer N (0 <= N <= 12).\nOutput: Print N!.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '5\n', output: '120\n' },
      { input: '0\n', output: '1\n' },
      { input: '10\n', output: '3628800\n' },
    ]
  },
  {
    title: 'Fibonacci Number',
    description: 'Given N, print the Nth Fibonacci number (0-indexed, F(0)=0, F(1)=1).\n\nInput: A single integer N (0 <= N <= 20).\nOutput: Print F(N).',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '0\n', output: '0\n' },
      { input: '7\n', output: '13\n' },
      { input: '10\n', output: '55\n' },
    ]
  },
  {
    title: 'Even or Odd',
    description: 'Given an integer N, print "Even" if it is even, otherwise print "Odd".\n\nInput: A single integer N.\nOutput: Print Even or Odd.',
    difficulty: 'easy', topic: 'Basics',
    testcases: [
      { input: '4\n', output: 'Even\n' },
      { input: '7\n', output: 'Odd\n' },
      { input: '0\n', output: 'Even\n' },
    ]
  },
  {
    title: 'Maximum of Three',
    description: 'Given three integers, print the maximum.\n\nInput: Three integers on a single line.\nOutput: Print the maximum.',
    difficulty: 'easy', topic: 'Basics',
    testcases: [
      { input: '3 7 2\n', output: '7\n' },
      { input: '-1 -5 -3\n', output: '-1\n' },
      { input: '10 10 10\n', output: '10\n' },
    ]
  },
  {
    title: 'Reverse a Number',
    description: 'Given an integer N, print its digits in reverse order.\n\nInput: A single positive integer N.\nOutput: Print the reversed number.',
    difficulty: 'easy', topic: 'Basics',
    testcases: [
      { input: '1234\n', output: '4321\n' },
      { input: '100\n', output: '1\n' },
      { input: '9\n', output: '9\n' },
    ]
  },
  {
    title: 'Prime Check',
    description: 'Given an integer N, print "YES" if it is prime, otherwise "NO".\n\nInput: A single integer N (1 <= N <= 10^6).\nOutput: Print YES or NO.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '7\n', output: 'YES\n' },
      { input: '1\n', output: 'NO\n' },
      { input: '12\n', output: 'NO\n' },
    ]
  },
  {
    title: 'GCD of Two Numbers',
    description: 'Given two integers A and B, print their GCD.\n\nInput: Two integers A and B.\nOutput: Print GCD(A, B).',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '12 8\n', output: '4\n' },
      { input: '100 75\n', output: '25\n' },
      { input: '7 3\n', output: '1\n' },
    ]
  },
  {
    title: 'Power of Two',
    description: 'Given N, print 2^N.\n\nInput: A single integer N (0 <= N <= 30).\nOutput: Print 2^N.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '0\n', output: '1\n' },
      { input: '10\n', output: '1024\n' },
      { input: '20\n', output: '1048576\n' },
    ]
  },
  {
    title: 'Linear Search',
    description: 'Given an array of N integers and a target X, print the index (0-based) of X in the array, or -1 if not found.\n\nInput: First line N, second line N integers, third line X.\nOutput: Print the index or -1.',
    difficulty: 'easy', topic: 'Arrays',
    testcases: [
      { input: '5\n1 2 3 4 5\n3\n', output: '2\n' },
      { input: '4\n10 20 30 40\n50\n', output: '-1\n' },
      { input: '3\n7 7 7\n7\n', output: '0\n' },
    ]
  },
  {
    title: 'Count Even and Odd',
    description: 'Given N integers, print the count of even and odd numbers.\n\nInput: First line N, second line N integers.\nOutput: Two integers: count of even numbers and count of odd numbers.',
    difficulty: 'easy', topic: 'Arrays',
    testcases: [
      { input: '5\n1 2 3 4 5\n', output: '2 3\n' },
      { input: '4\n2 4 6 8\n', output: '4 0\n' },
      { input: '3\n1 3 5\n', output: '0 3\n' },
    ]
  },
  {
    title: 'Sum of Array',
    description: 'Given an array of N integers, print their sum.\n\nInput: First line N, second line N integers.\nOutput: Print the sum.',
    difficulty: 'easy', topic: 'Arrays',
    testcases: [
      { input: '5\n1 2 3 4 5\n', output: '15\n' },
      { input: '3\n-1 0 1\n', output: '0\n' },
      { input: '1\n100\n', output: '100\n' },
    ]
  },
  {
    title: 'Minimum in Array',
    description: 'Given an array of N integers, print the minimum element.\n\nInput: First line N, second line N integers.\nOutput: Print the minimum.',
    difficulty: 'easy', topic: 'Arrays',
    testcases: [
      { input: '5\n3 1 4 1 5\n', output: '1\n' },
      { input: '3\n-5 -1 -3\n', output: '-5\n' },
      { input: '1\n42\n', output: '42\n' },
    ]
  },
  {
    title: 'Palindrome Check',
    description: 'Given an integer N, print "YES" if it is a palindrome, otherwise "NO".\n\nInput: A single integer N.\nOutput: Print YES or NO.',
    difficulty: 'easy', topic: 'Basics',
    testcases: [
      { input: '121\n', output: 'YES\n' },
      { input: '123\n', output: 'NO\n' },
      { input: '0\n', output: 'YES\n' },
    ]
  },
  {
    title: 'Binary Search',
    description: 'Given a sorted array of N integers and a target X, print its index (0-based) or -1 if not found.\n\nInput: First line N, second line N sorted integers, third line X.\nOutput: Print the index or -1.',
    difficulty: 'medium', topic: 'Searching',
    testcases: [
      { input: '5\n1 3 5 7 9\n5\n', output: '2\n' },
      { input: '5\n1 3 5 7 9\n6\n', output: '-1\n' },
      { input: '1\n10\n10\n', output: '0\n' },
    ]
  },
  {
    title: 'Bubble Sort',
    description: 'Given an array of N integers, sort them in ascending order using bubble sort and print the sorted array.\n\nInput: First line N, second line N integers.\nOutput: Print the sorted array space-separated.',
    difficulty: 'medium', topic: 'Sorting',
    testcases: [
      { input: '5\n5 3 1 4 2\n', output: '1 2 3 4 5\n' },
      { input: '3\n3 1 2\n', output: '1 2 3\n' },
      { input: '1\n7\n', output: '7\n' },
    ]
  },
  {
    title: 'Count Occurrences',
    description: 'Given an array of N integers and a value X, print how many times X appears.\n\nInput: First line N, second line N integers, third line X.\nOutput: Print the count.',
    difficulty: 'easy', topic: 'Arrays',
    testcases: [
      { input: '6\n1 2 3 2 1 2\n2\n', output: '3\n' },
      { input: '4\n5 5 5 5\n5\n', output: '4\n' },
      { input: '3\n1 2 3\n9\n', output: '0\n' },
    ]
  },
  {
    title: 'Sum of Digits',
    description: 'Given a non-negative integer N, print the sum of its digits.\n\nInput: A single integer N.\nOutput: Print the sum of digits.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '1234\n', output: '10\n' },
      { input: '0\n', output: '0\n' },
      { input: '999\n', output: '27\n' },
    ]
  },
  {
    title: 'Armstrong Number',
    description: 'A number is Armstrong if the sum of its digits each raised to the power of the number of digits equals the number itself. Given N, print "YES" or "NO".\n\nInput: A single integer N.\nOutput: Print YES or NO.',
    difficulty: 'easy', topic: 'Math',
    testcases: [
      { input: '153\n', output: 'YES\n' },
      { input: '123\n', output: 'NO\n' },
      { input: '370\n', output: 'YES\n' },
    ]
  },
  {
    title: 'Second Largest',
    description: 'Given an array of N distinct integers, print the second largest element.\n\nInput: First line N, second line N integers.\nOutput: Print the second largest.',
    difficulty: 'medium', topic: 'Arrays',
    testcases: [
      { input: '5\n3 1 4 1 5\n', output: '4\n' },
      { input: '3\n10 20 30\n', output: '20\n' },
      { input: '2\n5 3\n', output: '3\n' },
    ]
  },
  {
    title: 'Rotate Array',
    description: 'Given an array of N integers, rotate it left by K positions and print the result.\n\nInput: First line N and K, second line N integers.\nOutput: Print the rotated array.',
    difficulty: 'medium', topic: 'Arrays',
    testcases: [
      { input: '5 2\n1 2 3 4 5\n', output: '3 4 5 1 2\n' },
      { input: '3 1\n7 8 9\n', output: '8 9 7\n' },
      { input: '4 4\n1 2 3 4\n', output: '1 2 3 4\n' },
    ]
  },
  {
    title: 'Matrix Addition',
    description: 'Given two N×N matrices, print their sum.\n\nInput: First line N, then N lines of N integers for matrix A, then N lines of N integers for matrix B.\nOutput: N lines of N integers representing A+B.',
    difficulty: 'medium', topic: 'Matrices',
    testcases: [
      { input: '2\n1 2\n3 4\n5 6\n7 8\n', output: '6 8\n10 12\n' },
      { input: '1\n5\n3\n', output: '8\n' },
      { input: '2\n0 0\n0 0\n1 1\n1 1\n', output: '1 1\n1 1\n' },
    ]
  },
  {
    title: 'Transpose Matrix',
    description: 'Given an N×N matrix, print its transpose.\n\nInput: First line N, then N lines of N integers.\nOutput: N lines of N integers representing the transpose.',
    difficulty: 'medium', topic: 'Matrices',
    testcases: [
      { input: '2\n1 2\n3 4\n', output: '1 3\n2 4\n' },
      { input: '3\n1 2 3\n4 5 6\n7 8 9\n', output: '1 4 7\n2 5 8\n3 6 9\n' },
      { input: '1\n7\n', output: '7\n' },
    ]
  },
  {
    title: 'String Length',
    description: 'Given a string, print its length.\n\nInput: A single string (no spaces).\nOutput: Print the length.',
    difficulty: 'easy', topic: 'Strings',
    testcases: [
      { input: 'hello\n', output: '5\n' },
      { input: 'a\n', output: '1\n' },
      { input: 'programming\n', output: '11\n' },
    ]
  },
  {
    title: 'Count Vowels',
    description: 'Given a string, print the number of vowels (a, e, i, o, u — both upper and lower case).\n\nInput: A single string.\nOutput: Print the count of vowels.',
    difficulty: 'easy', topic: 'Strings',
    testcases: [
      { input: 'hello\n', output: '2\n' },
      { input: 'AEIOU\n', output: '5\n' },
      { input: 'rhythm\n', output: '0\n' },
    ]
  },
  {
    title: 'Reverse String',
    description: 'Given a string, print it reversed.\n\nInput: A single string (no spaces).\nOutput: Print the reversed string.',
    difficulty: 'easy', topic: 'Strings',
    testcases: [
      { input: 'hello\n', output: 'olleh\n' },
      { input: 'abcde\n', output: 'edcba\n' },
      { input: 'a\n', output: 'a\n' },
    ]
  },
  {
    title: 'Anagram Check',
    description: 'Given two strings, print "YES" if they are anagrams of each other, otherwise "NO".\n\nInput: Two strings on separate lines.\nOutput: Print YES or NO.',
    difficulty: 'medium', topic: 'Strings',
    testcases: [
      { input: 'listen\nsilent\n', output: 'YES\n' },
      { input: 'hello\nworld\n', output: 'NO\n' },
      { input: 'abc\ncba\n', output: 'YES\n' },
    ]
  },
  {
    title: 'Stack Push Pop',
    description: 'Simulate a stack. Given Q operations, each either "PUSH X" or "POP". For each POP print the popped value, or "EMPTY" if stack is empty.\n\nInput: First line Q, then Q operations.\nOutput: For each POP print the value or EMPTY.',
    difficulty: 'medium', topic: 'Stack',
    testcases: [
      { input: '4\nPUSH 5\nPUSH 3\nPOP\nPOP\n', output: '3\n5\n' },
      { input: '2\nPOP\nPUSH 1\n', output: 'EMPTY\n' },
      { input: '3\nPUSH 10\nPUSH 20\nPOP\n', output: '20\n' },
    ]
  },
  {
    title: 'Queue Enqueue Dequeue',
    description: 'Simulate a queue. Given Q operations, each either "ENQUEUE X" or "DEQUEUE". For each DEQUEUE print the value, or "EMPTY" if queue is empty.\n\nInput: First line Q, then Q operations.\nOutput: For each DEQUEUE print the value or EMPTY.',
    difficulty: 'medium', topic: 'Queue',
    testcases: [
      { input: '4\nENQUEUE 5\nENQUEUE 3\nDEQUEUE\nDEQUEUE\n', output: '5\n3\n' },
      { input: '2\nDEQUEUE\nENQUEUE 1\n', output: 'EMPTY\n' },
      { input: '3\nENQUEUE 10\nENQUEUE 20\nDEQUEUE\n', output: '10\n' },
    ]
  },
  {
    title: 'Missing Number',
    description: 'Given an array of N-1 distinct integers in range [1, N], find the missing number.\n\nInput: First line N, second line N-1 integers.\nOutput: Print the missing number.',
    difficulty: 'medium', topic: 'Arrays',
    testcases: [
      { input: '5\n1 2 4 5\n', output: '3\n' },
      { input: '3\n1 3\n', output: '2\n' },
      { input: '1\n\n', output: '1\n' },
    ]
  },
]

async function seed() {
  console.log('Seeding database...')
  const tcDir = path.join(__dirname, 'testcases')
  if (!fs.existsSync(tcDir)) fs.mkdirSync(tcDir, { recursive: true })

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

  console.log(`\n✅ Seeded ${problems.length} problems with 3 test cases each!`)
  await pool.end()
}

seed().catch(err => { console.error(err); process.exit(1) })
