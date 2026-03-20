# Page Object Model - Обзор

## 🎯 Концепция Page Object Model

### Что такое POM?

**Page Object Model** - это паттерн проектирования для автоматизации тестирования, который:

1. **Инкапсулирует** структуру страницы в отдельном классе
2. **Разделяет** логику тестов и взаимодействие с UI
3. **Переиспользует** код для работы со страницами
4. **Упрощает** поддержку при изменении UI

### Преимущества POM

✅ **Читаемость:** Тесты выглядят как бизнес-логика  
✅ **Поддержка:** Изменения UI = изменения в одном месте  
✅ **Переиспользование:** Один метод используется в многих тестах  
✅ **Абстракция:** Тесты не зависят от деталей реализации UI

### Пример сравнения

#### ❌ Без POM (плохо)

```typescript
test('Login', async ({ page }) => {
  await page.goto('https://app.com/login');
  await page.getByTestId('userEmail').fill('user@test.com');
  await page.getByTestId('password').fill('password123');
  await page.getByTestId('login-btn').click();
  await page.waitForLoadState('networkidle');
  
  // Проверка видимости элемента после логина
  await page.getByTestId('login-btn').waitFor({ state: 'hidden', timeout: 10000 });
});
```

**Проблемы:**
- Низкий уровень абстракции
- Дублирование кода
- Сложно читать
- При изменении UI - правки во всех тестах

#### ✅ С POM (хорошо)

```typescript
test('Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@test.com', 'password123');
  expect(await loginPage.isLoggedIn()).toBe(true);
});
```

**Преимущества:**
- Высокий уровень абстракции
- Нет дублирования
- Читается как сценарий
- При изменении UI - правки только в LoginPage

## 🏗️ Архитектура POM в проекте

### Иерархия классов

```
BasePage (родитель)
  ├── LoginPage
  ├── MediaPage
  ├── AlbumPage
  ├── ImageDetailsPage
  └── AssistPage
```

### Принципы наследования

```typescript
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);  // Вызов конструктора BasePage
    
    // Инициализация локаторов
    this.usernameInput = this.getByTestId('userEmail');
    // ...
  }
}
```

**Что наследуется:**
- Все базовые методы (24 метода)
- Доступ к `this.page`
- Методы для работы с локаторами
- Утилиты (wait, scroll, etc.)

## 📦 Структура Page Object класса

### Типичная структура

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SomePage extends BasePage {
  // 1. Приватные локаторы
  private readonly someButton: Locator;
  private readonly someInput: Locator;
  
  // 2. Конструктор
  constructor(page: Page) {
    super(page);
    
    // Инициализация локаторов
    this.someButton = this.getByTestId('some-button');
    this.someInput = this.getByTestId('some-input');
  }
  
  // 3. Публичные методы
  
  // Навигация
  async navigateToSomePage(): Promise<void> {
    await this.navigate('/some-page');
  }
  
  // Действия (atomic methods)
  async clickButton(): Promise<void> {
    await this.click(this.someButton);
  }
  
  async enterText(text: string): Promise<void> {
    await this.fill(this.someInput, text);
  }
  
  // Compose methods (флоу)
  async completeFlow(text: string): Promise<void> {
    await this.navigateToSomePage();
    await this.enterText(text);
    await this.clickButton();
  }
  
  // Проверки
  async isButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.someButton);
  }
}
```

### Компоненты класса

#### 1. Локаторы (private readonly)

```typescript
private readonly usernameInput: Locator;
private readonly passwordInput: Locator;
private readonly loginButton: Locator;
```

**Принципы:**
- `private` - доступ только внутри класса
- `readonly` - нельзя переназначить после инициализации
- Инициализация в конструкторе

#### 2. Конструктор

```typescript
constructor(page: Page) {
  super(page);  // Вызов BasePage конструктора
  
  // Инициализация всех локаторов
  this.usernameInput = this.getByTestId('userEmail');
  this.passwordInput = this.getByTestId('password');
  this.loginButton = this.getByTestId('login-btn');
}
```

**Задачи:**
- Вызов super() для наследования
- Инициализация всех локаторов
- Настройка начального состояния (если нужно)

#### 3. Atomic methods

```typescript
async enterUsername(username: string): Promise<void> {
  await this.fill(this.usernameInput, username);
}

