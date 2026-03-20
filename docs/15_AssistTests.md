# Тесты AI Ассистента (assistPage.spec.ts)

## 📊 Обзор

**Файл:** `tests/assistPage.spec.ts`  
**Всего тестов:** 6  
**Режим:** `test.describe.serial` - последовательное выполнение с shared context  
**Timeout:** 30000ms

## 🏗️ Архитектура теста

### Serial Mode Setup

```typescript
test.describe.serial('Assist Page - UI Verification (split)', () => {
  let context: BrowserContext;
  let page: Page;
  let assistPage: AssistPage;

  test.beforeAll(async ({ browser }) => {
    // Manual context/page creation
    context = await browser.newContext();
    page = await context.newPage();
    
    // Прямой логин один раз
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Переход на Assist
    assistPage = new AssistPage(page);
    await assistPage.navigateToAssist();
  });

  test.afterAll(async () => {
    await context.close();
  });
});
```

**Преимущества:**
- Один логин для всех тестов
- Shared page/context
- Быстрое выполнение

## 🎯 Тест-кейсы

### 1. Verify welcome message is visible ✅
```typescript
test('Verify welcome message is visible', async () => {
  expect(await assistPage.isWelcomeMessageVisible()).toBe(true);
});
```

### 2. Verify dialog field text ✅
```typescript
test('Verify dialog field text', async () => {
  expect(await assistPage.isWelcomeDialogVisible()).toBe(true);
});
```

### 3. Send question and verify answer ✅
```typescript
test('Send question and verify answer', async () => {
  await assistPage.askQuestion('Hello! What can you do?');
  await page.waitForTimeout(3000);  // AI response time
  
  expect(await assistPage.hasAnswerAppeared()).toBe(true);
  expect(await assistPage.isResultsTitleVisible()).toBe(true);
});
```

**Assertions:** 2  
**Особенность:** 3000ms ожидание AI ответа

### 4. Click upload button and verify upload dialog ✅
```typescript
test('Click upload button and verify upload dialog', async () => {
  await assistPage.clickUpload();
  await page.waitForTimeout(2000);
  
  expect(await assistPage.isUploadDialogOpen()).toBe(true);
});
```

### 5. Verify connector selection visible ✅
```typescript
test('Verify connector selection visible', async () => {
  expect(await assistPage.isConnectorSelectionVisible()).toBe(true);
});
```

### 6. Verify connector ALL options exist ✅
```typescript
test('Verify connector ALL options exist', async () => {
  await assistPage.openConnectorDropdown();
  await page.waitForTimeout(2000);
  
  const optionsToCheck = [
    'General photos - ENMIL',
    'MIL photos',
    'Tables',
    'Podcasts',
    'Academic audio',
    'Banking Audio',
    'Medical docs',
    'General docs'
  ];
  
  for (const option of optionsToCheck) {
    const optionExists = await assistPage.isConnectorOptionAvailable(option);
    expect(optionExists).toBe(true);
  }
  
  await page.getByTestId('agent-select').click();  // Закрыть dropdown
});
```

**Assertions:** 8 (по одному на каждый коннектор)

## 🎨 Особенности

### 1. Manual Context Management
```typescript
context = await browser.newContext();
page = await context.newPage();
```

Обход ограничения Playwright fixtures в beforeAll

### 2. Shared State
Тесты зависят друг от друга:
- Upload dialog остаётся открытым между тестами
- Connector dropdown остаётся открытым

### 3. Один логин
Выполняется один раз в beforeAll, экономит ~5-10 секунд

---

**Покрытие:** 80% функциональности Assist UI (без тестирования файловой загрузки)
