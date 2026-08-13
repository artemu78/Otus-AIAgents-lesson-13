/**
 * NodeDetails — shows details of the selected graph node.
 *
 * Design tokens from DESIGN.md:
 *   details-panel: surface-raised #FFFFFF, rounded-lg 16px, padding 24px
 *   concept-chip:  neutral #F4F1E9, primary #18352B, pill
 *   heading-md:    IBM Plex Sans, 1.125rem, 600
 *   metadata:      IBM Plex Sans, 0.8125rem, 500
 *   text-secondary: #667069
 */

import { getRelated } from '../data/mockGraph.js';

const T = {
  surface: '#FFFFFF',
  primary: '#18352B',
  secondary: '#496158',
  textPrimary: '#18211D',
  textSecondary: '#667069',
  neutral: '#F4F1E9',
  border: '#D9E1DC',
  articleNode: '#315E8A',
  conceptNode: '#C66A3D',
};

function ConceptChip({ label }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: T.neutral,
        color: T.primary,
        borderRadius: 999,
        padding: '4px 12px',
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        fontSize: '0.8125rem',
        fontWeight: 500,
        lineHeight: 1.35,
      }}
    >
      {label}
    </span>
  );
}

function ArticleChip({ label }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: '#EBF0F7',
        color: T.articleNode,
        borderRadius: 6,
        padding: '4px 12px',
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        fontSize: '0.8125rem',
        fontWeight: 500,
        lineHeight: 1.35,
      }}
    >
      {label}
    </span>
  );
}

export default function NodeDetails({ selectedId, nodes, edges }) {
  if (!selectedId) {
    return (
      <div
        style={{
          background: T.neutral,
          borderRadius: 10,
          padding: 24,
          color: T.textSecondary,
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
          fontSize: '0.9375rem',
          textAlign: 'center',
        }}
        role="status"
        aria-label="Узел не выбран"
      >
        <p style={{ margin: 0 }}>Выберите узел на графе, чтобы увидеть детали</p>
      </div>
    );
  }

  const node = nodes.find((n) => n.id === selectedId);
  if (!node) return null;

  const related = getRelated(selectedId, nodes, edges);
  const relatedArticles = related.filter((n) => n.type === 'article');
  const relatedConcepts = related.filter((n) => n.type === 'concept');

  return (
    <article
      aria-label={`Детали узла: ${node.label}`}
      style={{
        background: T.surface,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${T.border}`,
        fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: node.type === 'article' ? T.articleNode : T.conceptNode,
            textTransform: 'uppercase',
          }}
          aria-label="Тип узла"
        >
          {node.type === 'article' ? 'Статья' : 'Понятие'}
        </span>
        <h2
          style={{
            margin: 0,
            fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: T.textPrimary,
            lineHeight: 1.3,
          }}
        >
          {node.label}
        </h2>
      </header>

      {/* Article-specific fields */}
      {node.type === 'article' && (
        <>
          {(node.source || node.publishedDate) && (
            <dl
              style={{
                margin: 0,
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              {node.source && (
                <div>
                  <dt
                    style={{
                      fontSize: '0.75rem',
                      color: T.textSecondary,
                      fontWeight: 500,
                      marginBottom: 2,
                    }}
                  >
                    Источник
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      fontSize: '0.8125rem',
                      color: T.textPrimary,
                      fontWeight: 500,
                    }}
                  >
                    {node.source}
                  </dd>
                </div>
              )}
              {node.publishedDate && (
                <div>
                  <dt
                    style={{
                      fontSize: '0.75rem',
                      color: T.textSecondary,
                      fontWeight: 500,
                      marginBottom: 2,
                    }}
                  >
                    Дата
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      fontSize: '0.8125rem',
                      color: T.textPrimary,
                      fontWeight: 500,
                    }}
                  >
                    {node.publishedDate}
                  </dd>
                </div>
              )}
            </dl>
          )}
          {node.summary && (
            <p
              style={{
                margin: 0,
                fontSize: '0.9375rem',
                color: T.textPrimary,
                lineHeight: 1.5,
              }}
            >
              {node.summary}
            </p>
          )}
          {relatedConcepts.length > 0 && (
            <section aria-label="Связанные понятия">
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: '0.8125rem',
                  color: T.textSecondary,
                  fontWeight: 500,
                }}
              >
                Понятия ({relatedConcepts.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {relatedConcepts.map((c) => (
                  <ConceptChip key={c.id} label={c.label} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Concept-specific fields */}
      {node.type === 'concept' && (
        <>
          {node.conceptType && (
            <p
              style={{
                margin: 0,
                fontSize: '0.8125rem',
                color: T.textSecondary,
              }}
            >
              Тип: <strong>{node.conceptType}</strong>
            </p>
          )}
          <section aria-label="Связанные статьи">
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '0.8125rem',
                color: T.textSecondary,
                fontWeight: 500,
              }}
            >
              <span aria-label={`Количество связанных статей: ${relatedArticles.length}`}>
                Статей: {relatedArticles.length}
              </span>
            </p>
            {relatedArticles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {relatedArticles.map((a) => (
                  <ArticleChip key={a.id} label={a.label} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </article>
  );
}
