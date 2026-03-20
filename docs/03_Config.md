# Конфигурация окружения (/config)

## 📁 Структура директории

```
config/
└── env.config.ts    # Централизованная конфигурация
```

## 📄 env.config.ts - Детальный разбор

### Назначение

Централизованное управление переменными окружения для всего проекта.

### Импорты

```typescript
import * as dotenv from 'dotenv';
import * as path from 'path';
```

**Зависимости:**
- `dotenv` - загрузка переменных из .env файла
- `path` - работа с путями файловой системы

### Загрузка .env файла

```typescript
dotenv.config({ path: path.resolve(__dirname, '../.env') });
```

**Что происходит:**
1. `__dirname` - текущая директория (config/)
2. `path.resolve(__dirname, '../.env')` - абсолютный путь к .env
3. `dotenv.config()` - загрузка переменных в process.env

### Структура конфигурации

```typescript
export const config = {
  // User credentials
  credentials: {
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || '',
  },

  // Application URLs
  urls: {
    base: process.env.BASE_URL || 'https://kal-sense.prod.kaleidoo-dev.com',
    login: process.env.LOGIN_PATH || '/Kaleidoo_AI',
  },

  // Test configuration
  test: {
    headless: process.env.HEADLESS === 'true',
    timeout: parseInt(process.env.TIMEOUT || '30000', 10),
  },
};
```

### Секции конфигурации

#### 1. credentials - Учетные данные

```typescript
credentials: {
  username: process.env.USERNAME || '',
  password: process.env.PASSWORD || '',
}
```

**Переменные окружения:**
- `USERNAME` - имя пользователя для логина
- `PASSWORD` - пароль

**Fallback:** Пустая строка (вызовет ошибку при валидации)

**Использование:**
```typescript
const { username, password } = config.credentials;
await loginPage.login(username, password);
```

#### 2. urls - URL адреса

```typescript
urls: {
  base: process.env.BASE_URL || 'https://kal-sense.prod.kaleidoo-dev.com',
  login: process.env.LOGIN_PATH || '/Kaleidoo_AI',
}
```

**Переменные окружения:**
- `BASE_URL` - базовый URL приложения
- `LOGIN_PATH` - путь к странице логина

**Fallback:** Значения по умолчанию (prod окружение)

**Использование:**
```typescript
await page.goto(config.urls.base + config.urls.login);
```

#### 3. test - Настройки тестов

```typescript
test: {
  headless: process.env.HEADLESS === 'true',
  timeout: parseInt(process.env.TIMEOUT || '30000', 10),
}
```

**Переменные окружения:**
- `HEADLESS` - запуск без UI (строка 'true')
- `TIMEOUT` - дефолтный timeout в миллисекундах

**Fallback:** 
- headless = false (с UI)
- timeout = 30000ms (30 секунд)

**Парсинг:**
- `HEADLESS` - строгое сравнение с 'true'
- `TIMEOUT` - парсинг строки в число (base 10)

### Валидация конфигурации

```typescript
export const validateConfig = (): void => {
  const requiredVars = ['USERNAME', 'PASSWORD', 'BASE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please create a .env file in the project root with these variables.'
    );
  }
};

// Валидация на импорте
validateConfig();
```

**Логика:**
1. Определяем обязательные переменные
2. Фильтруем отсутствующие
3. Если есть отсутствующие - выбрасываем ошибку
4. **Автоматический запуск** при импорте модуля

**Обязательные переменные:**
- `USERNAME` - обязательно
- `PASSWORD` - обязательно
- `BASE_URL` - обязательно

**Опциональные переменные:**
- `LOGIN_PATH` - опционально (есть fallback)
- `HEADLESS` - опционально (default: false)
- `TIMEOUT` - опционально (default: 30000)

### Пример ошибки

Если отсутствуют USERNAME и PASSWORD:

```
Error: Missing required environment variables: USERNAME, PASSWORD
Please create a .env file in the project root with these variables.
```

## 🔐 Файл .env

### Формат

```env
# Application URL
BASE_URL=https://kal-sense.prod.kaleidoo-dev.com

# Login credentials
USERNAME=your_username
PASSWORD=your_password

# Optional settings
LOGIN_PATH=/Kaleidoo_AI
HEADLESS=false
TIMEOUT=30000
```

### Безопасность

**✅ Правильно:**
```gitignore
# .gitignore
.env           # ✅ Исключён из git
auth.json      # ✅ Исключён из git
```

**❌ Неправильно:**
- Коммитить .env в репозиторий
- Хардкодить креденшиалы в коде

### .env.example

**Шаблон для команды:**
```env
BASE_URL=https://kal-sense.prod.kaleidoo-dev.com
USERNAME=your_username_here
PASSWORD=your_password_here
```

**Использование:**
```bash
# Копирование шаблона
cp .env.example .env

# Редактирование
nano .env  # или любой редактор
```

## 📚 Использование в проекте

### В тестах

```typescript
import { config } from '../config/env.config';

test('Login test', async ({ page }) => {
  const { username, password } = config.credentials;
  await loginPage.login(username, password);
});
```

### В Page Objects

```typescript
import { config } from '../config/env.config';

async navigateToLogin(): Promise<void> {
  await this.navigate(config.urls.login);
  await this.waitForPageLoad();
}
```

### В playwright.config.ts

```typescript
import { config } from './config/env.config';

export default defineConfig({
  use: {
    baseURL: config.urls.base,
  },
  timeout: config.test.timeout,
});
```

## 🔄 Переопределение переменных

### Через командную строку

```bash
# Временное переопределение
BASE_URL=https://staging.example.com npm test

# Несколько переменных
HEADLESS=true TIMEOUT=60000 npm test
```

### Через разные .env файлы

```bash
# Для разных окружений
cp .env.example .env.staging
cp .env.example .env.prod

# Загрузка конкретного файла (требует изменения в коде)
dotenv.config({ path: '.env.staging' });
```

## 🎯 Best Practices

### ✅ Хорошо

1. **Использовать config везде:**
   ```typescript
   const url = config.urls.base;  // ✅
   ```

2. **Обязательные переменные в validateConfig:**
   ```typescript
   const requiredVars = ['USERNAME', 'PASSWORD', 'BASE_URL'];
   ```

3. **Fallback значения для опциональных:**
   ```typescript
   timeout: parseInt(process.env.TIMEOUT || '30000', 10)
   ```

### ❌ Плохо

1. **Прямой доступ к process.env:**
   ```typescript
   const username = process.env.USERNAME;  // ❌
   ```

2. **Хардкод значений:**
   ```typescript
   const baseUrl = 'https://kal-sense.prod...';  // ❌
   ```

3. **Отсутствие fallback для критичных значений:**
   ```typescript
   base: process.env.BASE_URL  // ❌ (undefined если не задано)
   ```

## 🔍 Отладка конфигурации

### Проверка загрузки

```typescript
// В env.config.ts (временно для debug)
console.log('Loaded config:', {
  username: config.credentials.username ? '***' : 'MISSING',
  base: config.urls.base,
  timeout: config.test.timeout,
});
```

### Проверка .env

```bash
# Проверить что .env существует
ls -la .env

# Просмотреть содержимое (осторожно с паролями!)
cat .env
```

### Проверка переменных окружения

```typescript
// В любом файле (для debug)
console.log('USERNAME:', process.env.USERNAME ? 'SET' : 'NOT SET');
console.log('PASSWORD:', process.env.PASSWORD ? 'SET' : 'NOT SET');
console.log('BASE_URL:', process.env.BASE_URL);
```

---

**Итог:** Централизованная, типобезопасная, валидируемая конфигурация
