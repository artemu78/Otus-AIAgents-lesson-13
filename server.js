import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initDb, getDb } from './database/init.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = __dirname;
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

initDb();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

/** Confirms server and DB bootstrap (Фаза 1); REST API comes in Фаза 2. */
app.get('/api/health', (req, res) => {
  try {
    getDb().prepare('SELECT 1').get();
    res.json({ ok: true, db: true });
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: e.message });
  }
});

/** Articles CRUD (T-005 / STORY-001) — parameterized SQL only */
app.get('/api/articles', (req, res) => {
  try {
    const rows = getDb()
      .prepare(
        `SELECT id, title, content, source, author, published_date, created_at
         FROM articles ORDER BY id DESC`,
      )
      .all();
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to list articles' });
  }
});

app.get('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const row = getDb().prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch {
    res.status(500).json({ error: 'Failed to load article' });
  }
});

function parseArticleBody(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content : '';
  const source =
    body.source == null || body.source === ''
      ? null
      : String(body.source).trim() || null;
  const author =
    body.author == null || body.author === ''
      ? null
      : String(body.author).trim() || null;
  const published_date =
    body.published_date == null || body.published_date === ''
      ? null
      : String(body.published_date).trim() || null;
  return { title, content, source, author, published_date };
}

app.post('/api/articles', (req, res) => {
  const { title, content, source, author, published_date } = parseArticleBody(req.body || {});
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  try {
    const db = getDb();
    const info = db
      .prepare(
        `INSERT INTO articles (title, content, source, author, published_date)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .run(title, content, source, author, published_date);
    const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(row);
  } catch {
    res.status(500).json({ error: 'Failed to save article' });
  }
});

app.put('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const { title, content, source, author, published_date } = parseArticleBody(req.body || {});
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  try {
    const db = getDb();
    const info = db
      .prepare(
        `UPDATE articles SET title = ?, content = ?, source = ?, author = ?, published_date = ?
         WHERE id = ?`,
      )
      .run(title, content, source, author, published_date, id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    res.json(row);
  } catch {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const info = getDb().prepare('DELETE FROM articles WHERE id = ?').run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

if (isProd) {
  const distPath = path.join(rootDir, 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} (API + ${isProd ? 'static dist' : 'dev: use Vite on :5173'})`);
  if (isProd && !fs.existsSync(path.join(rootDir, 'dist'))) {
    console.warn('Production: run `npm run build` before `npm start`.');
  }
});
