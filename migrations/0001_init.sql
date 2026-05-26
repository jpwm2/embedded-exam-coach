-- Single-user study coaching app schema

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  iterations INTEGER NOT NULL DEFAULT 600000,
  created_at INTEGER NOT NULL,
  exam_date TEXT NOT NULL DEFAULT '2027-02-15',
  start_date TEXT NOT NULL DEFAULT '2026-05-11'
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS problems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT NOT NULL,
  year INTEGER NOT NULL,
  q INTEGER NOT NULL,
  card_no INTEGER,
  theme TEXT,
  group_label TEXT,
  era TEXT,
  season TEXT,
  meta TEXT,
  UNIQUE(subject, year, q)
);
CREATE INDEX IF NOT EXISTS idx_problems_subj ON problems(subject);
CREATE INDEX IF NOT EXISTS idx_problems_card ON problems(card_no);

CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  problem_id INTEGER NOT NULL,
  attempted_at INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  time_seconds INTEGER,
  rep_index INTEGER,
  choice TEXT,
  mistake_type TEXT,
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (problem_id) REFERENCES problems(id)
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_at ON attempts(user_id, attempted_at);
CREATE INDEX IF NOT EXISTS idx_attempts_problem ON attempts(problem_id);

CREATE TABLE IF NOT EXISTS srs_cards (
  user_id INTEGER NOT NULL,
  card_no INTEGER NOT NULL,
  intro_day INTEGER NOT NULL,
  next_due_day INTEGER NOT NULL,
  rep_index INTEGER NOT NULL DEFAULT 0,
  last_correct INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, card_no),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_srs_due ON srs_cards(user_id, next_due_day);

CREATE TABLE IF NOT EXISTS past_exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  season TEXT,
  subject TEXT NOT NULL,
  taken_at INTEGER NOT NULL,
  score REAL,
  raw TEXT,
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_pastexams_user ON past_exams(user_id, year);

CREATE TABLE IF NOT EXISTS weak_map (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_weak_user ON weak_map(user_id);

CREATE TABLE IF NOT EXISTS study_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  day_type TEXT NOT NULL,
  minutes INTEGER NOT NULL DEFAULT 0,
  items TEXT,
  note TEXT,
  next_action TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS b2_progress (
  user_id INTEGER NOT NULL,
  problem_id INTEGER NOT NULL,
  step INTEGER NOT NULL,
  done_at INTEGER,
  PRIMARY KEY (user_id, problem_id, step),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (problem_id) REFERENCES problems(id)
);

CREATE TABLE IF NOT EXISTS settings (
  user_id INTEGER NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (user_id, key),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
