CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student',
  total_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(10) NOT NULL,
  topic VARCHAR(100),
  time_limit INT DEFAULT 2,
  memory_limit INT DEFAULT 256,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_cases (
  id SERIAL PRIMARY KEY,
  problem_id INT REFERENCES problems(id),
  input_path VARCHAR(255) NOT NULL,
  output_path VARCHAR(255) NOT NULL,
  is_hidden BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  problem_id INT REFERENCES problems(id),
  source_code TEXT NOT NULL,
  language VARCHAR(20) DEFAULT 'c',
  verdict VARCHAR(20),
  execution_time FLOAT,
  memory_used INT,
  error_log TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);