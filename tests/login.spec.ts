import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import testData from '../fixtures/testData.json';

/**
 * Тесты для функционала логина в KalSense
 */
test.describe('Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('Успешный логин с валидными кредами', async () => {
    // Arrange
    const { username, password } = testData.credentials;

    // Act
    await loginPage.login(username, password);

    // Assert
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    // Дополнительная проверка - URL должен измениться после логина
    expect(loginPage.page.url()).not.toContain('login');
  });

  test('Неуспешный логин с невалидным паролем', async () => {
    // Arrange
    const { username } = testData.credentials;
    const invalidPassword = 'WrongPassword123';

    // Act
    await loginPage.login(username, invalidPassword);

    // Assert
    const errorDisplayed = await loginPage.isErrorDisplayed();
    expect(errorDisplayed).toBeTruthy();
  });

  test('Неуспешный логин с пустыми полями', async () => {
    // Act
    await loginPage.navigate();
    await loginPage.clickLoginButton();

    // Assert
    // Форма логина должна остаться видимой
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();
  });

  test('Проверка отображения полей логина', async () => {
    // Act
    await loginPage.navigate();

    // Assert
    await expect(loginPage.page.locator('input[name="username"], input[type="text"]')).toBeVisible();
    await expect(loginPage.page.locator('input[name="password"], input[type="password"]')).toBeVisible();
  });
});