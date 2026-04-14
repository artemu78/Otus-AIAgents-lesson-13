import { useState } from 'react';

const defaultDirection = 'поиск ключевых понятий';
const defaultModel = 'llama3.2';

export default function App() {
  const [articleText, setArticleText] = useState('');
  const [analysisDirection, setAnalysisDirection] = useState(defaultDirection);
  const [model, setModel] = useState(defaultModel);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setError('');
    setResult('');

    if (!articleText.trim()) {
      setError('Введите текст статьи перед анализом.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleText,
          analysisDirection,
          model
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Ошибка анализа');
      }

      setResult(JSON.stringify(payload.result, null, 2));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: 860, margin: '0 auto' }}>
      <h1>Анализ статьи через Ollama</h1>

      <label style={{ display: 'block', marginBottom: 8 }} htmlFor="articleText">
        Текст статьи
      </label>
      <textarea
        id="articleText"
        value={articleText}
        onChange={(e) => setArticleText(e.target.value)}
        rows={10}
        placeholder="Вставьте текст статьи..."
        style={{ width: '100%', marginBottom: 16, padding: 10 }}
      />

      <label style={{ display: 'block', marginBottom: 8 }} htmlFor="analysisDirection">
        Направление анализа
      </label>
      <input
        id="analysisDirection"
        type="text"
        value={analysisDirection}
        onChange={(e) => setAnalysisDirection(e.target.value)}
        placeholder="Например: RAG, поиск ключевых понятий, лучшие практики промптов"
        style={{ width: '100%', marginBottom: 16, padding: 10 }}
      />

      <label style={{ display: 'block', marginBottom: 8 }} htmlFor="model">
        Модель Ollama
      </label>
      <select
        id="model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        style={{ width: '100%', marginBottom: 16, padding: 10 }}
      >
        <option value="llama3.2">llama3.2</option>
        <option value="mistral">mistral</option>
      </select>

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={isLoading}
        style={{ padding: '10px 16px', cursor: isLoading ? 'wait' : 'pointer' }}
      >
        {isLoading ? 'Анализ...' : 'Анализировать'}
      </button>

      {error ? <p style={{ color: '#b00020', marginTop: 16 }}>{error}</p> : null}

      <label style={{ display: 'block', marginTop: 20, marginBottom: 8 }} htmlFor="result">
        Результат анализа
      </label>
      <textarea
        id="result"
        value={result}
        readOnly
        rows={12}
        placeholder="Здесь появится результат анализа..."
        style={{ width: '100%', padding: 10 }}
      />
    </main>
  );
}
