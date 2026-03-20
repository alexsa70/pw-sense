# Тесты загрузки (uploadImage.spec.ts + updateImageTags.spec.ts)

## 📄 uploadImage.spec.ts

**Всего тестов:** 1  
**Timeout:** 90000ms (90 секунд)

### Upload image to gallery ✅

**Полный E2E флоу:**

```typescript
test('Upload image to gallery', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const mediaPage = new MediaPage(page);
  
  // Test data
  const imagePath = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.png.path);
  const tags = ['automation', 'test', 'upload'];
  const description = 'Test image uploaded via Playwright automation';
  
  // STEP 1: Login
  await loginPage.login(username, password);
  
  // STEP 2: Navigate to Gallery
  await mediaPage.navigateToMedia();
  await mediaPage.switchToGalleryTab();
  
  // STEP 3: Upload
  await mediaPage.clickUpload();
  await mediaPage.selectAgent('General photos - EN');
  
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(imagePath);
  
  // Tags
  for (const tag of tags) {
    await mediaPage.addTag(tag);
    await page.waitForTimeout(300);
  }
  
  // Description
  await mediaPage.enterUploadDescription(description);
  
  // Confirm
  await mediaPage.confirmUpload();
  await page.waitForTimeout(5000);
});
```

**Особенности:**
- FileHelpers для получения пути
- Прямой доступ к input[type="file"]
- Микро-задержки между тегами (300ms)
- Увеличенный timeout (90s)

## 📄 updateImageTags.spec.ts

**Статус:** SKIPPED  
**Timeout:** 100000ms (100 секунд)

### Upload image and update tags ⏸️

**Флоу:**
1. Login
2. Upload image с начальными тегами
3. API verification через POST request
4. Открыть загруженное изображение
5. Обновить теги на новые

**API Verification:**
```typescript
const apiResponse = await page.request.post(
  'https://kal-sense.prod.kaleidoo-dev.com/api/files/get_all_v2',
  {
    data: {
      org_id: "6733306465383e58c9b88306",
      project_ids: ["68af16da443fd05cb0c83c2a", "6882198cb753d1caf456e694"],
      limit: 32,
      product: "KalMedia"
    }
  }
);
```

**Причина SKIP:**
- Зависимость от hardcoded org_id/project_ids
- Требует настройки для конкретного окружения
- API endpoint может измениться

## 📄 updateTag.spec.ts

**Статус:** SKIPPED  
**Timeout:** 100000ms

### Update tags on existing file ⏸️

**Проблемы:**
- Hardcoded file ID: `2025-01-06_08-19-26.png-0-imageCard`
- Не использует Page Objects
- Зависит от наличия конкретного файла

**Причина SKIP:**
- Не работает на других окружениях
- Требует предварительной подготовки данных

---

**Итого:**
- ✅ 1 активный тест загрузки
- ⏸️ 2 пропущенных теста обновления тегов
