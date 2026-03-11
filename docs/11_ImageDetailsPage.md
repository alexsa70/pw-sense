# ImageDetailsPage - Детали изображения

## 🎯 Назначение

Page Object для редактирования тегов и описаний изображений.

**Наследуется от:** `BasePage`  
**Локаторов:** 11  
**Методов:** 22  
**Строк кода:** ~226

## 📦 Локаторы

### Теги
```typescript
private readonly editTagsButton: Locator;    // data-testid='edit-tags'
private readonly tagInput: Locator;          // role='textbox', name='Type A Tag'
private readonly saveTagsButton: Locator;    // data-testid='save-tags'
```

### Описание
```typescript
private readonly editDescriptionButton: Locator;    // data-testid='edit-description'
private readonly descriptionInput: Locator;         // role='textbox', name=/Enter description for/
private readonly saveDescriptionButton: Locator;    // data-testid='save-description-edit'
private readonly cancelDescriptionButton: Locator;  // data-testid='cancel-description-edit'
```

### Проекты и Toast
```typescript
private readonly addToProjectButton: Locator;  // data-testid='add-to-project'
private readonly toastTitle: Locator;          // data-testid='toast-title'
private readonly toastMessage: Locator;        // data-testid='toast-message'
```

## 🔧 Методы

### Работа с тегами (5 методов)

#### updateImageTags() ⭐
```typescript
async updateImageTags(tags: string[]): Promise<void>
```
**Полный флоу:**
1. `clickEditTags()`
2. `addMultipleTags(tags)`
3. `clickSaveTags()`
4. `waitForPageLoad()`

**Остальные методы:**
- `clickEditTags()` - начать редактирование
- `enterTag(tag)` - ввод тега + Enter
- `addMultipleTags(tags)` - массив тегов
- `clickSaveTags()` - сохранить

### Работа с описанием (5 методов)

#### updateImageDescription() ⭐
```typescript
async updateImageDescription(description: string): Promise<void>
```
**Полный флоу:**
1. `clickEditDescription()`
2. `enterDescription(description)`
3. `clickSaveDescription()`
4. `waitForPageLoad()`

## 📚 Примеры использования

### Обновление тегов
```typescript
test('Update tags', async ({ page }) => {
  const imageDetailsPage = new ImageDetailsPage(page);
  const newTags = ['updated', 'automation', 'playwright'];
  
  await imageDetailsPage.updateImageTags(newTags);
  
  await imageDetailsPage.waitForToast();
  expect(await imageDetailsPage.getToastTitle()).toContain('Success');
});
```

---

**Итог:** ImageDetailsPage - простой и эффективный класс для редактирования метаданных, 22 метода
