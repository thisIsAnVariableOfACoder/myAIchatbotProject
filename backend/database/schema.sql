-- FILE: backend/database/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL, -- 'high_school', 'university', 'professional'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  skills TEXT, -- JSON array: ["coding", "design"]
  interests TEXT, -- JSON array: ["technology", "arts"]
  education_level VARCHAR(100),
  current_grade INTEGER,
  work_experience_years INTEGER,
  preferred_work_style VARCHAR(50), -- 'remote', 'office', 'hybrid'
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id VARCHAR(100) NOT NULL,
  user_id INTEGER NOT NULL,
  sender VARCHAR(20) NOT NULL, -- 'user' or 'bot'
  message TEXT NOT NULL,
  node_id VARCHAR(50), -- current scenario node
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON chat_messages(user_id);

CREATE TABLE IF NOT EXISTS conversations (
  id VARCHAR(100) PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);

CREATE TABLE IF NOT EXISTS scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  target_user_type VARCHAR(50),
  nodes TEXT NOT NULL, -- JSON array of question nodes
  edges TEXT NOT NULL, -- JSON array of transitions
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scenario_nodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scenario_id INTEGER NOT NULL,
  node_id VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  answer_type VARCHAR(50), -- 'multiple_choice', 'text', 'rating'
  options TEXT, -- JSON array for multiple choice
  weight FLOAT DEFAULT 1.0, -- for scoring
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id)
);
CREATE INDEX IF NOT EXISTS idx_nodes_scenario ON scenario_nodes(scenario_id);

CREATE TABLE IF NOT EXISTS recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id VARCHAR(100) NOT NULL,
  user_id INTEGER NOT NULL,
  career_name VARCHAR(255) NOT NULL,
  match_score FLOAT NOT NULL,
  reasons TEXT, -- JSON array
  learning_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_recommendations_conv ON recommendations(conversation_id);

CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type VARCHAR(100) NOT NULL, -- 'user_registered', 'conversation_completed', 'career_viewed'
  user_id INTEGER,
  metadata TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type, created_at);

CREATE TABLE IF NOT EXISTS careers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  required_skills TEXT, -- JSON array
  salary_range VARCHAR(100),
  job_outlook VARCHAR(50),
  description TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_careers_name ON careers(name);

CREATE TABLE IF NOT EXISTS learning_paths (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  career_id INTEGER NOT NULL,
  step_order INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_months INTEGER,
  resources TEXT, -- JSON array of links
  FOREIGN KEY (career_id) REFERENCES careers(id)
);
