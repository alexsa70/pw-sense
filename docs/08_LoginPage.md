# LoginPage - Страница логина

## 🎯 Назначение

Page Object для страницы логина KalSense. Содержит все локаторы и методы для функциональности аутентификации.

## 📄 Структура класса

```typescript
export class LoginPage extends BasePage {
  // 8 приватных локаторов
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  // ...
  
  constructor(page: Page) { ... }
  
  // 20 публичных методов
}
```

**Наследуется от:** `BasePage`  
**Локаторов:** 8  
**Методов:** 20  
**Строк кода:** ~203

## 📦 Локаторы

### Поля ввода
```typescript
private readonly usernameInput: Locator;      // data-testid='userEmail'
private readonly passwordInput: Locator;      // data-testid='password'
```

### Кнопки и ссылки
```typescript
private readonly loginButton: Locator;        // data-testid='login-btn'
private readonly forgotPasswordLink: Locator; // data-testid='forgot-pass'
private readonly backToLoginButton: Locator;  // data-testid='go-back-to-login'
```

### Текстовые элементы
```typescript
private readonly welcomeTitle: Locator;       // text='Welcome To Kal Sense'
private readonly subtitle: Locator;           // text='The perfect connection'
```

### Изображения
```typescript
private readonly logo: Locator;               // role='img' first()
```

## 🔧 Методы

### Навигация (1 метод)

#### navigateToLogin()
```typescript
async navigateToLogin(): Promise<void>
```

**Описание:** Переход на страницу логина  
**Шаги:**
1. `navigate('/Kaleidoo_AI')`
2. `waitForPageLoad()`

**Использование:**
```typescript
await loginPage.navigateToLogin();
```

### Заполнение формы (4 метода)

#### enterUsername()
```typescript
async enterUsername(username: string): Promise<void>
```

**Описание:** Ввод имени пользователя  
**Параметры:** `username` - имя пользователя  
**Реализация:** `await this.fill(this.usernameInput, username);`

#### enterPassword()
```typescript
async enterPassword(password: string): Promise<void>
```

**Описание:** Ввод пароля  
**Параметры:** `password` - пароль  
**Реализация:** `await this.fill(this.passwordInput, password);`

#### clearUsername()
```typescript
async clearUsername(): Promise<void>
```

**Описание:** Очистка поля username  
**Реализация:** `await this.usernameInput.clear();`

#### clearPassword()
```typescript
async clearPassword(): Promise<void>
```

**Описание:** Очистка поля пароля  
**Реализация:** `await this.passwordInput.clear();`

### Действия (3 метода)

#### clickLoginButton()
```typescript
async clickLoginButton(): Promise<void>
```

**Описание:** Клик на кнопку Login  
**Реализация:** `await this.click(this.loginButton);`

#### clickForgotPassword()
```typescript
async clickForgotPassword(): Promise<void>
```

**Описание:** Клик на "Forgot Password"  
**Реализация:** `await this.click(this.forgotPasswordLink);`

#### clickBackToLogin()
```typescript
async clickBackToLogin(): Promise<void>
```

**Описание:** Возврат к форме логина  
**Реализация:** `await this.click(this.backToLoginButton);`

### Главный флоу (2 метода)

#### login() ⭐
```typescript
async login(username: string, password: string): Promise<void>
```

**Описание:** Полный флоу логина (compose method)  
**Параметры:**
- `username` - имя пользователя
- `password` - пароль

**Шаги:**
1. `navigateToLogin()`
2. `enterUsername(username)`
3. `enterPassword(password)`
4. `clickLoginButton()`
5. `waitForPageLoad()`

**Использование:**
```typescript
await loginPage.login('user@test.com', 'password123');
```

#### isLoggedIn() ⭐
```typescript
async isLoggedIn(): Promise<boolean>
```

**Описание:** Проверка успешного логина  
**Возврат:** `true` если залогинен, `false` если нет

**Логика:**
```typescript
try {
  // Ожидаем исчезновения кнопки Login
  await this.waitForHidden(this.loginButton, 10000);
  return true;  // Кнопка исчезла = редирект после логина
} catch {
  return false; // Кнопка осталась = логин провален
}
```

**Использование:**
```typescript
expect(await loginPage.isLoggedIn()).toBe(true);
```

### Проверки видимости (7 методов)

#### isWelcomeTitleVisible()
```typescript
async isWelcomeTitleVisible(): Promise<boolean>
```
**Проверяет:** "Welcome To Kal Sense" видим

#### isSubtitleVisible()
```typescript
async isSubtitleVisible(): Promise<boolean>
```
**Проверяет:** "The perfect connection" видим

#### isLogoVisible()
```typescript
async isLogoVisible(): Promise<boolean>
```
**Проверяет:** Логотип видим

