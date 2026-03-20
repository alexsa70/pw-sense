# Тесты альбомов (albumCreating.spec.ts)

## 📊 Обзор

**Файл:** `tests/albumCreating.spec.ts`  
**Всего тестов:** 1  
**Timeout:** 30000ms

## 🎯 Тест-кейс

### Create album ✅

**Полный E2E флоу:**

```typescript
test('Create album', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const mediaPage = new MediaPage(page);
  const albumPage = new AlbumPage(page);
  
  // Уникальное имя
  const albumName = `AlexAutomationTest${Date.now()}`;
  
  // STEP 1: Login
  await loginPage.login(username, password);
  expect(await loginPage.isLoggedIn()).toBe(true);
  
  // STEP 2: Navigate to Albums
  await mediaPage.navigateToMedia();
  await mediaPage.switchToAlbumsTab();
  await page.waitForTimeout(2000);
  
  // STEP 3: Create Album
  const newAlbumIcon = page.locator('.AlbumCard_newAlbumIcon__tJwvU').first();
  await newAlbumIcon.waitFor({ state: 'visible', timeout: 10000 });
  await newAlbumIcon.click({ force: true });
  
  const tagInput = page.getByRole('textbox', { name: 'Type Tag' });
  await tagInput.fill(albumName);
  await tagInput.press('Enter');
  
  const createButton = page.getByRole('button', { name: 'Create Album' });
  await createButton.click();
  
  console.log('✅ Album created successfully');
});
```

## 🎨 Особенности

### 1. Уникальное имя альбома
```typescript
const albumName = `AlexAutomationTest${Date.now()}`;
```

Предотвращает конфликты при повторных запусках

### 2. Прямое использование локаторов
```typescript
const newAlbumIcon = page.locator('.AlbumCard_newAlbumIcon__tJwvU').first();
```

Не использует `AlbumPage.createAlbum()` - пример для рефакторинга

### 3. force: true
```typescript
await newAlbumIcon.click({ force: true });
```

Обход возможных перекрытий элементов

### 4. Extensive Logging
```typescript
console.log('STEP 2: Navigate to Albums');
// ...
console.log('✅ Navigated to Albums page');
```

Каждый шаг логируется для отладки

## 🔄 Потенциальные улучшения

1. **Использовать AlbumPage методы:**
   ```typescript
   await albumPage.createAlbum(albumName);
   ```

2. **Добавить toast verification:**
   ```typescript
   await albumPage.waitForToast();
   expect(await albumPage.getToastTitle()).toContain('Success');
   ```

3. **Проверить видимость альбома:**
   ```typescript
   expect(await albumPage.isAlbumVisible(albumName)).toBe(true);
   ```

4. **Cleanup в afterEach:**
   ```typescript
   test.afterEach(async ({ page }) => {
     await albumPage.deleteItem();
   });
   ```

---

**Статус:** Работает стабильно, но есть место для рефакторинга
