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
      'out/**',
      '.contentlayer/**',
      '.wrangler/**',
      'scripts/optimize-veo3-image.js'
    ]
  },
  {
    files: ['**/*.{js,mjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        process: 'readonly'
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