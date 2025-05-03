# Правила создания тезисных Canvas-схем

Данный документ определяет стандарты создания наглядных и информативных схем в формате JSON Canvas с фокусом на тезисный стиль и лучшие практики инфографики.

## Основные принципы
- **Тезисность**: минимум текста, только ключевые идеи
- **Ясная иерархия**: структура сверху вниз с минимумом пересечений
- **Визуальная ясность**: избегать сложных вложенных диаграмм
- **Последовательность**: единый стиль для всей схемы

## Структура Canvas-схемы

### Макет
- Предпочтительнее вертикальная организация (сверху вниз)
- Максимум 2 уровня вложенности
- Не более 5-7 основных блоков
- Избегать пересечений линий

### Содержание
- Пункты в формате "проблема/решение" или "вопрос/ответ"
- Использовать таблицы для сравнения вместо отдельных блоков
- Маркированные списки вместо больших абзацев
- Выделение ключевых чисел и метрик

### Цветовое кодирование
- Использовать назначение цветов:
  - `"1"` (красный): важные предостережения, отрицательные аспекты
  - `"3"` (желтый): выводы, рекомендации
  - `"4"` (зеленый): нейтральная информация, примеры
  - `"5"` (голубой): позитивные особенности, преимущества
  - `"6"` (фиолетовый): заголовки, структурные элементы

## Типы узлов

### Для концептуальных схем
```json
{
  "id": "concept-node",
  "type": "text",
  "x": 0, 
  "y": 0,
  "width": 300,
  "height": 150,
  "color": "6",
  "text": "## Ключевая концепция\n- Тезис 1\n- Тезис 2\n- Тезис 3"
}
```

### Для сравнительных таблиц
```json
{
  "id": "comparison-node",
  "type": "text",
  "x": 0,
  "y": 0,
  "width": 600,
  "height": 200,
  "color": "4",
  "text": "## Сравнение\n\n| Параметр | Вариант A | Вариант B |\n|----------|----------|----------|\n| Метрика 1 | Значение | Значение |\n| Метрика 2 | Значение | Значение |"
}
```

## Шаблоны и организация

### 1. Для сравнения платформ/технологий
```
[Заголовок]
   |
[Таблица сравнения ключевых параметров]
   |
   ├──[Преимущества A]    [Преимущества B]
   |
   ├──[Недостатки A]      [Недостатки B]
   |
   └──[Рекомендации по выбору/использованию]
```

### 2. Для процессных схем
```
[Проблема/Задача]
   |
[Этап 1] → [Этап 2] → [Этап 3]
   |           |           |
[Детали]   [Детали]    [Детали]
   |
[Результат/Заключение]
```

## Рекомендации по реализации

1. Избегать избыточной вложенности (не более 2 уровней)
2. Использовать символы для ускорения восприятия (✓, ✗, →)
3. Применять таблицы вместо множества разрозненных блоков
4. Визуально группировать связанные элементы
5. Проверять схему на интуитивную понятность "с первого взгляда"

## JSON Canvas Structure

Every canvas file must contain:

```json
{
  "nodes": [],
  "edges": []
}
```

## Node Types and Conversion Rules

### 1. Text Nodes
Create text nodes for:
- Paragraphs
- Headings (H2-H6)
- Code blocks
- Lists

Structure:
```json
{
  "id": "unique-id",
  "type": "text",
  "x": 0,
  "y": 0,
  "width": 300,
  "height": 100,
  "color": "4",
  "text": "Content in Markdown syntax"
}
```

### 2. File Nodes
Create file nodes for:
- Images
- File attachments/references

Structure:
```json
{
  "id": "unique-id",
  "type": "file",
  "x": 0,
  "y": 0,
  "width": 300,
  "height": 200,
  "file": "path/to/file.ext",
  "subpath": "#optional-heading-reference"
}
```

### 3. Link Nodes
Create link nodes for:
- URLs
- External references

Structure:
```json
{
  "id": "unique-id",
  "type": "link",
  "x": 0,
  "y": 0,
  "width": 300,
  "height": 100,
  "url": "https://example.com"
}
```

### 4. Group Nodes
Create group nodes for:
- H1 headings
- Major document sections

Structure:
```json
{
  "id": "unique-id",
  "type": "group",
  "x": 0,
  "y": 0,
  "width": 800,
  "height": 600,
  "label": "Section Title"
}
```

## Edge Rules

Create edges for:
1. Hierarchical relationships (headings to subheadings)
2. Referenced content (linked elements)
3. Logical flow connections

Structure:
```json
{
  "id": "unique-id",
  "fromNode": "source-node-id",
  "fromSide": "bottom",
  "fromEnd": "none",
  "toNode": "target-node-id",
  "toSide": "top",
  "toEnd": "arrow",
  "color": "5",
  "label": "optional relationship label"
}
```

## Layout Rules

1. Position nodes based on document hierarchy
2. Calculate x/y coordinates to avoid overlaps
3. Set z-index by placing nodes in the nodes array in ascending order
4. Group related nodes in proximity
5. Top-to-bottom flow for hierarchical relationships

## Color Coding

Use preset colors for different node types:
- `"1"` (red): Critical warnings, errors
- `"2"` (orange): Important notes, cautions
- `"3"` (yellow): Highlighted information
- `"4"` (green): Regular content, standard nodes
- `"5"` (cyan): Code blocks, technical content
- `"6"` (purple): Special concepts, definitions

## ID Generation

Generate unique IDs using one of these methods:
1. UUID v4
2. Timestamp-based IDs
3. Content hash + type prefix

Example: `text-a1b2c3d4-e5f6`

## Filename Convention

The output canvas file should use the original markdown filename with the `.canvas` extension.

Example: `documentation.md` → `documentation.canvas` 