async clickLoginButton(): Promise<void> {
  await this.click(this.loginButton);
}
```

**Характеристики:**
- Одно простое действие
- Публичные или приватные
- Используются для построения compose methods

#### 4. Compose methods

```typescript
async login(username: string, password: string): Promise<void> {
  await this.navigateToLogin();
  await this.enterUsername(username);
  await this.enterPassword(password);
  await this.clickLoginButton();
  await this.waitForPageLoad();
}
```

**Характеристики:**
- Комбинация нескольких atomic methods
- Представляет бизнес-сценарий
- Основной способ взаимодействия из тестов

#### 5. Методы проверки

```typescript
async isLoggedIn(): Promise<boolean> {
  try {
    await this.waitForHidden(this.loginButton, 10000);
    return true;
  } catch {
    return false;
  }
}
```

**Характеристики:**
- Возвращают boolean или данные
- Используются в assertions тестов
- Могут включать логику проверки

## 📋 Все Page Objects в проекте

### 1. BasePage
- **Роль:** Родительский класс
- **Методы:** 24 базовых метода
- **Категории:** Навигация, локаторы, взаимодействие, проверки, ожидания

### 2. LoginPage
- **Роль:** Страница логина
- **Локаторы:** 8 (username, password, buttons, текст)
- **Методы:** 20 (ввод, клики, проверки, флоу логина)

### 3. MediaPage
- **Роль:** Медиа галерея и альбомы
- **Локаторы:** 23 (tabs, upload, filters, toast)
- **Методы:** 33 (навигация, загрузка, фильтры, теги)

### 4. AlbumPage
- **Роль:** Управление альбомами
- **Локаторы:** 9 (создание, навигация, toast)
- **Методы:** 18 (создание, поиск, удаление)

### 5. ImageDetailsPage
- **Роль:** Детали изображения
- **Локаторы:** 11 (теги, описание, toast)
- **Методы:** 22 (редактирование тегов и описаний)

### 6. AssistPage
- **Роль:** AI Ассистент
- **Локаторы:** 11 (чат, upload, коннекторы)
- **Методы:** 11 (чат, загрузка, выбор коннекторов)

## 🎨 Паттерны в Page Objects

### 1. Locator Strategy

**Приоритеты (от лучшего к худшему):**

```typescript
// ✅ 1. data-testid (лучший выбор)
this.uploadButton = this.getByTestId('upload');

// ✅ 2. ARIA роль
this.albumsButton = this.getByRole('button', { name: 'Albums' });

// ⚠️ 3. Текст
this.welcomeTitle = this.getByText('Welcome To Kal Sense');

// ❌ 4. CSS класс (только если нет альтернатив)
this.newAlbumIcon = this.getLocator('.AlbumCard_newAlbumIcon__tJwvU');
```

### 2. Fallback Strategy

```typescript
async switchToAlbumsTab(): Promise<void> {
  try {
    // Приоритет: sidebar navigation
    await this.mediaMenuButton.click({ force: true });
    await this.albumsMenuItem.click({ force: true });
  } catch {
    // Fallback: content tab
    await this.click(this.albumsButton);
  }
  await this.waitForPageLoad();
}
```

### 3. Retry Logic

```typescript
async clickAlbumByName(albumName: string): Promise<void> {
  await this.page.waitForTimeout(1000);
  
  try {
    // Попытка 1: primary method
    const album = this.getAlbumByName(albumName);
    await this.click(album);
  } catch {
    // Попытка 2: alternative method
    const album = this.getAlbumByNameAlternative(albumName);
    await this.click(album);
  }
}
```

### 4. Toast Pattern

```typescript
// В каждом Page Object где есть toast
private readonly toastTitle: Locator;
private readonly toastMessage: Locator;

async waitForToast(): Promise<void> {
  await this.waitForVisible(this.toastTitle, 10000);
}

async getToastTitle(): Promise<string> {
  return await this.getText(this.toastTitle);
}
```

## 🔄 Жизненный цикл Page Object

```
1. Создание в тесте
   └─> new LoginPage(page)

2. Инициализация
   └─> constructor() вызывает super()
   └─> Инициализация локаторов

3. Использование методов
   └─> loginPage.login(username, password)
   └─> Вызов atomic/compose methods
   └─> Взаимодействие с локаторами

4. Проверки
   └─> loginPage.isLoggedIn()
   └─> Возврат результатов для assertions

5. Очистка
   └─> Автоматически (garbage collection)
```

## 📊 Статистика Page Objects

| Page Object | Локаторы | Методы | Строк кода |
|------------|----------|---------|------------|
| BasePage | 0 | 24 | ~230 |
| LoginPage | 8 | 20 | ~200 |
| MediaPage | 23 | 33 | ~380 |
| AlbumPage | 9 | 18 | ~310 |
| ImageDetailsPage | 11 | 22 | ~230 |
| AssistPage | 11 | 11 | ~195 |
| **Итого** | **62** | **128** | **~1545** |

## 🎯 Best Practices

### ✅ Хорошо

1. **Один Page Object = одна страница/компонент**
2. **Приватные локаторы, публичные методы**
3. **Compose methods для сложных флоу**
4. **Fallback стратегии для нестабильных элементов**
5. **Наследование от BasePage**

### ❌ Плохо

1. **Публичные локаторы** (доступ напрямую из тестов)
2. **Смешивание логики тестов и Page Object**
3. **Дублирование методов между Page Objects**
4. **Отсутствие проверок перед действиями**
5. **Игнорирование базовых методов из BasePage**

---

**Следующие разделы:** Детальный разбор каждого Page Object класса
