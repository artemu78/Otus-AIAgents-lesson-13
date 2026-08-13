import { useEffect, useState } from 'react';
import { fetchArticles } from '../api/articles.js';

export default function ArticleList({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchArticles()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Не удалось загрузить список');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) return <p>Загрузка списка…</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (items.length === 0) return <p>Статей пока нет.</p>;

  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Импортированные статьи</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((a) => (
          <li
            key={a.id}
            style={{
              borderBottom: '1px solid #ddd',
              padding: '0.75rem 0',
            }}
          >
            <strong>{a.title}</strong>
            <div style={{ fontSize: '0.9rem', color: '#444', marginTop: 4 }}>
              {[a.source, a.author, a.published_date].filter(Boolean).join(' · ') || '—'}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: '0.85rem',
                color: '#333',
                whiteSpace: 'pre-wrap',
                maxHeight: 120,
                overflow: 'auto',
              }}
            >
              {a.content}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
