# Утилиты (/utils)

## 📁 Структура директории

```
utils/
└── fileHelpers.ts    # Хелперы для работы с файловой системой
```

## 📄 fileHelpers.ts - Детальный разбор

### Назначение

Класс-утилита для работы с файлами в тестах: проверка, чтение, создание, удаление, получение метаинформации.

### Импорты

```typescript
import * as fs from 'fs';
import * as path from 'path';
```

**Модули Node.js:**
- `fs` - файловая система (синхронные операции)
- `path` - работа с путями

### Архитектура класса

```typescript
export class FileHelpers {
  // 18 статических методов
  static fileExists(filePath: string): boolean { ... }
  static readFile(filePath: string): string { ... }
  // ...
}
```

**Особенность:** Все методы `static` - не требуется создание экземпляра

**Использование:**
```typescript
// ✅ Правильно
FileHelpers.fileExists('/path/to/file');

// ❌ Неправильно (не нужно)
const helpers = new FileHelpers();
```

## 📦 Категории методов

### 1. Проверка файлов

#### fileExists()
```typescript
static fileExists(filePath: string): boolean
```

**Описание:** Проверка существования файла

**Реализация:**
```typescript
return fs.existsSync(filePath);
```

**Пример:**
```typescript
if (FileHelpers.fileExists('/path/to/image.png')) {
  console.log('File exists');
}
```

#### isValidForUpload()
```typescript
static isValidForUpload(filePath: string, maxSizeMB: number = 10): boolean
```

**Описание:** Проверка валидности файла для загрузки

**Параметры:**
- `filePath` - путь к файлу
- `maxSizeMB` - максимальный размер в МБ (по умолчанию 10)

**Реализация:**
```typescript
if (!this.fileExists(filePath)) {
  return false;
}

const sizeInBytes = this.getFileSize(filePath);
const sizeInMB = sizeInBytes / (1024 * 1024);

return sizeInMB <= maxSizeMB;
```

**Пример:**
```typescript
const isValid = FileHelpers.isValidForUpload(imagePath, 5);
if (!isValid) {
  throw new Error('File too large or does not exist');
}
```

### 2. Получение информации о файлах

#### readFile()
```typescript
static readFile(filePath: string): string
```

**Описание:** Чтение содержимого файла как строки

**Реализация:**
```typescript
return fs.readFileSync(filePath, 'utf-8');
```

**Пример:**
```typescript
const content = FileHelpers.readFile('/path/to/file.txt');
console.log(content);
```

#### getFileSize()
```typescript
static getFileSize(filePath: string): number
```

**Описание:** Получение размера файла в байтах

**Реализация:**
```typescript
const stats = fs.statSync(filePath);
return stats.size;
```

**Пример:**
```typescript
const size = FileHelpers.getFileSize(imagePath);
console.log(`File size: ${size} bytes`);
```

#### getFileExtension()
```typescript
static getFileExtension(filePath: string): string
```

**Описание:** Получение расширения файла

**Реализация:**
```typescript
return path.extname(filePath);
```

**Пример:**
```typescript
const ext = FileHelpers.getFileExtension('image.png');
// Результат: '.png'
```

#### getFileName()
```typescript
static getFileName(filePath: string): string
```

**Описание:** Получение имени файла без расширения

**Реализация:**
```typescript
return path.basename(filePath, path.extname(filePath));
```

**Пример:**
```typescript
const name = FileHelpers.getFileName('/path/to/image.png');
// Результат: 'image'
```

#### getFullFileName()
```typescript
static getFullFileName(filePath: string): string
```

**Описание:** Получение полного имени файла с расширением

**Реализация:**
```typescript
return path.basename(filePath);
```

**Пример:**
```typescript
const fullName = FileHelpers.getFullFileName('/path/to/image.png');
// Результат: 'image.png'
```

#### getMimeType()
```typescript
static getMimeType(filePath: string): string
```

**Описание:** Определение MIME-типа по расширению файла

