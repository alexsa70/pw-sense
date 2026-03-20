# KalSense E2E Test Automation - Документация

> Полная документация проекта автоматизации тестирования для системы KalSense

## 📚 Навигация по документации

### 🎯 Начало работы
- [01. Обзор проекта](01_Overview.md) - Описание проекта, цели, статус
- [02. Архитектура](02_Architecture.md) - Структура проекта, паттерны

### ⚙️ Конфигурация и данные
- [03. Config - Конфигурация](03_Config.md) - Настройки окружения
- [04. Fixtures - Тестовые данные](04_Fixtures.md) - JSON фикстуры
- [05. Utils - Утилиты](05_Utils.md) - FileHelpers и хелперы

### 📄 Page Object Model
- [06. Page Objects - Обзор](06_Pages_Overview.md) - Общая информация о POM
- [07. BasePage](07_BasePage.md) - Базовый класс
- [08. LoginPage](08_LoginPage.md) - Страница логина
- [09. MediaPage](09_MediaPage.md) - Страница медиа
- [10. AlbumPage](10_AlbumPage.md) - Страница альбомов
- [11. ImageDetailsPage](11_ImageDetailsPage.md) - Детали изображения
- [12. AssistPage](12_AssistPage.md) - AI Ассистент

### 🧪 Тестовые сценарии
- [13. Тесты - Обзор](13_Tests_Overview.md) - Общая информация о тестах
- [14. Login Tests](14_LoginTests.md) - Тесты логина
- [15. Assist Tests](15_AssistTests.md) - Тесты AI ассистента
- [16. Album Tests](16_AlbumTests.md) - Тесты альбомов
- [17. Upload Tests](17_UploadTests.md) - Тесты загрузки

### 🔧 Конфигурация и CI/CD
- [18. Playwright Config](18_PlaywrightConfig.md) - Настройки Playwright
- [19. CI/CD](19_CICD.md) - GitHub Actions

### 💡 Дополнительно
- [20. Best Practices](20_BestPractices.md) - Лучшие практики, рекомендации

---

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Установка браузеров
npx playwright install

# Настройка .env
cp .env.example .env
# Заполните USERNAME, PASSWORD, BASE_URL

# Запуск тестов
npm test
```

## 📊 Статус проекта

- **Версия:** 1.0.0
- **Фреймворк:** Playwright 1.58.0
- **Язык:** TypeScript
- **Активных тестов:** 17
- **Покрытие:** ~70%

---

**Дата создания:** 30 января 2026
