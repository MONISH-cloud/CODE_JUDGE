const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'codejudge',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.connect()
  .then(() => console.log('Submission Service connected to PostgreSQL'))
  .catch(err => console.error('Database connection error:', err));

module.exports = pool;
