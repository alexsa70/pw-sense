# AssistPage - AI Ассистент

## 🎯 Назначение
Page Object для AI-ассистента: чат, загрузка файлов, выбор коннекторов.

**Локаторов:** 11 | **Методов:** 11 | **Строк:** ~193

## 📦 Локаторы

### Welcome элементы
```typescript
private readonly welcomeMessage: Locator;    // data-testid='assist-welcome-message'
private readonly welcomeDialog: Locator;     // div filter hasText /^Hi Tester, how can I help you today\?$/
```

### Чат
```typescript
private readonly chatTextarea: Locator;      // data-testid='chat-textarea'
private readonly sendButton: Locator;        // data-testid='send-button'
private readonly answerContainer: Locator;   // class='.SearchRes_answerContainer__jxuKt'
private readonly resultsTitle: Locator;      // text='Results'
```

### Upload и коннекторы
```typescript
private readonly uploadButton: Locator;          // data-testid='upload'
private readonly uploadFileText: Locator;        // text='Upload File'
private readonly connectorText: Locator;         // text='Select A Connector For The'
private readonly connectorDropdownIcon: Locator; // data-testid='agent-select'
```

## 🔧 Основные методы

### Чат

#### askQuestion() ⭐
```typescript
async askQuestion(message: string): Promise<void>
```
**Полный флоу:**
1. `enterChatMessage(message)` - клик + fill
2. `sendChatMessage()` - press Enter

**Пример:**
```typescript
await assistPage.askQuestion('Hello! What can you do?');
await page.waitForTimeout(3000); // Ожидание AI ответа

expect(await assistPage.hasAnswerAppeared()).toBe(true);
```

### Проверки
- `hasAnswerAppeared()` - проверка count > 0
- `getAnswerText()` - получение текста ответа
- `isWelcomeMessageVisible()` - приветствие видимо
- `isResultsTitleVisible()` - "Results" видим

### Upload и коннекторы
- `clickUpload()` - открыть диалог загрузки
- `isUploadDialogOpen()` - проверка через nth(1)
- `selectConnector(connectorName)` - выбор коннектора
- `isConnectorOptionAvailable(connectorName)` - count > 0

## 📚 Доступные коннекторы

1. General photos - ENMIL
2. MIL photos
3. Tables
4. Podcasts
5. Academic audio
6. Banking Audio
7. Medical docs
8. General docs

## 📚 Пример использования

```typescript
test.describe.serial('Assist Page Tests', () => {
  let page: Page;
  
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    
    // Логин
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    
    // Переход на Assist
    const assistPage = new AssistPage(page);
    await assistPage.navigateToAssist();
  });
  
  test('Verify welcome message', async () => {
    expect(await assistPage.isWelcomeMessageVisible()).toBe(true);
  });
  
  test('Send question', async () => {
    await assistPage.askQuestion('Hello!');
    await page.waitForTimeout(3000);
    expect(await assistPage.hasAnswerAppeared()).toBe(true);
  });
});
```

---

**Особенность:** Использует count-based проверки и `.nth()` для элементов с множественными совпадениями
