import { useState } from 'react';
import { createArticle } from '../api/articles.js';

const empty = {
  title: '',
  content: '',
  source: '',
  author: '',
  published_date: '',
};

export default function ArticleForm({ onImported }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createArticle({
        title: form.title.trim(),
        content: form.content,
        source: form.source.trim() || null,
        author: form.author.trim() || null,
        published_date: form.published_date || null,
      });
      setForm(empty);
      onImported?.();
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gap: '0.75rem',
        marginBottom: '2rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: 8,
        background: '#fafafa',
      }}
    >
      <h2 style={{ margin: 0 }}>Импорт статьи</h2>
      <label>
        Заголовок *
        <input
          required
          value={form.title}
          onChange={(e) => setField('title', e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>
      <label>
        Текст статьи *
        <textarea
          required
          rows={8}
          value={form.content}
          onChange={(e) => setField('content', e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 4, fontFamily: 'inherit' }}
        />
      </label>
      <label>
        Источник
        <input
          value={form.source}
          onChange={(e) => setField('source', e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>
      <label>
        Автор
        <input
          value={form.author}
          onChange={(e) => setField('author', e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>
      <label>
        Дата публикации
        <input
          type="date"
          value={form.published_date}
          onChange={(e) => setField('published_date', e.target.value)}
          style={{ display: 'block', marginTop: 4 }}
        />
      </label>
      {error && <p style={{ color: 'crimson', margin: 0 }}>{error}</p>}
      <button type="submit" disabled={saving}>
        {saving ? 'Сохранение…' : 'Импортировать'}
      </button>
    </form>
  );
}
