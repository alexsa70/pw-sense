import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Page Object для страницы логина KalSense
 */
export class LoginPage extends BasePage {
  // Селекторы (будут уточнены после исследования реального приложения)
  private readonly usernameInput = 'input[name="username"], input[type="text"]';
  private readonly passwordInput = 'input[name="password"], input[type="password"]';
  private readonly loginButton = 'button[type="submit"], button:has-text("Login"), button:has-text("Sign in")';
  private readonly errorMessage = '.error, .alert, [role="alert"]';
  private readonly logo = 'img, .logo, [class*="logo"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Переход на страницу логина
   */
  async navigate(): Promise<void> {
    await this.goto('/Kaleidoo_AI');
    await this.waitForPageLoad();
  }

  /**
   * Ввод имени пользователя
   */
  async enterUsername(username: string): Promise<void> {
    await this.waitAndFill(this.usernameInput, username);
  }

  /**
   * Ввод пароля
   */
  async enterPassword(password: string): Promise<void> {
    await this.waitAndFill(this.passwordInput, password);
  }

  /**
   * Клик по кнопке Login
   */
  async clickLoginButton(): Promise<void> {
    await this.waitAndClick(this.loginButton);
  }

  /**
   * Полный флоу логина
   */
  async login(username: string, password: string): Promise<void> {
    await this.navigate();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.waitForPageLoad();
  }

  /**
   * Проверка успешного логина (проверяем исчезновение формы логина)
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      // Ждем исчезновения формы логина
      await this.waitForElementToDisappear(this.loginButton, 10000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Получение текста ошибки
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Проверка отображения ошибки
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}