**Реализация:**
```typescript
const ext = this.getFileExtension(filePath).toLowerCase();

const mimeTypes: { [key: string]: string } = {
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

return mimeTypes[ext] || 'application/octet-stream';
```

**Поддерживаемые типы:**
- Текст: `.txt`
- Документы: `.pdf`, `.doc`, `.docx`
- Изображения: `.jpg`, `.jpeg`, `.png`, `.gif`
- Видео: `.mp4`
- Fallback: `application/octet-stream`

**Пример:**
```typescript
const mimeType = FileHelpers.getMimeType('image.png');
// Результат: 'image/png'
```

### 3. Работа с путями

#### getTestFilesDir()
```typescript
static getTestFilesDir(): string
```

**Описание:** Абсолютный путь к директории test-files

**Реализация:**
```typescript
return path.resolve(__dirname, '../test-files');
```

**Пример:**
```typescript
const testFilesDir = FileHelpers.getTestFilesDir();
// Результат: '/Users/alex/mywork_repos/pw-sense/test-files'
```

#### getAbsolutePath()
```typescript
static getAbsolutePath(relativePath: string): string
```

**Описание:** Конвертация относительного пути в абсолютный

**Реализация:**
```typescript
return path.resolve(__dirname, '..', relativePath);
```

**Пример:**
```typescript
const absolutePath = FileHelpers.getAbsolutePath('test-files/images/test.png');
// Результат: '/Users/alex/mywork_repos/pw-sense/test-files/images/test.png'
```

**Использование с testData:**
```typescript
import testData from '../fixtures/testData.json';

const imagePath = FileHelpers.getAbsolutePath(
  testData.testFiles.imageFiles.png.path
);
```

#### getTestFilePath()
```typescript
static getTestFilePath(fileName: string): string
```

**Описание:** Путь к файлу в test-files директории

**Реализация:**
```typescript
return path.join(this.getTestFilesDir(), fileName);
```

**Пример:**
```typescript
const filePath = FileHelpers.getTestFilePath('test-image.png');
// Результат: '/path/to/test-files/test-image.png'
```

#### getImageFilePath()
```typescript
static getImageFilePath(fileName: string): string
```

**Описание:** Путь к файлу в test-files/images/

**Реализация:**
```typescript
return path.join(this.getTestFilesDir(), 'images', fileName);
```

**Пример:**
```typescript
const imagePath = FileHelpers.getImageFilePath('test-image.png');
// Результат: '/path/to/test-files/images/test-image.png'
```

#### getDocumentFilePath()
```typescript
static getDocumentFilePath(fileName: string): string
```

**Описание:** Путь к файлу в test-files/documents/

**Реализация:**
```typescript
return path.join(this.getTestFilesDir(), 'documents', fileName);
```

#### getVideoFilePath()
```typescript
static getVideoFilePath(fileName: string): string
```

**Описание:** Путь к файлу в test-files/videos/

**Реализация:**
```typescript
return path.join(this.getTestFilesDir(), 'videos', fileName);
```

### 4. Создание и удаление

#### createTextFile()
```typescript
static createTextFile(filePath: string, content: string): void
```

**Описание:** Создание текстового файла

**Реализация:**
```typescript
const dir = path.dirname(filePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(filePath, content, 'utf-8');
```

**Особенности:**
- Автоматически создаёт директории (recursive)
- Кодировка UTF-8

**Пример:**
```typescript
FileHelpers.createTextFile('/path/to/test.txt', 'Test content');
```

#### deleteFile()
```typescript
static deleteFile(filePath: string): void
```

**Описание:** Удаление файла (если существует)

**Реализация:**
```typescript
if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
}
```

**Особенности:** Не выбрасывает ошибку если файла нет

**Пример:**
```typescript
FileHelpers.deleteFile('/path/to/temp-file.txt');
```

#### generateUniqueFileName()
```typescript
static generateUniqueFileName(baseName: string, extension: string): string
```

**Описание:** Генерация уникального имени файла с timestamp

