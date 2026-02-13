const Database = require("better-sqlite3");

const db = new Database("data.db");

db.exec(`
CREATE TABLE IF NOT EXISTS transcripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task TEXT,
  owner TEXT,
  due_date TEXT,
  done INTEGER DEFAULT 0,
  transcript_id INTEGER
);
`);

module.exports = db;
