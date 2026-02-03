import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../config/env.config';

/**
 * Custom fixture that handles authentication
 * Logs in once and reuses the session for all tests
 */
type AuthFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
    authenticatedPage: async ({ page }, use) => {
        // Perform login
        const loginPage = new LoginPage(page);
        const { username, password } = config.credentials;

        console.log('🔐 Logging in...');
        await loginPage.login(username, password);
        console.log('✅ Logged in successfully');

        // Provide the authenticated page to the test
        await use(page);
    },
});

export { expect } from '@playwright/test';
