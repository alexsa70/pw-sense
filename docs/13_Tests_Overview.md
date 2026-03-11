# Тестовые сценарии - Обзор

## 📁 Структура директории tests/

```
tests/
├── loginPage.spec.ts           # Тесты логина (9 тестов)
├── assistPage.spec.ts          # Тесты AI ассистента (6 тестов, serial)
├── albumCreating.spec.ts       # Создание альбомов (1 тест)
├── uploadImage.spec.ts         # Загрузка изображений (1 тест)
├── updateImageTags.spec.ts     # Обновление тегов после загрузки (SKIP)
└── updateTag.spec.ts           # Обновление тегов существующих (SKIP)
```

## 📊 Статистика тестов

| Файл | Активных | Пропущено | Timeout | Serial |
|------|----------|-----------|---------|--------|
| loginPage.spec.ts | 8 | 1 | 30s | ❌ |
| assistPage.spec.ts | 6 | 0 | 30s | ✅ |
| albumCreating.spec.ts | 1 | 0 | 30s | ❌ |
| uploadImage.spec.ts | 1 | 0 | 90s | ❌ |
| updateImageTags.spec.ts | 0 | 1 | 100s | ❌ |
| updateTag.spec.ts | 0 | 1 | 100s | ❌ |
| **Итого** | **17** | **2** | - | - |

## 🎨 Паттерны в тестах

### 1. AAA Pattern (Arrange-Act-Assert)

```typescript
test('Successful login', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);
  const { username, password } = config.credentials;
  
  // Act
  await loginPage.login(username, password);
  
  // Assert
  expect(await loginPage.isLoggedIn()).toBe(true);
});
```

### 2. Direct Login Pattern

Каждый тест выполняет прямой логин:

```typescript
test('Some test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const { username, password } = config.credentials;
  
  await loginPage.login(username, password);
  expect(await loginPage.isLoggedIn()).toBe(true);
  
  // ... остальная логика теста
});
```

**Причина:** httpOnly cookies не сохраняются через storageState

### 3. Serial Tests Pattern

Для тестов AI Assist используется shared context:

```typescript
test.describe.serial('Assist Page Tests', () => {
  let context: BrowserContext;
  let page: Page;
  
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await loginPage.login(username, password);
  });
  
  test.afterAll(async () => {
    await context.close();
  });
  
  // Тесты используют общий page
});
```

### 4. Unique Names Pattern

Генерация уникальных имён для тестовых данных:

```typescript
const albumName = `AlexAutomationTest${Date.now()}`;
// Результат: AlexAutomationTest1738339200000
```

### 5. Console Logging Pattern

Extensive логирование для отладки:

```typescript
console.log('STEP 2: Navigate to Albums');
await mediaPage.navigateToMedia();
console.log('✅ Navigated to Albums page');
```

## 🔍 Категории тестов

### UI Verification Tests
- Проверка видимости элементов
- Проверка текста
- Проверка состояний кнопок

**Пример:** `loginPage.spec.ts` - "Verify login page elements"

### E2E Flow Tests
- Полные user journey
- Множественные шаги
- Интеграция между страницами

**Пример:** `albumCreating.spec.ts` - Login → Navigate → Create Album

### Negative Tests
- Невалидные данные
- Граничные условия
- Ошибочные сценарии

**Пример:** `loginPage.spec.ts` - "Failed login with invalid password"

### Integration Tests
- Взаимодействие с API
- Проверка через backend

**Пример:** `updateImageTags.spec.ts` - API verification после загрузки

## 🎯 Best Practices в тестах

### ✅ Хорошо

1. **Использование Page Objects:**
   ```typescript
   const loginPage = new LoginPage(page);
   await loginPage.login(username, password);
   ```

2. **Централизованные данные:**
   ```typescript
   const { username, password } = config.credentials;
   const imagePath = FileHelpers.getAbsolutePath(testData...);
   ```

3. **Ожидания после действий:**
   ```typescript
   await mediaPage.confirmUpload();
   await mediaPage.waitForToast();
   ```

### ❌ Плохо

1. **Прямая работа с locators:**
   ```typescript
   await page.getByTestId('upload').click();  // ❌
   ```

2. **Хардкод данных:**
   ```typescript
   const username = 'alex@test.com';  // ❌
   ```

3. **Отсутствие ожиданий:**
   ```typescript
   await button.click();
   expect(result).toBe(true);  // ❌ Может быть не готово
   ```

## 📈 Покрытие функциональности

- ✅ Логин (100%)
- ✅ AI Assist UI (80%)
- ✅ Создание альбомов (70%)
- ✅ Загрузка файлов (80%)
- ⚠️ Редактирование тегов (50%)
- ❌ Удаление (0%)
- ❌ Фильтры (0%)
- ❌ Коллекции (0%)

---

**Следующие разделы:** Детальный разбор каждого тестового файла
