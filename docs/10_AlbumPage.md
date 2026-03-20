# AlbumPage - Страница альбомов

## 🎯 Назначение

Page Object для управления альбомами: создание, навигация, удаление.

**Наследуется от:** `BasePage`  
**Локаторов:** 9  
**Методов:** 18  
**Строк кода:** ~305

## 📦 Локаторы

### Создание альбома
```typescript
private readonly newAlbumIcon: Locator;      // class='.AlbumCard_newAlbumIcon__tJwvU'
private readonly albumTagInput: Locator;     // role='textbox', name='Type Tag'
private readonly createAlbumButton: Locator; // role='button', name='Create Album'
```

### Навигация
```typescript
private readonly albumsButton: Locator;      // role='button', name='Albums'
```

### Toast и действия
```typescript
private readonly toastTitle: Locator;        // data-testid='toast-title'
private readonly toastMessage: Locator;      // data-testid='toast-message'
private readonly moreActionsButton: Locator; // data-testid='more-actions'
private readonly deleteOption: Locator;      // getByText('Delete')
private readonly confirmButton: Locator;     // data-testid='button-confirm'
```

## 🔧 Методы

### Создание альбома (6 методов)

#### createAlbum() ⭐
```typescript
async createAlbum(albumName: string): Promise<void>
```
**Полный флоу:**
1. `clickNewAlbum()`
2. `enterAlbumTag(albumName)`
3. `clickCreateAlbum()`
4. `waitForToast()`

#### clickNewAlbum() - Сложная логика
```typescript
async clickNewAlbum(): Promise<void> {
  try {
    await this.waitForVisible(this.newAlbumIcon, 10000);
    await this.scrollToElement(this.newAlbumIcon);
    await this.click(this.newAlbumIcon);
    return;
  } catch {
    // Re-открытие через sidebar при неудаче
    await this.page.getByTestId('Media').click({ force: true });
    await this.page.getByRole('menuitem', { name: 'Albums' })
      .getByRole('button', { name: 'Albums' })
      .click({ force: true });
  }
  
  // Fallback: force click на first элемент
  const fallbackIcon = this.page.locator('.AlbumCard_newAlbumIcon__tJwvU').first();
  await fallbackIcon.waitFor({ state: 'attached', timeout: 10000 });
  await fallbackIcon.click({ force: true });
}
```

**Особенность:** Трёхуровневая fallback стратегия для надёжности

### Поиск альбомов (5 методов)

#### getAlbumByName() / getAlbumByNameAlternative()
```typescript
getAlbumByName(albumName: string): Locator {
  return this.page
    .getByTestId('undefined-truncated-text')
    .filter({ hasText: albumName })
    .first();
}

getAlbumByNameAlternative(albumName: string): Locator {
  return this.page.locator('.AlbumCard_albumImageWrapper__XFkz4, [data-testid*="album"]')
    .filter({ hasText: albumName })
    .first();
}
```

**Двойная стратегия** для максимальной надёжности

#### clickAlbumByName()
```typescript
async clickAlbumByName(albumName: string): Promise<void> {
  await this.page.waitForTimeout(1000);
  
  try {
    const album = this.getAlbumByName(albumName);
    await this.click(album);
  } catch {
    const album = this.getAlbumByNameAlternative(albumName);
    await this.click(album);
  }
}
```

## 📚 Примеры использования

### Создание альбома
```typescript
test('Create album', async ({ page }) => {
  const albumPage = new AlbumPage(page);
  const albumName = `TestAlbum_${Date.now()}`;
  
  await albumPage.createAlbum(albumName);
  
  expect(await albumPage.isAlbumVisible(albumName)).toBe(true);
});
```

---

**Итог:** AlbumPage - надёжный класс с fallback стратегиями, 18 методов для работы с альбомами
