# MediaPage - Страница медиа

## 🎯 Назначение

Page Object для управления медиафайлами: галерея, альбомы, загрузка файлов, фильтры, теги.

**Наследуется от:** `BasePage`  
**Локаторов:** 23  
**Методов:** 33  
**Строк кода:** ~377

## 📦 Группы локаторов

### 1. Sidebar навигация (2)
```typescript
private readonly sidebarToggle: Locator;     // data-testid='sidebar-toggle'
private readonly mediaMenuItem: Locator;     // data-testid='Media'
```

### 2. Табы (5)
```typescript
private readonly albumsButton: Locator;      // role='button', name='Albums' .last()
private readonly galleryButton: Locator;     // role='button', name='Gallery' .last()
private readonly albumsMenuItem: Locator;    // Sidebar → Albums
private readonly galleryMenuItem: Locator;   // Sidebar → Gallery
private readonly mediaMenuButton: Locator;   // data-testid='Media'
```

**Особенность:** Используется `.last()` для табов, так как первое совпадение - это sidebar menu

### 3. Загрузка файлов (5)
```typescript
private readonly uploadButton: Locator;               // data-testid='upload'
private readonly agentSelect: Locator;                // data-testid='agent-select'
private readonly generalPhotosAgent: Locator;         // role='button', name='General photos - EN'
private readonly uploadImageDescription: Locator;     // role='textbox', name='Describe your uploaded images…'
private readonly uploadConfirmButton: Locator;        // role='button', name=/^upload$/
```

### 4. Теги (1)
```typescript
private readonly tagInput: Locator;          // role='textbox', name='type tag'
```

### 5. Toast уведомления (2)
```typescript
private readonly toastTitle: Locator;        // data-testid='toast-title'
private readonly toastMessage: Locator;      // data-testid='toast-message'
```

### 6. Фильтры (6)
```typescript
private readonly datePickerButton: Locator;  // data-testid='date-picker-button'
private readonly datePickerIcon: Locator;    // class='.DatePickerButton_datePickerIcon__22vZQ'
private readonly selectButton: Locator;      // role='button', name=/^Select$/
private readonly clearButton: Locator;       // role='button', name='Clear'
private readonly photoCheckbox: Locator;     // role='checkbox', name='Photo'
private readonly videoCheckbox: Locator;     // role='checkbox', name='Video'
```

### 7. Удаление (3)
```typescript
private readonly moreActionsButton: Locator; // data-testid='more-actions'
private readonly deleteOption: Locator;      // getByText('Delete')
private readonly confirmButton: Locator;     // data-testid='button-confirm'
```

## 🔧 Методы (33 метода)

### Навигация (3 метода)

#### navigateToMedia()
```typescript
async navigateToMedia(): Promise<void>
```
**Шаги:**
1. Клик на sidebar toggle
2. Клик на Media menu item
3. `waitForPageLoad()`

#### switchToAlbumsTab()
```typescript
async switchToAlbumsTab(): Promise<void>
```
**Стратегия с fallback:**
```typescript
try {
  // Приоритет: sidebar navigation
  await this.mediaMenuButton.click({ force: true });
  await this.albumsMenuItem.click({ force: true });
} catch {
  // Fallback: content tab
  await this.click(this.albumsButton);
}
await this.waitForPageLoad();
```

#### switchToGalleryTab()
```typescript
async switchToGalleryTab(): Promise<void>
```
**Аналогично Albums** с sidebar приоритетом

### Загрузка файлов (7 методов)

#### uploadFileWithMetadata() ⭐
```typescript
async uploadFileWithMetadata(filePath: string, tags: string[], description: string): Promise<void>
```
**Полный флоу загрузки:**
1. `clickUpload()`
2. `selectAgent()`
3. `uploadFile(filePath)`
4. `addMultipleTags(tags)`
5. `enterUploadDescription(description)`
6. `confirmUpload()`

**Остальные методы:**
- `clickUpload()` - открыть диалог
- `selectAgent(agentName)` - выбор AI агента
- `uploadFile(filePath)` - загрузка через setInputFiles
- `enterUploadDescription(description)` - ввод описания
- `confirmUpload()` - подтверждение
- `addTag(tag)` - добавление одного тега
- `addMultipleTags(tags)` - массив тегов

### Toast уведомления (4 метода)
- `getToastTitle()` / `getToastMessage()` - получение текста
- `isToastVisible()` - проверка видимости
- `waitForToast()` - ожидание появления

### Фильтры по дате (6 методов)
- `openDatePicker()` - открыть календарь
- `selectDate(day)` - выбрать день
- `selectDateRange(startDay, endDay)` - диапазон
- `goToPreviousMonth()` - предыдущий месяц
- `confirmDateSelection()` - подтвердить
- `clearDateFilter()` - очистить

### Фильтры по типу (4 метода)
- `togglePhotoFilter()` / `toggleVideoFilter()` - переключение
- `isPhotoFilterChecked()` / `isVideoFilterChecked()` - состояние

### Работа с изображениями (3 метода)
- `getImageCard(fileId)` - локатор карточки
- `clickImageCard(fileId)` - клик по карточке
- `clickFirstImageInGallery()` - клик на первое изображение

### Удаление (2 метода)
- `openMoreActions()` - открыть меню
- `deleteItem()` - удалить с подтверждением

## 📚 Примеры использования

### Загрузка изображения
```typescript
import testData from '../fixtures/testData.json';

test('Upload image', async ({ page }) => {
  const mediaPage = new MediaPage(page);
  
  const imagePath = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.png.path);
  const tags = ['automation', 'test', 'upload'];
  const description = 'Test image';
  
  await mediaPage.navigateToMedia();
  await mediaPage.switchToGalleryTab();
  
  await mediaPage.uploadFileWithMetadata(imagePath, tags, description);
  
  await mediaPage.waitForToast();
  expect(await mediaPage.getToastTitle()).toContain('Success');
});
```

### Использование фильтров
```typescript
test('Filter by date range', async ({ page }) => {
  const mediaPage = new MediaPage(page);
  
  await mediaPage.navigateToMedia();
  await mediaPage.openDatePicker();
  await mediaPage.selectDateRange(1, 15);
  await mediaPage.confirmDateSelection();
  
  // Проверка результатов
});
```

---

**Итог:** MediaPage - самый комплексный Page Object, 33 метода для всей работы с медиа
