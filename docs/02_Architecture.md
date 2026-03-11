# Архитектура проекта

## 🏗️ Общая структура

Проект следует принципам **чистой архитектуры** с четким разделением слоев:

```
┌─────────────────────────────────────┐
│         Test Layer (tests/)         │  ← Тестовые сценарии
├─────────────────────────────────────┤
│      Page Object Layer (pages/)     │  ← Абстракция UI
├─────────────────────────────────────┤
│    Infrastructure (utils/config/)   │  ← Утилиты и конфигурация
├─────────────────────────────────────┤
│      Test Data (fixtures/)          │  ← Тестовые данные
└─────────────────────────────────────┘
```

## 📁 Структура директорий

### `/tests` - Тестовые сценарии
**Назначение:** E2E тестовые спецификации

**Файлы:**
- `loginPage.spec.ts` - Тесты логина (9 тестов)
- `assistPage.spec.ts` - Тесты AI ассистента (6 тестов, serial)
- `albumCreating.spec.ts` - Создание альбомов (1 тест)
- `uploadImage.spec.ts` - Загрузка изображений (1 тест)
- `updateImageTags.spec.ts` - Обновление тегов (SKIP)
- `updateTag.spec.ts` - Обновление существующих тегов (SKIP)

**Паттерн:**
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('Test case name', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });
});
```

### `/pages` - Page Object Model
**Назначение:** Абстракция UI элементов и взаимодействий

**Иерархия классов:**
```
BasePage
├── LoginPage
├── MediaPage
├── AlbumPage
├── ImageDetailsPage
└── AssistPage
```

**Принципы:**
- Один Page Object = одна страница/компонент
- Приватные локаторы, публичные методы
- Наследование от BasePage
- Инкапсуляция логики взаимодействия

### `/config` - Конфигурация
**Назначение:** Управление переменными окружения

**Файлы:**
- `env.config.ts` - Экспорт конфигурации и валидация

**Структура:**
```typescript
export const config = {
  credentials: { username, password },
  urls: { base, login },
  test: { headless, timeout }
}
```

### `/fixtures` - Тестовые данные
**Назначение:** Централизованное хранилище данных

**Файлы:**
- `testData.json` - JSON с тестовыми данными

**Категории данных:**
- Пути к файлам (imageFiles, documentFiles)
- Названия по умолчанию (collections, albums)
- Тайм-ауты (short, medium, long)
- Теги (default, media, document, video)

### `/utils` - Утилиты
**Назначение:** Вспомогательные функции

**Файлы:**
- `fileHelpers.ts` - Работа с файловой системой

**Категории методов:**
- Проверка файлов
- Получение информации
- Работа с путями
- Создание/удаление

### `/test-files` - Тестовые файлы
**Назначение:** Файлы для тестирования загрузки

**Структура:**
```
test-files/
└── images/
    ├── test-image.png
    ├── test-image.jpeg
    ├── test-photo.jpg
    └── ...
```

## 🎯 Ключевые паттерны

### 1. Page Object Model

**Философия:** Разделение "что делать" (тесты) и "как делать" (page objects)

**Пример:**
```typescript
// ✅ В тесте - высокоуровневые действия
await loginPage.login(username, password);
expect(await loginPage.isLoggedIn()).toBe(true);

// ❌ НЕ так - низкоуровневая логика в тесте
await page.goto('/login');
await page.fill('[data-testid="username"]', username);
await page.fill('[data-testid="password"]', password);
await page.click('[data-testid="login-btn"]');
```

### 2. Compose Methods

**Принцип:** Комбинирование простых действий в сложные флоу

**Пример:**
```typescript
// Atomic methods (приватные/публичные)
async enterUsername(username: string) { ... }
async enterPassword(password: string) { ... }
async clickLoginButton() { ... }

// Compose method (публичный)
async login(username: string, password: string) {
  await this.navigateToLogin();
  await this.enterUsername(username);
  await this.enterPassword(password);
  await this.clickLoginButton();
  await this.waitForPageLoad();
}
```

### 3. DRY (Don't Repeat Yourself)

**Реализация через BasePage:**
- 24 переиспользуемых метода
- Все Page Objects наследуются
- Избежание дублирования кода

### 4. Централизация данных

**testData.json + config:**
```typescript
// ✅ Централизованно
const imagePath = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.png.path);
const { username, password } = config.credentials;

// ❌ Хардкод
const imagePath = '/Users/alex/test-image.png';
const username = 'alex@test.com';
```

### 5. Изоляция окружений

**.env файлы:**
- `.env` - локальные креденшиалы (gitignored)
- `.env.example` - шаблон для команды

## 🔄 Поток выполнения теста

```
┌─────────────────────────┐
│   Запуск теста          │
│   (npm test)            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Playwright config      │
│  - Load .env            │
│  - Setup browser        │
│  - Apply settings       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Test spec              │
│  - beforeEach/beforeAll │
│  - Test execution       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Page Objects           │
│  - Locators             │
│  - Actions              │
│  - Assertions helpers   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Browser interaction    │
│  - Playwright API       │
│  - Real browser actions │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Results & Reports      │
│  - HTML report          │
│  - Screenshots          │
│  - Videos               │
└─────────────────────────┘
```

## 🔐 Управление аутентификацией

### Проблема: httpOnly cookies

KalSense использует httpOnly cookies, которые:
- ❌ Не сохраняются через `storageState`
- ❌ Не могут быть переиспользованы между тестами

### Решение: Прямой логин

**Каждый тест выполняет логин:**
```typescript
test('Some test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);
  expect(await loginPage.isLoggedIn()).toBe(true);
  
  // ... остальная логика теста
});
```

**Исключение - Serial tests:**
```typescript
test.describe.serial('Assist tests', () => {
  let page: Page;
  
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    
    // Логин один раз для всех тестов
    await loginPage.login(username, password);
  });
  
  // Тесты используют общий page/context
});
```

## 🔧 Конфигурация выполнения

### Последовательное выполнение

**Текущая настройка:**
```typescript
// playwright.config.ts
fullyParallel: false  // Тесты в файле последовательно
workers: 1            // Один worker для всех файлов
```

**Причина:** Предотвращение конфликтов между тестами

**Компромисс:** Медленнее, но стабильнее

### Retry стратегия

```typescript
retries: process.env.CI ? 2 : 0
```
- В CI: 2 повтора при падении
- Локально: без повторов (быстрый feedback)

## 📊 Диаграмма зависимостей

```
playwright.config.ts
    │
    ├─> env.config.ts
    │       └─> .env
    │
    └─> tests/*.spec.ts
            │
            ├─> pages/*Page.ts
            │       └─> BasePage.ts
            │
            ├─> fixtures/testData.json
            │
            └─> utils/fileHelpers.ts
```

## 🎨 Принципы дизайна

### 1. Single Responsibility
Каждый класс/функция делает одну вещь хорошо

### 2. Open/Closed Principle
Открыты для расширения, закрыты для модификации (BasePage)

### 3. Dependency Inversion
Зависимость от абстракций (Page Objects), не от деталей

### 4. Interface Segregation
Клиенты не зависят от неиспользуемых методов

### 5. DRY (Don't Repeat Yourself)
Переиспользование через наследование и композицию

---

**Итог:** Чистая, масштабируемая архитектура, готовая для расширения
