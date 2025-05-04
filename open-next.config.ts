import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Используем базовую конфигурацию
// ПРИМЕЧАНИЕ: Проблема с алиасами для Next.js 15.3 требует обновления @opennextjs/cloudflare
// Временное решение: добавить патч файл или модификацию сборки в пакет скриптов
export default defineCloudflareConfig(); 