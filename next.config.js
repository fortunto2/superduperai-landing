const { withContentlayer } = require('next-contentlayer2');

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
  // Устанавливаем вывод в standalone для оптимальной работы с Cloudflare
  output: 'standalone',
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
      '@': './src',
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
  webpack: (config, { isServer }) => {
    // Помогает с совместимостью MDX в Cloudflare
    if (isServer) {
      config.externals = [...config.externals, 'esbuild'];
    }

    return config;
  },
  // Генерируем все страницы во время сборки, чтобы избежать eval() в рантайме
  staticPrefetch: true,
  staticPageGenerationMode: 'force',
};

module.exports = withContentlayer(nextConfig); 