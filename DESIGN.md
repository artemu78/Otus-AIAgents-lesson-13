---
version: alpha
name: Knowledge Graph News
description: A calm analytical workspace for collecting AI articles and exploring connections between articles and concepts.
colors:
  primary: "#18352B"
  on-primary: "#FFFFFF"
  secondary: "#496158"
  tertiary: "#C66A3D"
  on-tertiary: "#FFFFFF"
  neutral: "#F4F1E9"
  surface: "#FFFCF5"
  surface-raised: "#FFFFFF"
  text-primary: "#18211D"
  text-secondary: "#667069"
  border: "#D9E1DC"
  article-node: "#315E8A"
  on-article-node: "#FFFFFF"
  concept-node: "#C66A3D"
  on-concept-node: "#FFFFFF"
  selected: "#69C59B"
  error: "#A33C35"
typography:
  display:
    fontFamily: "IBM Plex Serif"
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  heading-lg:
    fontFamily: "IBM Plex Sans"
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
  heading-md:
    fontFamily: "IBM Plex Sans"
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "IBM Plex Sans"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  metadata:
    fontFamily: "IBM Plex Sans"
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.35
  label:
    fontFamily: "IBM Plex Mono"
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.04em"
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-primary}"
  article-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 16px
  graph-node-article:
    backgroundColor: "{colors.article-node}"
    textColor: "{colors.on-article-node}"
    rounded: "{rounded.sm}"
    height: 48px
  graph-node-concept:
    backgroundColor: "{colors.concept-node}"
    textColor: "{colors.on-concept-node}"
    rounded: "{rounded.pill}"
    height: 40px
  graph-node-selected:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.primary}"
  concept-chip:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 8px
  details-panel:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 24px
  state-panel:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: 24px
---

## Overview

Knowledge Graph News is a focused analytical workspace, not a marketing dashboard. It helps a developer collect AI and LLM articles and discover relationships between articles, tools, methods, people, and organizations.

The visual language combines an editorial reading surface with a technical knowledge map. It should feel calm, legible, and deliberate. The graph is the primary analytical object; decoration must never compete with its nodes and connections.

The first implementation slice is the **Graph Preview** shown beside the existing article-import flow. It uses local mock data before the graph API and Cytoscape integration are ready.

## Colors

- **Primary:** deep forest ink for navigation, primary actions, and strong labels.
- **Neutral and surfaces:** warm paper colors that support sustained reading and avoid a generic cold SaaS appearance.
- **Article node:** editorial blue. All article nodes use a compact rectangular form.
- **Concept node:** clay orange. All concepts, tools, people, and organizations use a rounded form.
- **Selected:** mint highlight used only for the active node and its directly connected edges.
- Color must not be the only distinction between article and concept nodes: shape and labels must also differ.
- Body text must retain WCAG AA contrast on all surfaces.

## Typography

- `display` is reserved for the product title or one major page heading.
- `heading-lg` and `heading-md` define screen and panel hierarchy.
- `body` is used for article summaries and instructions.
- `metadata` is used for source, author, date, counts, and secondary descriptions.
- `label` is used for node type labels and compact technical identifiers.
- Do not use more than three text weights on one screen.

## Layout

- Desktop frame: 1280 px wide with 32 px outer padding.
- Main content uses a two-column split: graph workspace takes roughly two thirds; details panel takes one third.
- The existing import form remains above or beside the graph slice and must not be removed.
- Use Auto Layout for every panel, list, toolbar, and component set.
- Repeated spacing must use the token scale. Avoid arbitrary one-off gaps.
- Graph nodes may use fixed mock positions in the first slice, but surrounding UI must remain responsive.
- At narrow widths, graph and details stack vertically; full mobile refinement belongs to the next lesson.

## Elevation & Depth

- Prefer borders and surface contrast over shadows.
- Raised panels may use a subtle shadow only when necessary to separate overlapping graph content.
- Do not use glassmorphism, glowing gradients, or decorative blur.

## Shapes

- Article nodes are compact rounded rectangles.
- Concept nodes are pills or circles depending on label length.
- Cards and panels use medium or large radii; controls use small radii.
- Connection lines are thin and quiet by default, stronger only when connected to the selected node.

## Components

### GraphNode

Variants: `article/default`, `article/selected`, `concept/default`, and `concept/selected`.

Every node contains a visible name and an accessible type label. Selecting a node highlights only its first-degree connections and updates `NodeDetails`.

### NodeDetails

For an article, show title, source, publication date, summary, and related concepts. For a concept, show its name, type, article count, and related article titles.

### ArticleCard

Shows title, source, date, a concise summary, and concept chips. Cards support `default` and `selected` states.

### ConceptChip

Used for compact concept labels and filtering. Variants: `default` and `active`.

### StatePanel

Variants: `loading`, `empty`, and `error`. The empty state explains how to add the first article. The error state offers a retry action without exposing stack traces.

## Do's and Don'ts

### Do

- Use real Russian interface copy and realistic AI/LLM article mock data.
- Preserve the distinction between product requirements, design rules, and mock implementation details.
- Give Figma layers semantic names such as `GraphPreview`, `GraphNode`, and `NodeDetails`.
- Add annotations describing node selection and empty-state behavior.
- Keep the graph readable with three articles, five concepts, and seven edges in the webinar fixture.

### Don't

- Do not create a second React application or replace the existing project structure.
- Do not invent analytics cards, KPI counters, side navigation, authentication, or features absent from the ADR and stories.
- Do not add purple gradients, oversized hero sections, or generic AI-dashboard decoration.
- Do not connect Figma generation to the production database, Ollama, or external APIs.
- Do not treat the Figma frame as proof that the implementation works; Playwright provides behavioral evidence.
