# Тестовые данные (/fixtures)

## 📁 Структура директории

```
fixtures/
└── testData.json    # Централизованное хранилище тестовых данных
```

## 📄 testData.json - Детальный разбор

### Назначение

Централизованное хранилище всех тестовых данных, используемых в тестах.

**Преимущества:**
- ✅ Единый источник истины для данных
- ✅ Легкость обновления значений
- ✅ Переиспользование данных
- ✅ Разделение данных и логики тестов

### Полная структура

```json
{
  "testFiles": { ... },
  "collections": { ... },
  "albums": { ... },
  "timeouts": { ... },
  "tags": { ... }
}
```

## 📦 Секции данных

### 1. testFiles - Тестовые файлы

#### textFile - Текстовый файл

```json
{
  "textFile": {
    "name": "test-document.txt",
    "content": "This is a test document for automation testing."
  }
}
```

**Назначение:** Для тестирования загрузки текстовых документов

#### imageFiles - Файлы изображений

```json
{
  "imageFiles": {
    "png": {
      "name": "test-image.png",
      "path": "test-files/images/test-image.png",
      "tags": ["automation", "test", "png"]
    },
    "jpg": {
      "name": "test-photo.jpg",
      "path": "test-files/images/test-photo.jpg",
      "tags": ["automation", "test", "jpg"]
    },
    "jpeg": {
      "name": "test-image.jpeg",
      "path": "test-files/images/test-image.jpeg",
      "tags": ["automation", "test", "jpeg"]
    }
  }
}
```

**Структура записи:**
- `name` - имя файла
- `path` - относительный путь от корня проекта
- `tags` - массив тегов для метаданных

**Использование:**
```typescript
import testData from '../fixtures/testData.json';

const imagePath = FileHelpers.getAbsolutePath(
  testData.testFiles.imageFiles.png.path
);
const tags = testData.testFiles.imageFiles.png.tags;
```

### 2. collections - Коллекции

```json
{
  "collections": {
    "defaultName": "Test Collection Auto",
    "prefix": "AutoTest_"
  }
}
```

**Поля:**
- `defaultName` - название коллекции по умолчанию
- `prefix` - префикс для автогенерируемых имён

**Использование:**
```typescript
const collectionName = `${testData.collections.prefix}${Date.now()}`;
// Результат: AutoTest_1738339200000
```

### 3. albums - Альбомы

```json
{
  "albums": {
    "defaultName": "Test Album Auto",
    "prefix": "Album_"
  }
}
```

**Поля:**
- `defaultName` - название альбома по умолчанию
- `prefix` - префикс для автогенерируемых имён

**Использование:**
```typescript
const albumName = `${testData.albums.prefix}${Date.now()}`;
// Результат: Album_1738339200000
```

**Альтернативный подход (в текущих тестах):**
```typescript
const albumName = `AlexAutomationTest${Date.now()}`;
```

### 4. timeouts - Тайм-ауты

```json
{
  "timeouts": {
    "short": 5000,
    "medium": 10000,
    "long": 30000
  }
}
```

**Категории:**
- `short` (5 секунд) - быстрые операции
- `medium` (10 секунд) - стандартные операции
- `long` (30 секунд) - долгие операции (загрузка файлов)

**Использование:**
```typescript
await page.waitForTimeout(testData.timeouts.short);
// Вместо магических чисел:
await page.waitForTimeout(5000);  // ❌
```

### 5. tags - Теги по категориям

```json
{
  "tags": {
    "default": ["automation", "playwright", "test"],
    "media": ["image", "photo", "test"],
    "document": ["doc", "text", "test"],
    "video": ["video", "mp4", "test"]
  }
}
```

**Категории тегов:**
- `default` - общие теги для любых тестов
- `media` - для изображений и медиа
- `document` - для документов
- `video` - для видео файлов

**Использование:**
```typescript
const tags = testData.tags.media;
// ['image', 'photo', 'test']

for (const tag of tags) {
  await mediaPage.addTag(tag);
}
```

## 📚 Примеры использования

### Пример 1: Загрузка изображения

```typescript
import testData from '../fixtures/testData.json';
import { FileHelpers } from '../utils/fileHelpers';

test('Upload image', async ({ page }) => {
  // Получение пути к файлу
  const imagePath = FileHelpers.getAbsolutePath(
    testData.testFiles.imageFiles.png.path
  );
  
  // Получение тегов
  const tags = testData.tags.media;
  
  // Использование timeout
  await page.waitForTimeout(testData.timeouts.medium);
  
  // Загрузка файла
  await fileInput.setInputFiles(imagePath);
  
  // Добавление тегов
  for (const tag of tags) {
    await mediaPage.addTag(tag);
  }
});
```

