import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const dbPath = path.join(dataDir, 'articles.db');

let db;

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized; call initDb() first');
  }
  return db;
}

/** Creates `data/articles.db` and tables per adr.md (T-003). */
export function initDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      source TEXT,
      author TEXT,
      published_date DATE,
      tags TEXT,
      summary TEXT,
      sentiment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS concepts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT DEFAULT 'concept'
    );

    CREATE TABLE IF NOT EXISTS article_concepts (
      article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
      concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, concept_id)
    );
  `);
  return db;
}
