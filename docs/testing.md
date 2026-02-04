# Тестирование SuperLanding

## Обзор

SuperLanding включает в себя различные типы тестов для обеспечения высокого качества кода и стабильности приложения. Мы используем Jest в качестве тестового фреймворка и React Testing Library для тестирования компонентов.

## Типы тестов

### 1. Unit-тесты

Unit-тесты проверяют отдельные компоненты и функции в изоляции. Они расположены рядом с файлами, которые они тестируют, с расширением `.test.tsx` или `.test.ts`.

**Пример**: `src/components/blocks/Hero.test.tsx`

### 2. Smoke-тесты

Smoke-тесты проверяют, что основные функции приложения работают корректно. Они расположены в директории `tests/smoke/`.

**Пример**: `tests/smoke/app.test.tsx`

## Запуск тестов

### Запуск всех тестов

```bash
pnpm test
```

### Запуск тестов в режиме watch

```bash
pnpm test:watch
```

### Запуск только smoke-тестов

```bash
pnpm test:smoke
```

### Запуск скрипта проверки кода

Этот скрипт запускает линтер, проверку типов и все тесты:

```bash
./scripts/check-code.sh
```

## Написание тестов

### Unit-тесты для компонентов

```tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Smoke-тесты

```tsx
import { render, screen } from '@testing-library/react';
import Page from '@/app/some-page';

// Необходимые моки
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('Smoke Test - Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
```

## Моки

Для тестирования мы используем моки для:

1. **next-intl** - чтобы симулировать переводы
2. **next/image** - для компонента Image
3. **Внешние API** - для запросов к Strapi

Примеры моков можно найти в директории `tests/mocks/`.

## Тестирование в CI/CD

Тесты автоматически запускаются в GitHub Actions при каждом push и pull request. Конфигурация находится в файле `.github/workflows/ci.yml`.

## Покрытие тестами

Для проверки покрытия тестами можно использовать команду:

```bash
pnpm test --coverage
```

Целевое покрытие:
- Компоненты UI: 80%
- Утилиты: 90%
- Страницы: 70% 