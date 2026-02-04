# Руководство по созданию компонентов

## Структура компонента

Все компоненты в проекте SuperLanding должны следовать единой структуре для обеспечения последовательности и облегчения поддержки.

### Шаблон компонента
```tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
// Другие импорты...

interface Props {
  locale: string;
  // Другие пропсы...
}

export default function ComponentName({ locale, ...props }: Props) {
  // Получение текстов из локализации
  const t = useTranslations('namespace.component');
  
  // Логика компонента...
  
  return (
    <section className="стандартные-классы" id="component-id">
      <div className="container mx-auto px-4 md:px-6">
        {/* Содержимое компонента */}
      </div>
    </section>
  );
}
```

## Стандарты именования

- **Файлы компонентов:** PascalCase (например, `HomeHero.tsx`)
- **Функции компонентов:** PascalCase (например, `export default function HomeHero()`)
- **Переменные:** camelCase (например, `const isVisible = true`)
- **Константы:** SCREAMING_SNAKE_CASE (например, `const MAX_ITEMS = 10`)
- **Идентификаторы интерфейсов:** PascalCase с префиксом I (например, `interface IProps`)


## CSS и стилизация

Мы используем shadcn и Tailwind CSS для стилизации компонентов:

- Используйте утилиты Tailwind вместо создания пользовательских CSS классов
- Для повторяющихся комбинаций классов создавайте переиспользуемые переменные:
  ```tsx
  const cardStyles = "p-6 bg-white rounded-xl shadow-md";
  ```
- Для отзывчивости используйте префиксы Tailwind:
  ```tsx
  className="text-base md:text-lg lg:text-xl"
  ```

## Структура блочных компонентов

Все компоненты блоков должны имеет следующую структуру:

```tsx
<section className="py-16 bg-[цвет] md:py-24" id="[уникальный-id]">
  <div className="container mx-auto px-4 md:px-6">
    <!-- Заголовок секции -->
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 md:text-4xl">
        {t('title')}
      </h2>
      <!-- Опциональный подзаголовок -->
    </div>
    
    <!-- Содержимое секции -->
    
    <!-- Опциональная CTA в конце секции -->
  </div>
</section>
```

## Добавление нового компонента

1. Создайте файл в соответствующей директории (например, `src/components/blocks/`)
2. Добавьте необходимые импорты (React, next-intl и т.д.)
3. Определите интерфейс Props
4. Реализуйте компонент, используя архитектуру, описанную выше
5. Добавьте локализацию в соответствующие файлы (`src/messages/en.json`, `src/messages/ru.json`)
6. Импортируйте и используйте компонент на странице (`src/app/[locale]/page.tsx`)
7. Обновите файл задач (`docs/tasks.md`), чтобы отметить прогресс

## Проверки перед коммитом

Перед коммитом нового или обновленного компонента проверьте:

1. Все ли строки локализованы (нет ли захардкоженных текстов)
2. Правильно ли работает компонент во всех поддерживаемых локалях
3. Пройдены ли проверки линтера: `pnpm lint`
4. Отзывчив ли дизайн на разных разрешениях экрана 