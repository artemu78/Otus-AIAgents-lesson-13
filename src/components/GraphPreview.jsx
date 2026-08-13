/**
 * GraphPreview — SVG-based knowledge graph visualization.
 *
 * Design tokens from DESIGN.md:
 *   article-node: #315E8A (rectangle, rounded-sm 6px)
 *   concept-node:  #C66A3D (pill)
 *   selected:      #69C59B
 *   border:        #D9E1DC
 *   text-primary:  #18211D
 *   surface:       #FFFCF5
 *   neutral:       #F4F1E9
 */

import { getConnectedEdgeIds } from '../data/mockGraph.js';

const TOKENS = {
  articleNode: '#315E8A',
  onArticleNode: '#FFFFFF',
  conceptNode: '#C66A3D',
  onConceptNode: '#FFFFFF',
  selected: '#69C59B',
  onSelected: '#18352B',
  edge: '#D9E1DC',
  edgeSelected: '#69C59B',
  surface: '#FFFCF5',
  neutral: '#F4F1E9',
  textSecondary: '#667069',
};

const NODE_W_ARTICLE = 140;
const NODE_H_ARTICLE = 48;
const NODE_H_CONCEPT = 36;

function articleNodePath(x, y, r = 6) {
  const w = NODE_W_ARTICLE;
  const h = NODE_H_ARTICLE;
  const left = x - w / 2;
  const top = y - h / 2;
  return `M${left + r},${top} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v-${h - 2 * r} a${r},${r} 0 0 1 ${r},-${r} z`;
}

function conceptNodeRx(label) {
  // pill radius — half the height
  return NODE_H_CONCEPT / 2;
}

function conceptNodeWidth(label) {
  // approximate text width: 8px per char + padding
  return Math.max(80, label.length * 8 + 32);
}

export default function GraphPreview({ nodes, edges, selectedId, onSelect }) {
  const connectedEdgeIds =
    selectedId ? new Set(getConnectedEdgeIds(selectedId, edges)) : new Set();

  if (!nodes || nodes.length === 0) {
    return (
      <div
        role="status"
        aria-label="Граф пуст"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 360,
          background: TOKENS.neutral,
          borderRadius: 10,
          color: TOKENS.textSecondary,
          fontFamily: 'IBM Plex Sans, system-ui, sans-serif',
          gap: 8,
        }}
      >
        <span style={{ fontSize: '2rem' }}>🕸️</span>
        <p style={{ margin: 0, fontWeight: 600 }}>Граф пуст</p>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Добавьте статью, чтобы граф появился здесь
        </p>
      </div>
    );
  }

  // Compute SVG viewport
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const pad = 80;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;
  const vbWidth = maxX - minX;
  const vbHeight = maxY - minY;

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg
      role="img"
      aria-label="Граф знаний"
      viewBox={`${minX} ${minY} ${vbWidth} ${vbHeight}`}
      style={{
        width: '100%',
        height: 420,
        background: TOKENS.surface,
        borderRadius: 10,
        border: `1px solid #D9E1DC`,
        display: 'block',
      }}
    >
      {/* Edges */}
      <g aria-hidden="true">
        {edges.map((edge) => {
          const src = nodeMap[edge.source];
          const tgt = nodeMap[edge.target];
          if (!src || !tgt) return null;
          const isHighlighted = connectedEdgeIds.has(edge.id);
          return (
            <line
              key={edge.id}
              x1={src.x}
              y1={src.y}
              x2={tgt.x}
              y2={tgt.y}
              stroke={isHighlighted ? TOKENS.edgeSelected : TOKENS.edge}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {nodes.map((node) => {
          const isSelected = node.id === selectedId;
          const fill = isSelected
            ? TOKENS.selected
            : node.type === 'article'
            ? TOKENS.articleNode
            : TOKENS.conceptNode;
          const textFill = isSelected ? TOKENS.onSelected : '#FFFFFF';

          if (node.type === 'article') {
            return (
              <g
                key={node.id}
                role="button"
                aria-label={`Статья: ${node.label}`}
                aria-pressed={isSelected}
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelect(node.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(node.id)}
              >
                <path d={articleNodePath(node.x, node.y)} fill={fill} />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textFill}
                  fontSize="11"
                  fontFamily="IBM Plex Sans, system-ui, sans-serif"
                  fontWeight="600"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.label.length > 18
                    ? node.label.slice(0, 17) + '…'
                    : node.label}
                </text>
                {/* type label below */}
                <text
                  x={node.x}
                  y={node.y + NODE_H_ARTICLE / 2 + 14}
                  textAnchor="middle"
                  fill={TOKENS.textSecondary}
                  fontSize="9"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="500"
                  letterSpacing="0.04em"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  СТАТЬЯ
                </text>
              </g>
            );
          }

          // concept node — pill
          const cw = conceptNodeWidth(node.label);
          const ch = NODE_H_CONCEPT;
          const rx = conceptNodeRx(node.label);
          return (
            <g
              key={node.id}
              role="button"
              aria-label={`Понятие: ${node.label}`}
              aria-pressed={isSelected}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(node.id)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(node.id)}
            >
              <rect
                x={node.x - cw / 2}
                y={node.y - ch / 2}
                width={cw}
                height={ch}
                rx={rx}
                ry={rx}
                fill={fill}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textFill}
                fontSize="11"
                fontFamily="IBM Plex Sans, system-ui, sans-serif"
                fontWeight="600"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