### Пример 2: Создание альбома

```typescript
test('Create album', async ({ page }) => {
  // Уникальное имя с префиксом
  const albumName = `${testData.albums.prefix}${Date.now()}`;
  
  await albumPage.createAlbum(albumName);
  
  // Проверка видимости
  await page.waitForTimeout(testData.timeouts.short);
  expect(await albumPage.isAlbumVisible(albumName)).toBe(true);
});
```

### Пример 3: Множественные типы файлов

```typescript
test('Upload different file types', async ({ page }) => {
  const fileTypes = ['png', 'jpg', 'jpeg'];
  
  for (const type of fileTypes) {
    const fileData = testData.testFiles.imageFiles[type];
    const filePath = FileHelpers.getAbsolutePath(fileData.path);
    const tags = fileData.tags;
    
    await mediaPage.uploadFileWithMetadata(filePath, tags, `Test ${type}`);
  }
});
```

## 🔄 Расширение testData.json

### Добавление новой секции

```json
{
  "users": {
    "admin": {
      "username": "admin@test.com",
      "role": "admin"
    },
    "viewer": {
      "username": "viewer@test.com",
      "role": "viewer"
    }
  }
}
```

**Использование:**
```typescript
const adminUser = testData.users.admin;
```

### Добавление новых файлов

```json
{
  "testFiles": {
    "videoFiles": {
      "mp4": {
        "name": "test-video.mp4",
        "path": "test-files/videos/test-video.mp4",
        "duration": 10,
        "tags": ["automation", "test", "video"]
      }
    }
  }
}
```

### Добавление API endpoints

```json
{
  "api": {
    "endpoints": {
      "files": "/api/files/get_all_v2",
      "upload": "/api/files/upload",
      "delete": "/api/files/delete"
    },
    "orgId": "6733306465383e58c9b88306",
    "projectIds": [
      "68af16da443fd05cb0c83c2a",
      "6882198cb753d1caf456e694"
    ]
  }
}
```

**Использование:**
```typescript
const apiResponse = await page.request.post(
  config.urls.base + testData.api.endpoints.files,
  {
    data: {
      org_id: testData.api.orgId,
      project_ids: testData.api.projectIds,
      limit: 32
    }
  }
);
```

## 🎯 Best Practices

### ✅ Хорошо

1. **Использовать testData везде:**
   ```typescript
   const tags = testData.tags.media;  // ✅
   ```

2. **Относительные пути для файлов:**
   ```typescript
   "path": "test-files/images/test.png"  // ✅
   ```

3. **Логическая группировка данных:**
   ```json
   {
     "testFiles": { ... },
     "users": { ... },
     "api": { ... }
   }
   ```

### ❌ Плохо

1. **Хардкод данных в тестах:**
   ```typescript
   const tags = ['automation', 'test', 'png'];  // ❌
   ```

2. **Абсолютные пути:**
   ```json
   "path": "/Users/alex/project/test.png"  // ❌
   ```

3. **Смешивание данных и логики:**
   ```typescript
   // testData.json НЕ для логики, только для данных
   ```

## 🔍 Валидация testData.json

### TypeScript типы

**Создание интерфейса:**
```typescript
// types/testData.types.ts
interface TestData {
  testFiles: {
    imageFiles: {
      png: FileData;
      jpg: FileData;
      jpeg: FileData;
    };
  };
  collections: {
    defaultName: string;
    prefix: string;
  };
  albums: {
    defaultName: string;
    prefix: string;
  };
  timeouts: {
    short: number;
    medium: number;
    long: number;
  };
  tags: {
    default: string[];
    media: string[];
    document: string[];
    video: string[];
  };
}

interface FileData {
  name: string;
  path: string;
  tags: string[];
}
```

**Использование:**
```typescript
import testData from '../fixtures/testData.json';
const data: TestData = testData;
```

## 📊 Текущее использование в проекте

### uploadImage.spec.ts
```typescript
const imagePath = FileHelpers.getAbsolutePath(
  testData.testFiles.imageFiles.png.path
);
```

### updateImageTags.spec.ts
```typescript
const imagePath = FileHelpers.getAbsolutePath(
  testData.testFiles.imageFiles.png.path
);
```

### loginPage.spec.ts
```typescript
import testData from '../fixtures/testData.json';
// (импортируется но не используется - потенциал для рефакторинга)
```

---

**Итог:** Централизованное, структурированное хранилище тестовых данных
