# GitHub Actions Workflows

Эта директория содержит конфигурации GitHub Actions workflow для проекта SuperLanding.

## Доступные Workflows

### 1. CI/CD (`ci.yml`)

Основной workflow для непрерывной интеграции и развертывания.

**Триггеры:**
- Push в ветки `main` или `master`
- Pull Request в ветки `main` или `master`
- Ручной запуск (workflow_dispatch)

**Этапы:**
1. Lint and Test - проверка кода линтером, типов и запуск тестов
2. Build - сборка проекта
3. Deploy - деплой на Cloudflare Pages (только для `main` и `master`)

### 2. Bundle Size Analysis (`bundle-analysis.yml`)

Анализирует размер JavaScript бандлов.

**Триггеры:**
- Push в ветки `main` или `master`
- Pull Request в ветки `main` или `master`
- Ручной запуск (workflow_dispatch)

**Что делает:**
1. Настраивает Node.js окружение
2. Устанавливает зависимости проекта
3. Устанавливает `@next/bundle-analyzer`
4. Собирает проект с анализом бандлов
5. Загружает результаты анализа как артефакты GitHub Actions
6. Добавляет комментарий к PR с результатами анализа

### 3. Update Dependencies (`dependencies.yml`)

Автоматически обновляет зависимости проекта.

**Триггеры:**
- По расписанию (каждый понедельник в 00:00)
- Ручной запуск (workflow_dispatch)

**Что делает:**
1. Проверяет наличие устаревших зависимостей
2. Создает новую ветку
3. Обновляет зависимости до последних версий
4. Проверяет код после обновления
5. Создает Pull Request с обновлениями

### 4. CDN Upload (`cdn-upload-advanced.yml`)

Выгружает статические файлы проекта в CDN.

**Триггеры:**
- Push в ветки `main` или `master`
- Ручной запуск (workflow_dispatch)

**Что делает:**
1. Собирает проект в production режиме
2. Подготавливает статические файлы
3. Загружает файлы в Cloudflare R2 хранилище

### 5. Frontend Build (`frontend-advanced.yml`)

Современный workflow для сборки и деплоя фронтенда.

**Триггеры:**
- Push в ветки `main`, `master` или `dev` (только для определенных путей)
- Pull Request в ветки `main`, `master` или `dev`
- Ручной запуск (workflow_dispatch)

**Этапы:**
1. Lint and Build - проверка, тестирование и сборка
2. Deploy - развертывание приложения (с примерами различных методов деплоя)

## Как использовать

Большинство workflow запускаются автоматически при настроенных триггерах. Для ручного запуска:

1. Перейдите на вкладку Actions в GitHub репозитории
2. Выберите нужный workflow
3. Нажмите "Run workflow"
4. Выберите ветку и запустите

## Переменные окружения и секреты

Для корректной работы workflow необходимо настроить следующие секреты в GitHub:

- `NEXT_PUBLIC_API_URL` - URL API 
- `NEXT_PUBLIC_BASE_URL` - Базовый URL сайта
- `API_TOKEN` - Токен API
- `CLOUDFLARE_API_TOKEN` - Токен API Cloudflare
- `CLOUDFLARE_ACCOUNT_ID` - ID аккаунта Cloudflare
- `R2_ACCOUNT_ID` - ID аккаунта Cloudflare R2
- `R2_ACCESS_KEY_ID` - Ключ доступа R2
- `R2_SECRET_ACCESS_KEY` - Секретный ключ доступа R2
- `R2_BUCKET_NAME` - Имя бакета R2
- `GOOGLE_TAG_MANAGER_ID` - ID Google Tag Manager

## Примечание

При использовании дат в задачах и документации используйте placeholder `[SYSTEM_DATE]`, который будет заменен на текущую системную дату с помощью команды `date +"%Y-%m-%d"` в скриптах автоматизации. 