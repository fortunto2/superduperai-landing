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
  // Отключаем динамический импорт для уменьшения размера бандла
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
    ],
    // Включаем сжатие вывода для уменьшения размера JS
    compress: true
  },
  // Увеличиваем таймаут для статической генерации
  staticPageGenerationTimeout: 120,
  // Настройки производительности
  poweredByHeader: false, // Удаляем заголовок X-Powered-By
  // Настройки сжатия для уменьшения размера бандла
  swcMinify: true,
  // Оптимизация изображений
  productionBrowserSourceMaps: false, // Отключаем source maps в production
};

module.exports = nextConfig; 