#### isUsernameFieldVisible()
```typescript
async isUsernameFieldVisible(): Promise<boolean>
```
**Проверяет:** Поле username видимо

#### isPasswordFieldVisible()
```typescript
async isPasswordFieldVisible(): Promise<boolean>
```
**Проверяет:** Поле пароля видимо

#### isLoginButtonVisible()
```typescript
async isLoginButtonVisible(): Promise<boolean>
```
**Проверяет:** Кнопка Login видима

#### isForgotPasswordVisible()
```typescript
async isForgotPasswordVisible(): Promise<boolean>
```
**Проверяет:** Ссылка "Forgot Password" видима

**Все используют:** `return await this.isVisible(this.locator);`

### Получение значений (2 метода)

#### getUsernameFieldValue()
```typescript
async getUsernameFieldValue(): Promise<string>
```

**Описание:** Получение значения поля username  
**Возврат:** Текущее значение поля  
**Реализация:** `return await this.usernameInput.inputValue();`

#### getPasswordFieldValue()
```typescript
async getPasswordFieldValue(): Promise<string>
```

**Описание:** Получение значения поля пароля  
**Возврат:** Текущее значение поля  
**Реализация:** `return await this.passwordInput.inputValue();`

### Проверки состояния (1 метод)

#### isLoginButtonEnabled()
```typescript
async isLoginButtonEnabled(): Promise<boolean>
```

**Описание:** Проверка доступности кнопки Login  
**Возврат:** `true` если enabled, `false` если disabled  
**Реализация:** `return await this.isEnabled(this.loginButton);`

**Использование:**
```typescript
// Проверка валидации на клиенте
expect(await loginPage.isLoginButtonEnabled()).toBe(false);
```

## 📚 Примеры использования

### Успешный логин
```typescript
test('Successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const { username, password } = config.credentials;
  
  await loginPage.login(username, password);
  
  expect(await loginPage.isLoggedIn()).toBe(true);
  expect(loginPage.getCurrentURL()).not.toContain('login');
});
```

### Неуспешный логин
```typescript
test('Failed login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigateToLogin();
  await loginPage.enterUsername('user@test.com');
  await loginPage.enterPassword('wrongpassword');
  await loginPage.clickLoginButton();
  
  // Кнопка Login всё ещё видна = логин провален
  expect(await loginPage.isLoginButtonVisible()).toBe(true);
});
```

### Проверка UI элементов
```typescript
test('Verify login page elements', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigateToLogin();
  
  expect(await loginPage.isUsernameFieldVisible()).toBe(true);
  expect(await loginPage.isPasswordFieldVisible()).toBe(true);
  expect(await loginPage.isLoginButtonVisible()).toBe(true);
  expect(await loginPage.isLogoVisible()).toBe(true);
  expect(await loginPage.isWelcomeTitleVisible()).toBe(true);
  expect(await loginPage.isSubtitleVisible()).toBe(true);
});
```

### Валидация кнопки Login
```typescript
test('Login button is disabled when fields are empty', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigateToLogin();
  
  // Поля пустые - кнопка disabled
  expect(await loginPage.isLoginButtonEnabled()).toBe(false);
  
  // Заполнили оба поля - кнопка enabled
  await loginPage.enterUsername('test');
  await loginPage.enterPassword('test');
  expect(await loginPage.isLoginButtonEnabled()).toBe(true);
});
```

## 🎯 Ключевые особенности

### 1. Определение успешного логина
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

**Логика:** После успешного логина происходит редирект, и кнопка Login исчезает со страницы.

### 2. Приоритет data-testid
```typescript
this.usernameInput = this.getByTestId('userEmail');
this.passwordInput = this.getByTestId('password');
this.loginButton = this.getByTestId('login-btn');
```

**Преимущество:** Стабильные локаторы, не зависящие от структуры DOM или текста

### 3. Fallback для текстовых локаторов
```typescript
this.welcomeTitle = this.getByText('Welcome To Kal Sense');
this.subtitle = this.getByText('The perfect connection');
```

**Использование:** Когда нет data-testid, текстовые локаторы - хороший вариант для статичного контента

## 📊 Статистика использования

**В тестах:**
- `loginPage.spec.ts` - 9 тестов
- `assistPage.spec.ts` - 1 использование (beforeAll login)
- `albumCreating.spec.ts` - 1 использование
- `uploadImage.spec.ts` - 1 использование
- `updateImageTags.spec.ts` - 1 использование
- `updateTag.spec.ts` - 1 использование

**Итого:** Используется в 6 тестовых файлах, ~15 раз

---

**Итог:** LoginPage - критически важный Page Object, используется во всех E2E тестах для аутентификации
