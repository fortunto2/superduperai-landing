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
  // Отключаем инъекцию CSP для совместимости с Cloudflare (перенесено из experimental)
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
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
  // Отключаем инъекцию CSP для работы с RSC на Cloudflare
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-NextJS-Skip-CSP',
            value: '1',
          },
        ],
      },
    ];
  },
  // Необходимо для совместимости с Cloudflare Pages
  webpack: (config, { dev, isServer }) => {
    // Предотвращаем проблемы с алиасами
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'next/dist/compiled/node-fetch': false,
        'next/dist/compiled/ws': false,
        'next/dist/compiled/edge-runtime': false
      });
    }
    return config;
  }
};

module.exports = withContentlayer(nextConfig); 