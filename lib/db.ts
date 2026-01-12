import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'journal.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL DEFAULT (date('now')),
    emotion TEXT,
    reflection TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL,
    summary TEXT NOT NULL,
    themes TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(date);
  CREATE INDEX IF NOT EXISTS idx_ai_insights_entry_id ON ai_insights(entry_id);
`);

export interface JournalEntry {
  id: number;
  date: string;
  emotion: string | null;
  reflection: string;
  created_at: string;
}

export interface AIInsight {
  id: number;
  entry_id: number;
  summary: string;
  themes: string; // JSON string array
  created_at: string;
}

export const journalQueries = {
  // Insert a new journal entry
  insertEntry: db.prepare(`
    INSERT INTO journal_entries (date, emotion, reflection)
    VALUES (date('now'), ?, ?)
  `),

  // Get entry by ID
  getEntryById: db.prepare(`
    SELECT * FROM journal_entries WHERE id = ?
  `),

  // Get all entries ordered by date
  getAllEntries: db.prepare(`
    SELECT * FROM journal_entries 
    ORDER BY date DESC, created_at DESC
  `),

  // Get entries for a specific date
  getEntriesByDate: db.prepare(`
    SELECT * FROM journal_entries 
    WHERE date = ?
    ORDER BY created_at DESC
  `),

  // Get recent entries (last N days)
  getRecentEntries: db.prepare(`
    SELECT * FROM journal_entries 
    WHERE date >= date('now', '-' || ? || ' days')
    ORDER BY date DESC, created_at DESC
  `),
};

export const insightQueries = {
  // Insert AI insight
  insertInsight: db.prepare(`
    INSERT INTO ai_insights (entry_id, summary, themes)
    VALUES (?, ?, ?)
  `),

  // Get insight by entry ID
  getInsightByEntryId: db.prepare(`
    SELECT * FROM ai_insights WHERE entry_id = ?
  `),

  // Get all insights with entries
  getAllInsights: db.prepare(`
    SELECT 
      ai_insights.*,
      journal_entries.date,
      journal_entries.emotion,
      journal_entries.reflection
    FROM ai_insights
    JOIN journal_entries ON ai_insights.entry_id = journal_entries.id
    ORDER BY journal_entries.date DESC, ai_insights.created_at DESC
  `),
};

export default db;
