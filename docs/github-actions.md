# GitHub Actions в SuperLanding

## Обзор

В проекте SuperLanding используется GitHub Actions для автоматизации процессов CI/CD и других задач. Все конфигурации расположены в директории `.github/workflows/`.

## Основные рабочие процессы

### 1. CI/CD (`ci.yml`)

Основной workflow для непрерывной интеграции и развертывания.

**Триггеры:**
- Push в ветки `main` или `master`
- Pull Request в ветки `main` или `master`
- Ручной запуск (workflow_dispatch)

**Этапы:**

#### Lint and Test

```yaml
lint-and-test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'yarn'
    - name: Cache dependencies
      uses: actions/cache@v4
      with:
        path: |
          ~/.yarn
          node_modules/.cache
        key: ${{ runner.os }}-yarn-${{ hashFiles('yarn.lock') }}
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    - name: Lint
      run: pnpm lint
    - name: Type check
      run: pnpm type-check
    - name: Run tests
      run: pnpm test
```

#### Build

```yaml
build:
  runs-on: ubuntu-latest
  needs: lint-and-test
  steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'yarn'
    - name: Cache Next.js build
      uses: actions/cache@v4
      with:
        path: |
          ~/.yarn
          .next/cache
    - name: Build
      run: pnpm build
```

#### Deploy

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
  steps:
    - name: Deploy to Cloudflare Pages
      uses: cloudflare/wrangler-action@v3
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        command: pages deploy .next/ --project-name=superlanding
```

### 2. Bundle Size Analysis (`bundle-analysis.yml`)

Анализирует размер JavaScript бандлов в проекте.

**Триггеры:**
- Push в ветки `main` или `master`
- Pull Request в ветки `main` или `master`
- Ручной запуск (workflow_dispatch)

**Особенности:**
- Использует `@next/bundle-analyzer` для анализа размера бандлов
- Создает таблицу с топ-10 крупнейшими чанками в комментарии к PR
- Сохраняет полные результаты анализа как артефакты

### 3. Update Dependencies (`dependencies.yml`)

Автоматически обновляет зависимости проекта.

**Триггеры:**
- По расписанию (каждый понедельник в 00:00)
- Ручной запуск (workflow_dispatch)

**Особенности:**
- Создает отдельную ветку для обновлений
- Запускает тесты с обновленными зависимостями
- Автоматически создает Pull Request с подробной информацией

### 4. CDN Upload (`cdn-upload-advanced.yml`)

Выгружает статические файлы проекта в CDN.

**Триггеры:**
- Push в ветки `main` или `master`
- Ручной запуск (workflow_dispatch)

**Особенности:**
- Собирает проект с включенным CDN
- Загружает статические файлы в Cloudflare R2
- Проверяет корректность CDN-конфигурации

### 5. Frontend Build (`frontend-advanced.yml`)

Современная сборка и деплой фронтенда.

**Триггеры:**
- Push в определенные ветки (только для выбранных файлов)
- Pull Request
- Ручной запуск (workflow_dispatch)

**Особенности:**
- Кеширование зависимостей и сборки для ускорения процесса
- Примеры различных методов деплоя (Cloudflare, Docker, SSH)
- Уведомления о статусе деплоя

## Переменные окружения и секреты

Для работы GitHub Actions необходимо настроить следующие секреты в репозитории:

- `NEXT_PUBLIC_API_URL`: URL API 
- `NEXT_PUBLIC_BASE_URL`: Базовый URL сайта
- `API_TOKEN`: Токен API
- `CLOUDFLARE_API_TOKEN`: Токен API Cloudflare
- `CLOUDFLARE_ACCOUNT_ID`: ID аккаунта Cloudflare
- `R2_ACCOUNT_ID`: ID аккаунта Cloudflare R2
- `R2_ACCESS_KEY_ID`: Ключ доступа R2
- `R2_SECRET_ACCESS_KEY`: Секретный ключ доступа R2
- `R2_BUCKET_NAME`: Имя бакета R2
- `GOOGLE_TAG_MANAGER_ID`: ID Google Tag Manager

## Кеширование в GitHub Actions

Для оптимизации времени выполнения используется кеширование:

### Кеширование зависимостей

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.yarn
      node_modules/.cache
    key: ${{ runner.os }}-yarn-${{ hashFiles('yarn.lock') }}
```

### Кеширование Next.js сборки

```yaml
- name: Cache Next.js build
  uses: actions/cache@v4
  with:
    path: |
      ~/.yarn
      .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('yarn.lock') }}-${{ hashFiles('src/**/*.{js,jsx,ts,tsx}') }}
```

## Работа с датами в документации и задачах

При использовании дат в задачах и документации рекомендуется использовать placeholder `[SYSTEM_DATE]`, который может быть заменен на текущую системную дату с помощью команды:

```bash
date +"%Y-%m-%d"
```

Это предотвратит использование устаревших дат и обеспечит актуальность временных меток. 