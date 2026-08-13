const API = '/api/articles';

export async function fetchArticles() {
  const res = await fetch(API);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createArticle(payload) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}