**Реализация:**
```typescript
const timestamp = Date.now();
return `${baseName}_${timestamp}${extension}`;
```

**Пример:**
```typescript
const uniqueName = FileHelpers.generateUniqueFileName('test-image', '.png');
// Результат: 'test-image_1738339200000.png'
```

## 📚 Примеры использования в проекте

### Пример 1: Загрузка файла из testData

```typescript
import testData from '../fixtures/testData.json';
import { FileHelpers } from '../utils/fileHelpers';

test('Upload image', async ({ page }) => {
  // Получение абсолютного пути
  const imagePath = FileHelpers.getAbsolutePath(
    testData.testFiles.imageFiles.png.path
  );
  
  // Проверка валидности
  if (!FileHelpers.isValidForUpload(imagePath, 10)) {
    throw new Error('File is not valid for upload');
  }
  
  // Загрузка
  await fileInput.setInputFiles(imagePath);
});
```

### Пример 2: Создание временного файла

```typescript
test('Upload text document', async ({ page }) => {
  // Создание временного файла
  const tempFilePath = path.join(
    FileHelpers.getTestFilesDir(),
    FileHelpers.generateUniqueFileName('temp-doc', '.txt')
  );
  
  FileHelpers.createTextFile(tempFilePath, 'Test content for upload');
  
  // Использование
  await fileInput.setInputFiles(tempFilePath);
  
  // Cleanup
  FileHelpers.deleteFile(tempFilePath);
});
```

### Пример 3: Проверка информации о файле

```typescript
test('Validate file before upload', async ({ page }) => {
  const imagePath = FileHelpers.getImageFilePath('test-image.png');
  
  // Проверки
  expect(FileHelpers.fileExists(imagePath)).toBe(true);
  
  const size = FileHelpers.getFileSize(imagePath);
  expect(size).toBeGreaterThan(0);
  
  const mimeType = FileHelpers.getMimeType(imagePath);
  expect(mimeType).toBe('image/png');
  
  const ext = FileHelpers.getFileExtension(imagePath);
  expect(ext).toBe('.png');
});
```

## 🎯 Best Practices

### ✅ Хорошо

1. **Использовать getAbsolutePath с testData:**
   ```typescript
   const path = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.png.path);
   ```

2. **Проверять существование перед использованием:**
   ```typescript
   if (FileHelpers.fileExists(filePath)) {
     // use file
   }
   ```

3. **Генерировать уникальные имена:**
   ```typescript
   const uniqueName = FileHelpers.generateUniqueFileName('test', '.png');
   ```

### ❌ Плохо

1. **Хардкод абсолютных путей:**
   ```typescript
   const path = '/Users/alex/test-image.png';  // ❌
   ```

2. **Прямое использование fs без проверок:**
   ```typescript
   fs.unlinkSync(filePath);  // ❌ Может упасть
   ```

3. **Магические числа для размера:**
   ```typescript
   const sizeMB = size / 1048576;  // ❌ Непонятно
   ```

## 🔄 Расширение FileHelpers

### Добавление нового метода

```typescript
/**
 * Copy file from source to destination
 * @param sourcePath - source file path
 * @param destPath - destination file path
 */
static copyFile(sourcePath: string, destPath: string): void {
  if (!this.fileExists(sourcePath)) {
    throw new Error(`Source file does not exist: ${sourcePath}`);
  }
  
  const content = fs.readFileSync(sourcePath);
  const destDir = path.dirname(destPath);
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.writeFileSync(destPath, content);
}
```

### Добавление async методов

```typescript
/**
 * Read file asynchronously
 * @param filePath - path to file
 * @returns file content as string
 */
static async readFileAsync(filePath: string): Promise<string> {
  return fs.promises.readFile(filePath, 'utf-8');
}
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

**Потенциал:** Используется только `getAbsolutePath()`, остальные методы доступны но не используются

---

**Итог:** Полнофункциональная утилита для работы с файлами, 18 методов для всех нужд тестирования
