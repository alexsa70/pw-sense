import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Page Object for the KalSense login page
 * Contains all locators and methods for login functionality
 */
export class LoginPage extends BasePage {
  // Locators using data-testid attributes
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly backToLoginButton: Locator;
  
  // Text locators
  private readonly welcomeTitle: Locator;
  private readonly subtitle: Locator;
  
  // Logo
  private readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.usernameInput = this.getByTestId('userEmail');
    this.passwordInput = this.getByTestId('password');
    this.loginButton = this.getByTestId('login-btn');
    this.forgotPasswordLink = this.getByTestId('forgot-pass');
    this.backToLoginButton = this.getByTestId('go-back-to-login');
    this.welcomeTitle = this.getByText('Welcome To Kal Sense');
    this.subtitle = this.getByText('The perfect connection');
    this.logo = this.page.getByRole('img').first();
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigate('/Kaleidoo_AI');
    await this.waitForPageLoad();
  }

  /**
   * Enter username into the username field
   * @param username - username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  /**
   * Enter password into the password field
   * @param password - password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click on the Login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Click on "Forgot Password" link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click on "Back to Login" button
   */
  async clickBackToLogin(): Promise<void> {
    await this.click(this.backToLoginButton);
  }

  /**
   * Complete login flow with username and password
   * @param username - username for login
   * @param password - password for login
   */
  async login(username: string, password: string): Promise<void> {
    await this.navigateToLogin();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.waitForPageLoad();
  }

  /**
   * Check if user is successfully logged in
   * Verifies that login button is no longer visible
   * @returns true if logged in, false otherwise
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      // Wait for login button to disappear (user is redirected after successful login)
      await this.waitForHidden(this.loginButton, 10000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if welcome title is visible on the page
   * @returns true if visible, false otherwise
   */
  async isWelcomeTitleVisible(): Promise<boolean> {
    return await this.isVisible(this.welcomeTitle);
  }

  /**
   * Check if subtitle is visible on the page
   * @returns true if visible, false otherwise
   */
  async isSubtitleVisible(): Promise<boolean> {
    return await this.isVisible(this.subtitle);
  }

  /**
   * Check if logo is visible on the page
   * @returns true if visible, false otherwise
   */
  async isLogoVisible(): Promise<boolean> {
    return await this.isVisible(this.logo);
  }

  /**
   * Check if username field is visible
   * @returns true if visible, false otherwise
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.usernameInput);
  }

  /**
   * Check if password field is visible
   * @returns true if visible, false otherwise
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.passwordInput);
  }

  /**
   * Check if login button is visible
   * @returns true if visible, false otherwise
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.loginButton);
  }

  /**
   * Check if forgot password link is visible
   * @returns true if visible, false otherwise
   */
  async isForgotPasswordVisible(): Promise<boolean> {
    return await this.isVisible(this.forgotPasswordLink);
  }

  /**
   * Clear username field
   */
  async clearUsername(): Promise<void> {
    await this.usernameInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  /**
   * Get username field placeholder or value
   * @returns username field text content
   */
  async getUsernameFieldValue(): Promise<string> {
    return await this.usernameInput.inputValue();
  }

  /**
   * Get password field placeholder or value
   * @returns password field text content
   */
  async getPasswordFieldValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Check if login button is enabled
   * @returns true if enabled, false if disabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }
}