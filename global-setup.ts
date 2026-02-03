import { chromium, FullConfig } from '@playwright/test';
import { config } from './config/env.config';

/**
 * Global setup - runs once before all tests
 * Saves authentication state to reuse in tests
 */
async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔐 Performing global login...');

  // Login
  const { username, password } = require('./config/env.config').config.credentials;
  const baseURL = process.env.BASE_URL || 'https://kal-sense.prod.kaleidoo-dev.com';

  await page.goto(`${baseURL}/Kaleidoo_AI`);
  await page.getByTestId('userEmail').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-btn').click();
  
  // Wait for login to complete - check for element that appears AFTER login
  await page.waitForLoadState('networkidle');
  
  // Wait for navigation away from login page OR for sidebar menu to appear
  try {
    // Wait for a sidebar element that only appears when logged in
    await page.getByTestId('Media').waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    console.warn('⚠️  Media menu not found, login may have failed');
  }
  
  // Additional wait to ensure all cookies are set
  await page.waitForTimeout(3000);

  // Save authentication state
  await context.storageState({ path: 'auth.json' });

  console.log('✅ Authentication state saved!');

  await browser.close();
}

export default globalSetup;