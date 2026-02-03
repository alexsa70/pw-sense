import { test, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AssistPage } from '../pages/AssistPage';
import { config } from '../config/env.config';

/**
 * Assist Page Tests (split into multiple tests, single login)
 * Uses serial execution and shared page/context.
 */
test.describe.serial('Assist Page - UI Verification (split)', () => {
  let context: BrowserContext;
  let page: Page;
  let assistPage: AssistPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    assistPage = new AssistPage(page);

    const loginPage = new LoginPage(page);
    const { username, password } = config.credentials;
    await loginPage.login(username, password);

    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  });

  test.afterAll(async () => {
    await context.close();
  });

  //TEST: Verify welcome message is visible
  test('Verify welcome message is visible', async () => {
    const isWelcomeVisible = await assistPage.isWelcomeMessageVisible();
    expect(isWelcomeVisible).toBe(true);
  });

  //TEST: Verify dialog field text
  test('Verify dialog field text', async () => {
    const exists = await assistPage.isWelcomeDialogVisible();
    expect(exists).toBe(true);
  });

  //TEST: Send question and verify answer
  test('Send question and verify answer', async () => {
    await assistPage.askQuestion('Hello! What can you do?');
    await page.waitForTimeout(3000);

    const hasAnswer = await assistPage.hasAnswerAppeared();
    expect(hasAnswer).toBe(true);

    const isResultVisible = await assistPage.isResultsTitleVisible();
    expect(isResultVisible).toBe(true);
  });

  //TEST: Click upload button and verify upload dialog
  test('Click upload button and verify upload dialog', async () => {
    await assistPage.clickUpload();
    await page.waitForTimeout(2000);

    const isOpen = await assistPage.isUploadDialogOpen();
    expect(isOpen).toBe(true);
  });

  //TEST: Verify connector selection visible
  test('Verify connector selection visible', async () => {
    await page.waitForTimeout(2000);

    const isVisible = await assistPage.isConnectorSelectionVisible();
    expect(isVisible).toBe(true);
  });

  //TEST: Verify connector option exists
  test('Verify connector ALL options exist', async () => {
    await assistPage.openConnectorDropdown();
    await page.waitForTimeout(2000);

    const optionToCheck = ['General photos - ENMIL', 'MIL photos', 'Tables', 'Podcasts', 'Academic audio', 'Banking Audio', 'Medical docs', 'General docs'];

    for (const option of optionToCheck) {
      const optionExists = await assistPage.isConnectorOptionAvailable(option);
      expect(optionExists).toBe(true);
    }

    // const optionExists = await assistPage.isConnectorOptionAvailable('General photos - ENMIL');
    // expect(optionExists).toBe(true);

    await page.getByTestId('agent-select').click();
  });
});
