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

app.post('/api/analyze', async (req, res) => {
  const { articleText, analysisDirection, model = 'llama3.2' } = req.body ?? {};

  if (!articleText || typeof articleText !== 'string' || !articleText.trim()) {
    return res.status(400).json({ error: 'articleText is required' });
  }

  const prompt = `Проанализируй следующую статью и извлеки:
1. Ключевые понятия (технологии, методы, концепции)
2. Упомянутые инструменты (библиотеки, фреймворки, сервисы)
3. Краткое резюме (2-3 предложения)
4. Тональность (позитивная/нейтральная/негативная)
5. Анализ с фокусом на направлении: ${analysisDirection || 'общий анализ'}

Формат ответа (JSON):
{
  "concepts": ["понятие1", "понятие2"],
  "tools": ["инструмент1", "инструмент2"],
  "summary": "краткое резюме",
  "sentiment": "neutral",
  "direction_analysis": "вывод по выбранному направлению"
}

Текст статьи:
${articleText}`;

  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json'
      })
    });

    if (!ollamaResponse.ok) {
      const text = await ollamaResponse.text();
      return res.status(502).json({
        error: 'Ollama request failed',
        details: text
      });
    }

    const payload = await ollamaResponse.json();
    const rawResult = payload?.response ?? '{}';

    let result;
    try {
      result = JSON.parse(rawResult);
    } catch {
      result = { raw: rawResult };
    }

    return res.json({ result });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to analyze article',
      details: error.message
    });
  }
});

/** Confirms server and DB bootstrap (Фаза 1); REST API comes in Фаза 2. */
app.get('/api/health', (req, res) => {
  try {
    getDb().prepare('SELECT 1').get();
    res.json({ ok: true, db: true });
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: e.message });
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
