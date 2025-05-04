import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Используем NEXT_BYPASS_ALIAS_CHECK=1 в скриптах сборки для обхода проблемы с алиасами
export default defineCloudflareConfig(); 