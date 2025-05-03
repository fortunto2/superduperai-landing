import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  js.configs.recommended,
  ...compat.extends('eslint:recommended'),
  ...tseslint.configs.recommended,
  // Плагин Next.js несовместим с ESLint 9.x, поэтому используем только базовые правила
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),
  {
    ignores: [
      '.next/**', 
      'node_modules/**',
      'public/**',
      '**/*.config.js',
      'next-env.d.ts'
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
    // Настройки для React
    settings: {
      react: {
        version: 'detect',
      },
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
      }],
    }
  }
]; 