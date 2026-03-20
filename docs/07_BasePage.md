# BasePage - Базовый класс

## 🎯 Назначение

**BasePage** - родительский класс для всех Page Objects, содержащий общие методы для взаимодействия с веб-страницами.

**Философия:** DRY (Don't Repeat Yourself) - все общие методы в одном месте для переиспользования во всех дочерних классах.

## 📄 Структура класса

```typescript
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 24 метода
}
```

## 📦 Категории методов (24 метода)

### 1. Навигация (5 методов)

#### navigate()
```typescript
async navigate(url: string): Promise<void>
```
**Описание:** Переход на указанный URL  
**Параметры:** `url` - относительный или абсолютный URL  
**Реализация:** `await this.page.goto(url);`

#### reload()
```typescript
async reload(): Promise<void>
```
**Описание:** Перезагрузка текущей страницы  
**Реализация:** `await this.page.reload();`

#### goBack()
```typescript
async goBack(): Promise<void>
```
**Описание:** Возврат на предыдущую страницу  
**Реализация:** `await this.page.goBack();`

#### goForward()
```typescript
async goForward(): Promise<void>
```
**Описание:** Переход вперёд в истории  
**Реализация:** `await this.page.goForward();`

#### getCurrentURL()
```typescript
getCurrentURL(): string
```
**Описание:** Получение текущего URL  
**Возврат:** Текущий URL страницы  
**Реализация:** `return this.page.url();`

### 2. Получение локаторов (4 метода)

#### getLocator()
```typescript
getLocator(selector: string): Locator
```
**Описание:** Получение локатора по CSS селектору  
**Параметры:** `selector` - CSS selector, XPath, etc.  
**Возврат:** Locator объект

#### getByTestId()
```typescript
getByTestId(testId: string): Locator
```
**Описание:** Получение локатора по data-testid  
**Параметры:** `testId` - значение атрибута data-testid  
**Возврат:** Locator объект  
**Использование:** 
```typescript
this.uploadButton = this.getByTestId('upload');
```

#### getByText()
```typescript
getByText(text: string, exact: boolean = false): Locator
```
**Описание:** Получение локатора по тексту элемента  
**Параметры:**
- `text` - текст элемента
- `exact` - точное совпадение (по умолчанию false)

**Реализация:** `return this.page.getByText(text, { exact });`

#### getByRole()
```typescript
getByRole(role: string, options?: { name?: string | RegExp }): Locator
```
**Описание:** Получение локатора по ARIA роли  
**Параметры:**
- `role` - ARIA роль ('button', 'textbox', etc.)
- `options` - дополнительные опции (name для уточнения)

**Использование:**
```typescript
this.loginButton = this.getByRole('button', { name: 'Login' });
```

### 3. Взаимодействие с элементами (4 метода)

#### click()
```typescript
async click(locator: Locator): Promise<void>
```
**Описание:** Клик по элементу  
**Параметры:** `locator` - Locator объект  
**Реализация:** `await locator.click();`

#### fill()
```typescript
async fill(locator: Locator, text: string): Promise<void>
```
**Описание:** Заполнение поля текстом (с предварительной очисткой)  
**Параметры:**
- `locator` - Locator объект
- `text` - текст для ввода

**Реализация:** `await locator.fill(text);`

#### press()
```typescript
async press(locator: Locator, key: string): Promise<void>
```
**Описание:** Нажатие клавиши  
**Параметры:**
- `locator` - Locator объект
- `key` - имя клавиши ('Enter', 'Escape', 'Tab', etc.)

**Реализация:** `await locator.press(key);`

**Пример:**
```typescript
await this.press(this.tagInput, 'Enter');
```

#### scrollToElement()
```typescript
async scrollToElement(locator: Locator): Promise<void>
```
**Описание:** Прокрутка к элементу  
**Параметры:** `locator` - Locator объект  
**Реализация:** `await locator.scrollIntoViewIfNeeded();`

### 4. Получение данных (4 метода)

#### getText()
```typescript
async getText(locator: Locator): Promise<string>
```
**Описание:** Получение текста элемента  
**Параметры:** `locator` - Locator объект  
**Возврат:** Текстовое содержимое или пустая строка  
**Реализация:** `return await locator.textContent() || '';`

#### getAttribute()
```typescript
async getAttribute(locator: Locator, attribute: string): Promise<string | null>
```
**Описание:** Получение значения атрибута элемента  
**Параметры:**
- `locator` - Locator объект
- `attribute` - имя атрибута

**Возврат:** Значение атрибута или null

#### getPageTitle()
```typescript
async getPageTitle(): Promise<string>
```
**Описание:** Получение заголовка страницы (title)  
**Возврат:** Текст заголовка  
**Реализация:** `return await this.page.title();`

#### takeScreenshot()
```typescript
async takeScreenshot(name: string): Promise<void>
```
**Описание:** Создание скриншота страницы  
**Параметры:** `name` - имя файла без расширения  
**Реализация:**
```typescript
await this.page.screenshot({ 
  path: `test-results/${name}.png`, 
  fullPage: true 
});
```

### 5. Проверки (3 метода)

#### isVisible()
```typescript
async isVisible(locator: Locator, timeout: number = 5000): Promise<boolean>
```
**Описание:** Проверка видимости элемента  
**Параметры:**
- `locator` - Locator объект
- `timeout` - таймаут ожидания (по умолчанию 5000ms)

**Возврат:** true если элемент видим, false если нет

**Реализация:**
```typescript
try {
  await locator.waitFor({ state: 'visible', timeout });
  return true;
} catch {
  return false;
}
```

#### isEnabled()
```typescript
async isEnabled(locator: Locator): Promise<boolean>
```
**Описание:** Проверка доступности элемента (не disabled)  
**Параметры:** `locator` - Locator объект  
**Возврат:** true если элемент enabled  
**Реализация:** `return await locator.isEnabled();`

#### isChecked()
```typescript
async isChecked(locator: Locator): Promise<boolean>
```
**Описание:** Проверка состояния checkbox/radio  
**Параметры:** `locator` - Locator объект  
**Возврат:** true если отмечен  
**Реализация:** `return await locator.isChecked();`

### 6. Ожидания (4 метода)

#### waitForVisible()
```typescript
async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void>
```
**Описание:** Ожидание видимости элемента  
**Параметры:**
- `locator` - Locator объект
- `timeout` - таймаут ожидания (по умолчанию 10000ms)

**Реализация:** `await locator.waitFor({ state: 'visible', timeout });`

#### waitForHidden()
```typescript
async waitForHidden(locator: Locator, timeout: number = 10000): Promise<void>
```
**Описание:** Ожидание исчезновения элемента  
**Параметры:**
- `locator` - Locator объект
- `timeout` - таймаут ожидания (по умолчанию 10000ms)

**Реализация:** `await locator.waitFor({ state: 'hidden', timeout });`

**Использование:**
```typescript
// Проверка успешного логина
await this.waitForHidden(this.loginButton, 10000);
```

#### waitForPageLoad()
```typescript
async waitForPageLoad(): Promise<void>
```
**Описание:** Ожидание полной загрузки страницы (networkidle)  
**Реализация:** `await this.page.waitForLoadState('networkidle');`

**Что это означает:**
- Нет активных сетевых запросов более 500ms
- Страница полностью интерактивна

#### waitForDOMLoad()
```typescript
async waitForDOMLoad(): Promise<void>
```
**Описание:** Ожидание загрузки DOM (domcontentloaded)  
**Реализация:** `await this.page.waitForLoadState('domcontentloaded');`

**Что это означает:**
- HTML полностью загружен и распарсен
- Не ждёт CSS, изображений, iframe

## 📚 Примеры использования

### В дочернем классе (LoginPage)

```typescript
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  
  constructor(page: Page) {
    super(page);  // Вызов BasePage конструктора
    
    // Использование методов BasePage для получения локаторов
    this.usernameInput = this.getByTestId('userEmail');
    this.passwordInput = this.getByTestId('password');
  }
  
  // Использование методов BasePage
  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);  // ← BasePage.fill()
  }
  
  async navigateToLogin(): Promise<void> {
    await this.navigate('/Kaleidoo_AI');  // ← BasePage.navigate()
    await this.waitForPageLoad();  // ← BasePage.waitForPageLoad()
  }
  
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.waitForHidden(this.loginButton, 10000);  // ← BasePage.waitForHidden()
      return true;
    } catch {
      return false;
    }
  }
}
```

### Compose pattern

```typescript
// Atomic methods используют BasePage методы
async enterUsername(username: string) {
  await this.fill(this.usernameInput, username);
}

async clickLoginButton() {
  await this.click(this.loginButton);
}

// Compose method комбинирует atomic methods
async login(username: string, password: string) {
  await this.navigate('/login');           // BasePage
  await this.enterUsername(username);      // Atomic
  await this.enterPassword(password);      // Atomic
  await this.clickLoginButton();           // Atomic
  await this.waitForPageLoad();            // BasePage
}
```

## 🎯 Best Practices

### ✅ Хорошо

1. **Всегда наследоваться от BasePage:**
   ```typescript
   export class SomePage extends BasePage { ... }
   ```

2. **Использовать BasePage методы вместо прямого page:**
   ```typescript
   // ✅ Хорошо
   await this.click(locator);
   
   // ❌ Плохо
   await locator.click();
   ```

3. **Вызывать super() в конструкторе:**
   ```typescript
   constructor(page: Page) {
     super(page);  // ✅ Обязательно!
     // ...
   }
   ```

### ❌ Плохо

1. **Не наследоваться от BasePage:**
   ```typescript
   export class SomePage {  // ❌ Дублирование кода
     readonly page: Page;
     // ... все методы снова
   }
   ```

2. **Прямой доступ к page вместо методов:**
   ```typescript
   await this.page.locator(selector).click();  // ❌
   ```

3. **Дублирование логики из BasePage:**
   ```typescript
   async myClick(locator: Locator) {  // ❌ Уже есть в BasePage
     await locator.click();
   }
   ```

## 📊 Статистика BasePage

- **Всего методов:** 24
- **Категории:** 6
- **Строк кода:** ~230
- **Используется в:** 6 дочерних классах
- **Покрытие:** ~90% методов активно используются

## 🔄 Расширение BasePage

### Добавление нового метода

**Когда добавлять в BasePage:**
- Метод нужен в 2+ Page Objects
- Метод универсален (не специфичен для одной страницы)
- Метод работает с Playwright API

**Пример:**
```typescript
/**
 * Hover over an element
 * @param locator - Locator object
 */
async hover(locator: Locator): Promise<void> {
  await locator.hover();
}
```

**Когда НЕ добавлять в BasePage:**
- Метод специфичен для одной страницы
- Метод содержит бизнес-логику
- Метод зависит от конкретных локаторов

---

**Итог:** BasePage - фундамент всей архитектуры Page Objects, 24 универсальных метода для всех страниц
