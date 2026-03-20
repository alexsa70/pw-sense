# Playwright Configuration

## 📄 playwright.config.ts

### Основные настройки

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,  // Последовательное выполнение
  workers: 1,            // Один worker
  retries: process.env.CI ? 2 : 0,
  timeout: 30000,
  
  use: {
    baseURL: 'https://kal-sense.prod.kaleidoo-dev.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## ⚙️ Ключевые конфигурации

### Global Setup (ОТКЛЮЧЕН)
```typescript
// globalSetup: require.resolve('./global-setup.ts'),
```

**Причина отключения:** KalSense использует httpOnly cookies, которые не поддерживаются `storageState`

### Параллелизм (ОТКЛЮЧЕН)
```typescript
fullyParallel: false
workers: 1
```

**Причина:** Предотвращение конфликтов между тестами

**Компромисс:** Медленнее, но стабильнее

### Retry стратегия
```typescript
retries: process.env.CI ? 2 : 0
```

- В CI: 2 повтора при падении
- Локально: без повторов (быстрый feedback)

### Timeouts
```typescript
timeout: 30000                 // Максимум на тест
expect: { timeout: 5000 }      // На assertions
navigationTimeout: 15000       // На навигацию
actionTimeout: 10000           // На действия
```

### Артефакты
```typescript
screenshot: 'only-on-failure'      // Скриншоты при падении
video: 'retain-on-failure'         // Видео при падении  
trace: 'on-first-retry'            // Trace при retry
```

### Reporters
```typescript
reporter: [
  ['html'],
  ['list'],
  ['json', { outputFile: 'test-results/results.json' }]
]
```

## 🔧 Environment Variables

```typescript
baseURL: process.env.BASE_URL || 'https://kal-sense.prod.kaleidoo-dev.com'
timeout: parseInt(process.env.TIMEOUT || '30000', 10)
```

Загрузка через `dotenv.config()`

## 📊 Projects

```typescript
projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      // storageState: 'auth.json'  // DISABLED
    },
  },
]
```

Firefox и WebKit закомментированы

---

**Итог:** Конфигурация оптимизирована для стабильности, не для скорости
