/**
 * GraphView — assembles GraphPreview + NodeDetails with local mock data.
 * Mock adapter is isolated here; swap `useMockGraph` for `useApiGraph`
 * when GET /api/graph is ready.
 */

import { useState } from 'react';
import GraphPreview from './GraphPreview.jsx';
import NodeDetails from './NodeDetails.jsx';
import { mockNodes, mockEdges } from '../data/mockGraph.js';

function useMockGraph() {
  return { nodes: mockNodes, edges: mockEdges, loading: false, error: null };
}

export default function GraphView() {
  const { nodes, edges, loading, error } = useMockGraph();
  const [selectedId, setSelectedId] = useState(null);

  function handleSelect(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          padding: 24,
          textAlign: 'center',
          color: '#667069',
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        }}
      >
        Загрузка графа…
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        style={{
          padding: 24,
          background: '#FBE9E7',
          borderRadius: 10,
          color: '#A33C35',
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        }}
      >
        <strong>Ошибка загрузки графа:</strong> {error}
      </div>
    );
  }

  return (
    <section
      aria-label="Граф знаний"
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 24,
        marginTop: 24,
        alignItems: 'start',
      }}
    >
      <div>
        <h2
          style={{
            margin: '0 0 12px',
            fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#18211D',
          }}
        >
          Граф знаний
        </h2>
        <GraphPreview
          nodes={nodes}
          edges={edges}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>
      <div>
        <h2
          style={{
            margin: '0 0 12px',
            fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#18211D',
          }}
        >
          Детали узла
        </h2>
        <NodeDetails
          selectedId={selectedId}
          nodes={nodes}
          edges={edges}
        />
      </div>
    </section>
  );
}
