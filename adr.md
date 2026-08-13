# Architecture Decision Record: Knowledge Graph News App

## Статус
Принято

## Контекст
Личный инструмент для систематизации новостных статей по AI/LLM с извлечением понятий и инструментов, визуализацией связей в виде графа.

## Решения

### 1. Архитектура приложения
**Выбор: Монолитное приложение**

Express сервер раздаёт React-бандл через `express.static`. Один процесс, простая разработка и деплой.

```
┌─────────────────────────────────────────────────┐
│                  Browser                        │
│  ┌─────────────────────────────────────────┐   │
│  │           React App                      │   │
│  │  ┌───────────┐  ┌───────────────────┐   │   │
│  │  │  Article  │  │  Graph View       │   │   │
│  │  │  Form     │  │  (Cytoscape.js)   │   │   │
│  │  └───────────┘  └───────────────────┘   │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                      │ HTTP
                      ▼
┌─────────────────────────────────────────────────┐
│              Express Server (port 3000)         │
│  ┌─────────────┐  ┌────────────────────────┐   │
│  │  REST API   │  │  OpenRouter Client     │   │
│  │  /articles  │  │  (OpenRouter API)       │   │
│  │  /concepts  │  │  - analyze article      │   │
│  │  /graph     │  │  - extract concepts     │   │
│  └─────────────┘  └────────────────────────┘   │
│                      │                          │
│                      ▼                          │
│  ┌─────────────────────────────────────────┐   │
│  │           SQLite (better-sqlite3)        │   │
│  │  - articles                              │   │
│  │  - concepts                              │   │
│  │  - article_concepts (связи)              │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 2. Стек технологий
| Слой | Технология | Обоснование |
|------|------------|-------------|
| Frontend | React 18 + Vite | Быстрая сборка, HMR |
| Graph Visualization | Cytoscape.js | Специализированная для графов, много layout-алгоритмов |
| Backend | Express.js | Минималистичный, знакомый стек |
| Database | SQLite + better-sqlite3 | Локальная БД, синхронный API, простота |
| AI | OpenRouter | Единый API и доступ к бесплатным моделям через `openrouter/free` |

### 3. База данных
**Схема SQLite:**

```sql
-- Статьи
CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    author TEXT,
    published_date DATE,
    tags TEXT,              -- JSON массив строк
    summary TEXT,          -- AI-резюме
    sentiment TEXT,        -- позитивный/нейтральный/негативный
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Понятия и инструменты
CREATE TABLE concepts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT DEFAULT 'concept'  -- 'concept' | 'tool' | 'person' | 'org'
);

-- Связи статей и понятий
CREATE TABLE article_concepts (
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, concept_id)
);
```

### 4. REST API Endpoints
```
POST   /api/articles          # Создать статью с AI-анализом
GET    /api/articles          # Список статей (с пагинацией)
GET    /api/articles/:id      # Детали статьи
DELETE /api/articles/:id      # Удалить статью

POST   /api/articles/:id/analyze  # Переанализировать статью через OpenRouter
PUT    /api/articles/:id/concepts # Обновить связи с понятиями

GET    /api/concepts          # Список всех понятий
GET    /api/concepts/:id      # Понятие со связанными статьями

GET    /api/graph             # Данные для графа (nodes + edges)
```

### 5. OpenRouter Integration
**Модель:** `openrouter/free` — роутер автоматически выбирает одну из доступных бесплатных моделей. При необходимости можно зафиксировать конкретную бесплатную модель с суффиксом `:free`.

Для доступа требуется API-ключ в переменной окружения `OPENROUTER_API_KEY`. Ключ используется только на Express-сервере и не передаётся во frontend.

**Промпт для извлечения понятий:**
```
Проанализируй следующую статью и извлеки:
1. Ключевые понятия (технологии, методы, концепции)
2. Упомянутые инструменты (библиотеки, фреймворки, сервисы)
3. Краткое резюме (2-3 предложения)
4. Тональность (позитивная/нейтральная/негативная)

Формат ответа (JSON):
{
  "concepts": ["понятие1", "понятие2"],
  "tools": ["инструмент1", "инструмент2"],
  "summary": "краткое резюме",
  "sentiment": "neutral"
}

Текст статьи:
{article_text}
```

**Вызов OpenRouter:**
```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openrouter/free',
    messages: [
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' }
  })
});

if (!response.ok) {
  throw new Error(`OpenRouter request failed: ${response.status}`);
}

const data = await response.json();
const analysis = JSON.parse(data.choices[0].message.content);
```

### 6. Frontend Components
```
src/
├── App.jsx              # Главный компонент
├── components/
│   ├── ArticleForm.jsx  # Форма добавления статьи
│   ├── ConceptEditor.jsx # Редактор предложенных понятий
│   ├── GraphView.jsx    # Cytoscape граф
│   ├── ArticleList.jsx  # Список статей (опционально)
│   └── NodeDetails.jsx  # Детали узла при клике
├── api/
│   └── articles.js      # API клиент
└── main.jsx
```

### 7. Cytoscape.js Configuration
```javascript
const cyStyles = [
  {
    selector: 'node[type="article"]',
    style: {
      'background-color': '#6699ff',
      'label': 'data(label)',
      'shape': 'rectangle'
    }
  },
  {
    selector: 'node[type="concept"]',
    style: {
      'background-color': '#ff9966',
      'label': 'data(label)',
      'shape': 'ellipse'
    }
  },
  {
    selector: 'node[type="tool"]',
    style: {
      'background-color': '#66cc99',
      'label': 'data(label)',
      'shape': 'diamond'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#999',
      'target-arrow-color': '#999'
    }
  }
];

// Layout для связного графа
const layout = { name: 'cose', animate: true };
```

## Метрики успеха MVP
- Добавление статьи занимает < 30 секунд
- AI-анализ занимает < 10 секунд
- Граф загружается < 2 секунд при 100+ статьях
- Приложение работает локально, но для AI-анализа требуется интернет-доступ к OpenRouter

## Следствия
- Требуется аккаунт OpenRouter и переменная окружения `OPENROUTER_API_KEY`
- Используется `openrouter/free`; состав бесплатных моделей, их доступность и лимиты могут меняться
- Без доступа к OpenRouter сохранённые статьи и граф остаются доступны, но новый AI-анализ не работает
- База данных хранится в файле `data/articles.db`
- React-бандл собирается Vite и раздаётся Express

## Альтернативы, рассмотренные и отклонённые
| Выбор | Альтернатива | Причина отклонения |
|-------|--------------|-------------------|
| SQLite | Neo4j | Избыточен для MVP, сложнее установить |
| Cytoscape.js | React Flow | Меньше layout-алгоритмов для графов |
| OpenRouter | Ollama | Требует локальной установки модели и достаточных ресурсов компьютера |
| Монолит | Раздельные сервисы | Медленнее разработка MVP |
