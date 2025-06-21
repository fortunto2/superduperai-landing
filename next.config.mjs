/* eslint-env node */
import { withContentlayer } from 'next-contentlayer2';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Отключаем встроенную проверку ESLint при сборке,
    // так как мы будем запускать линтер отдельно
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true
  },
  // Use standalone output for optimized builds unless NEXT_STANDALONE is "false"
  output: process.env.NEXT_STANDALONE === 'false' ? undefined : 'standalone',
  // Настройки экспериментальных функций
  experimental: {
    // Оптимизация импортов пакетов
    optimizePackageImports: [
      'react', 
      'react-dom',
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-slot',
      'clsx',
      'tailwind-merge'
    ]
  },
  // Внешние пакеты для серверных компонентов
  serverExternalPackages: ['mdx-bundler'],
  // Конфигурация для Turbopack в Next.js 15.3
  turbopack: {
    // Определяем алиасы для путей
    resolveAlias: {
      '@': path.resolve('./src'),
    },
    // Расширения файлов для автоматического разрешения
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  // Увеличиваем таймаут для статической генерации
  staticPageGenerationTimeout: 120,
  // Настройки производительности
  poweredByHeader: false, // Удаляем заголовок X-Powered-By
  // Отключаем source maps в production
  productionBrowserSourceMaps: false,
  // Настройки для Cloudflare
  webpack: (config, { isServer, webpack }) => {
    // Помогает с совместимостью MDX в Cloudflare
    if (isServer) {
      config.externals = [...config.externals, 'esbuild'];
    }
    
    // Добавляем polyfill для process в браузере
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: 'process/browser',
      };
      
      // Добавляем ProvidePlugin для глобального доступа к process
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        })
      );
    }
    
    // Игнорируем предупреждения ContentLayer
    config.infrastructureLogging = {
      level: 'error',
      ...config.infrastructureLogging,
    };
    
    return config;
  },
};

export default withContentlayer(nextConfig);