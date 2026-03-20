# CI/CD - GitHub Actions

## 📄 .github/workflows/playwright.yml

### Текущий режим: Ручной запуск

```yaml
on:
  # push:                      # ЗАКОММЕНТИРОВАНО
  #   branches: [ main, master ]
  # pull_request:              # ЗАКОММЕНТИРОВАНО
  #   branches: [ main, master ]
  workflow_dispatch:           # Только ручной запуск
```

**Как запустить:**
1. GitHub → Actions
2. Playwright Tests
3. Run workflow

## 🔧 Pipeline шаги

### 1. Checkout кода
```yaml
- uses: actions/checkout@v4
```

### 2. Setup Node.js
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: lts/*
```

### 3. Установка зависимостей
```yaml
- name: Install dependencies
  run: npm ci
```

### 4. Установка браузеров
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
```

### 5. Запуск тестов
```yaml
- name: Run Playwright tests
  run: npx playwright test
```

### 6. Загрузка артефактов
```yaml
- uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

## ⚙️ Настройки

- **Timeout:** 60 минут
- **Runner:** ubuntu-latest
- **Артефакты:** 30 дней хранения
- **Условие загрузки:** `!cancelled()` - даже при падении

## 🔄 Как включить автозапуск

Раскомментировать:
```yaml
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  # workflow_dispatch:  # Закомментировать
```

## 📊 Артефакты

После выполнения доступны:
- HTML отчёт (playwright-report/)
- Скриншоты падений
- Видео падений
- Trace файлы

---

**Статус:** Готов к использованию, ручной запуск для контроля
