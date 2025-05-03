# Настройка ESLint 9.x для Next.js проекта

Этот документ описывает правильную настройку ESLint 9.x в проекте Next.js, решение типичных проблем и исключение генерируемых директорий из проверки.

## Проблема

ESLint 9.x использует новый формат конфигурации и больше не поддерживает устаревшие `.eslintrc.*` файлы напрямую. Многие плагины еще не обновлены для работы с новым форматом.

## Решение

### 1. Установка зависимостей

```bash
pnpm add -d eslint@latest @eslint/js @eslint/eslintrc typescript-eslint
```

### 2. Создание файла в новом формате

Создайте файл `eslint.config.mjs` в корне проекта:

```javascript
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Создаем полную конфигурацию в формате .eslintrc.js
const eslintrcConfig = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  settings: {
    react: {
      version: '19.0' // Явно указываем версию React
    }
  }
};

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  js.configs.recommended,
  ...compat.config(eslintrcConfig), // Используем полную конфигурацию
  ...tseslint.configs.recommended,
  {
    ignores: [
      '.next/**', 
      'node_modules/**',
      'public/**',
      '**/*.config.js',
      'next-env.d.ts',
      '.open-next/**',
      'out/**'
    ]
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    // Настройки для React дублируем здесь для надежности
    settings: {
      react: {
        version: '19.0' // Та же версия, что и выше
      }
    },
    rules: {
      // Отключаем правила Next.js, которые вызывают ошибки
      '@next/next/no-duplicate-head': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-page-custom-font': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Разрешаем неиспользуемые переменные в определенных случаях
      '@typescript-eslint/no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_', 
        'ignoreRestSiblings': true 
      }]
    }
  }
]; 
```

### 3. Настройка скрипта в package.json

```json
"scripts": {
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
}
```

## Ключевые аспекты

### Указание версии React

Согласно [документации eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react#configuration), важно правильно указать версию React для корректной работы правил. Это можно сделать двумя способами:

1. Через `version: 'detect'` (автоматическое определение, но может не работать с ESLint 9.x)
2. Через явное указание версии: `version: '19.0'` (рекомендуется)

Важно: настройки React должны передаваться через объект `eslintrcConfig` в метод `compat.config()`, а не через `extends` напрямую, чтобы избежать предупреждения "React version not specified".

### Использование FlatCompat

Модуль `FlatCompat` из пакета `@eslint/eslintrc` позволяет использовать существующие плагины и конфигурации, которые еще не обновлены для работы с новым форматом ESLint 9.x.

### Игнорирование директорий

Крайне важно исключить из проверки директории, которые содержат сгенерированный код:

- `.next/**` - сборка Next.js
- `.open-next/**` - сборка OpenNext для Cloudflare
- `out/**` - статичная сборка
- `node_modules/**` - зависимости

Это необходимо, поскольку минифицированный и сгенерированный код содержит много нарушений правил ESLint, которые бессмысленно исправлять.

### Настройка для TypeScript и React

Для правильной работы с TypeScript и React важно добавить соответствующие настройки:

```javascript
languageOptions: {
  ecmaVersion: 2022,
  sourceType: 'module',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
},
settings: {
  react: {
    version: '19.0',
  },
}
```

## Типичные проблемы и их решения

### Предупреждение "React version not specified in eslint-plugin-react settings"

Это предупреждение возникает, когда ESLint не может автоматически определить версию React. Несмотря на наличие настройки `version: 'detect'`, она может не работать корректно с ESLint 9.x. Решение — явно указать версию React:

```javascript
settings: {
  react: {
    version: '19.0', // Укажите вашу версию React
  },
},
```

Пример обновленного кода:

```javascript
{
  files: ['**/*.{js,jsx,ts,tsx}'],
  // ... остальные настройки ...
  settings: {
    react: {
      version: '19.0', // Или '19.1' в зависимости от используемой версии
    },
  },
  // ... правила ...
}
```

### Ошибка "context.getSource is not a function"

Эта ошибка возникает, когда плагин `react-hooks` пытается проверить код, который не может быть разобран правильно. Решение — исключить проблемные директории из проверки.

### Другие плагины, несовместимые с ESLint 9.x

Не все плагины обновлены для работы с ESLint 9.x. Для некоторых плагинов может потребоваться установка более старых версий или использование `FlatCompat`.

## Запуск линтера

```bash
pnpm lint
```

## Полезные ресурсы

- [Официальная документация ESLint 9.x](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Документация FlatCompat](https://github.com/eslint/eslintrc)
- [typescript-eslint](https://typescript-eslint.io/getting-started) 