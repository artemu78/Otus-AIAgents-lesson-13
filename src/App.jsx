import { useState } from 'react';
import ArticleForm from './components/ArticleForm.jsx';
import ArticleList from './components/ArticleList.jsx';

export default function App() {
  const [listKey, setListKey] = useState(0);
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: 720 }}>
      <h1>Knowledge Graph News</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        <a href="/docs.html">Документация (CJM)</a>
      </p>
      <ArticleForm onImported={() => setListKey((k) => k + 1)} />
      <ArticleList refreshKey={listKey} />
    </main>
  );
}
