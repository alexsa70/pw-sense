import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../config/env.config';
import testData from '../fixtures/testData.json';

/**
 * Test suite for KalSense login functionality
 */
test.describe('Login Flow', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
    });

    test('Successful login with valid credentials', async () => {
        // Arrange
        const { username, password } = config.credentials;

        // Act
        await loginPage.login(username, password);

        // Assert
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBe(true);

        // Additional verification - URL should change after login
        expect(loginPage.getCurrentURL()).not.toContain('login');
    });

    test('Failed login with invalid password', async () => {
        // Arrange
        const { username } = config.credentials;
        const invalidPassword = 'WrongPassword123!';

        // Act
        await loginPage.navigateToLogin();
        await loginPage.enterUsername(username);
        await loginPage.enterPassword(invalidPassword);
        await loginPage.clickLoginButton();

        // Assert
        // Login button should still be visible (user is not logged in)
        const isLoginButtonVisible = await loginPage.isLoginButtonVisible();
        expect(isLoginButtonVisible).toBe(true);

        // User should still be on login page
        expect(loginPage.getCurrentURL()).toContain('Kaleidoo_AI');
    });

    test('Unsuccessful login with empty fields', async () => {
        // Act
        await loginPage.navigateToLogin();
        await loginPage.clickLoginButton();

        // Assert
        // Login form should remain visible
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBe(false);

        // Login button should still be visible
        const isLoginButtonVisible = await loginPage.isLoginButtonVisible();
        expect(isLoginButtonVisible).toBe(true);
    });

    test('Verify login page elements are displayed', async () => {
        // Act
        await loginPage.navigateToLogin();

        // Assert - all elements should be visible
        expect(await loginPage.isUsernameFieldVisible()).toBe(true);
        expect(await loginPage.isPasswordFieldVisible()).toBe(true);
        expect(await loginPage.isLoginButtonVisible()).toBe(true);
        expect(await loginPage.isLogoVisible()).toBe(true);
        expect(await loginPage.isWelcomeTitleVisible()).toBe(true);
        expect(await loginPage.isSubtitleVisible()).toBe(true);
    });

    test.skip('Verify forgot password link functionality', async () => {
        // Arrange
        await loginPage.navigateToLogin();

        // Act
        await loginPage.clickForgotPassword();

        // Assert
        // Back to login button should be visible
        const isBackToLoginVisible = await loginPage.isForgotPasswordVisible();
        expect(isBackToLoginVisible).toBe(false);
    });

    test('Clear username and password fields', async () => {
        // Arrange
        await loginPage.navigateToLogin();
        await loginPage.enterUsername('TestUser');
        await loginPage.enterPassword('TestPassword');

        // Act
        await loginPage.clearUsername();
        await loginPage.clearPassword();

        // Assert
        const usernameValue = await loginPage.getUsernameFieldValue();
        const passwordValue = await loginPage.getPasswordFieldValue();

        expect(usernameValue).toBe('');
        expect(passwordValue).toBe('');
    });

    test('Verify login button is disabled when fields are empty', async () => {
        // Arrange
        await loginPage.navigateToLogin();

        // Act & Assert
        // Login button should be disabled when both fields are empty
        const isEnabledWhenEmpty = await loginPage.isLoginButtonEnabled();
        expect(isEnabledWhenEmpty).toBe(false);
    });

    test('Verify login button is enabled when both fields are filled', async () => {
        // Arrange
        await loginPage.navigateToLogin();

        // Act
        await loginPage.enterUsername('TestUser');
        await loginPage.enterPassword('TestPassword');

        // Assert
        // Login button should be enabled when both fields are filled
        const isEnabledWhenFilled = await loginPage.isLoginButtonEnabled();
        expect(isEnabledWhenFilled).toBe(true);
    });

    test('Verify login button is disabled when only username is filled', async () => {
        // Arrange
        await loginPage.navigateToLogin();

        // Act
        await loginPage.enterUsername('TestUser');

        // Assert
        // Login button should still be disabled
        const isEnabled = await loginPage.isLoginButtonEnabled();
        expect(isEnabled).toBe(false);
    });

    test('Verify login button is disabled when only password is filled', async () => {
        // Arrange
        await loginPage.navigateToLogin();

        // Act
        await loginPage.enterPassword('TestPassword');

        // Assert
        // Login button should still be disabled
        const isEnabled = await loginPage.isLoginButtonEnabled();
        expect(isEnabled).toBe(false);
    });
});
