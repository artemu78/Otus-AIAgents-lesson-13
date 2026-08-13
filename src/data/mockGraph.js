/**
 * Mock graph data for GraphPreview component.
 * Separated from UI so the adapter can be replaced with GET /api/graph later.
 *
 * 3 articles, 5 concepts, 7+ relations, preset positions for reproducible demo.
 */

export const mockNodes = [
  // Articles
  {
    id: 'a1',
    type: 'article',
    label: 'Введение в RAG-системы',
    title: 'Введение в RAG-системы',
    source: 'Habr',
    publishedDate: '2024-11-10',
    summary:
      'Обзор архитектуры Retrieval-Augmented Generation: как LLM используют внешние базы знаний для повышения точности ответов.',
    x: 160,
    y: 120,
  },
  {
    id: 'a2',
    type: 'article',
    label: 'Агенты на базе LLM',
    title: 'Агенты на базе LLM',
    source: 'ArXiv',
    publishedDate: '2024-12-05',
    summary:
      'Исследование автономных агентов, использующих большие языковые модели для планирования и выполнения многошаговых задач.',
    x: 480,
    y: 80,
  },
  {
    id: 'a3',
    type: 'article',
    label: 'Векторные базы данных в 2025',
    title: 'Векторные базы данных в 2025',
    source: 'Towards Data Science',
    publishedDate: '2025-01-20',
    summary:
      'Сравнение современных векторных СУБД: Pinecone, Weaviate, Qdrant и pgvector для задач семантического поиска.',
    x: 300,
    y: 320,
  },

  // Concepts
  {
    id: 'c1',
    type: 'concept',
    label: 'RAG',
    name: 'RAG',
    conceptType: 'concept',
    x: 60,
    y: 260,
  },
  {
    id: 'c2',
    type: 'concept',
    label: 'LLM',
    name: 'LLM',
    conceptType: 'concept',
    x: 340,
    y: 200,
  },
  {
    id: 'c3',
    type: 'concept',
    label: 'Векторный поиск',
    name: 'Векторный поиск',
    conceptType: 'concept',
    x: 520,
    y: 280,
  },
  {
    id: 'c4',
    type: 'concept',
    label: 'Агент',
    name: 'Агент',
    conceptType: 'concept',
    x: 620,
    y: 160,
  },
  {
    id: 'c5',
    type: 'concept',
    label: 'Embedding',
    name: 'Embedding',
    conceptType: 'concept',
    x: 160,
    y: 400,
  },
];

export const mockEdges = [
  { id: 'e1', source: 'a1', target: 'c1' },
  { id: 'e2', source: 'a1', target: 'c2' },
  { id: 'e3', source: 'a2', target: 'c2' },
  { id: 'e4', source: 'a2', target: 'c4' },
  { id: 'e5', source: 'a3', target: 'c3' },
  { id: 'e6', source: 'a3', target: 'c5' },
  { id: 'e7', source: 'a1', target: 'c5' },
  { id: 'e8', source: 'a3', target: 'c2' },
];

/**
 * Returns related nodes for a given node id.
 */
export function getRelated(nodeId, nodes, edges) {
  const relatedIds = new Set();
  for (const edge of edges) {
    if (edge.source === nodeId) relatedIds.add(edge.target);
    if (edge.target === nodeId) relatedIds.add(edge.source);
  }
  return nodes.filter((n) => relatedIds.has(n.id));
}

/**
 * Returns edge ids directly connected to a node.
 */
export function getConnectedEdgeIds(nodeId, edges) {
  return edges
    .filter((e) => e.source === nodeId || e.target === nodeId)
    .map((e) => e.id);
}
