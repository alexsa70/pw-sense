import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ImageDetailsPage } from '../pages/ImageDetailsPage';
import { MediaPage } from '../pages/MediaPage';
import { config } from '../config/env.config';

test.skip('test', async ({ page }) => {
    test.setTimeout(100000);
    
    const loginPage = new LoginPage(page);
    const mediaPage = new MediaPage(page);
    const imageDetailsPage = new ImageDetailsPage(page);

    // ========================================
    // STEP 1: Direct Login
    // ========================================
    const { username, password } = config.credentials;
    await loginPage.login(username, password);
    expect(await loginPage.isLoggedIn()).toBe(true);
    console.log('✅ Login successful');

    await page.getByTestId('Media').click();
    await page.getByTestId('Media-files').getByRole('button', { name: 'Gallery' }).click();
    await page.getByTestId('2025-01-06_08-19-26.png-0-imageCard').getByRole('img', { name: 'Media' }).click();
    await page.getByTestId('edit-tags').click();
    await page.getByRole('textbox', { name: 'Type A Tag' }).click();
    await page.getByRole('textbox', { name: 'Type A Tag' }).fill('UpdatedTag');
    await page.getByRole('textbox', { name: 'Type A Tag' }).press('Enter');
    await page.getByRole('textbox', { name: 'Type A Tag' }).fill('automatation');
    await page.getByRole('textbox', { name: 'Type A Tag' }).press('Enter');
    await page.getByTestId('save-tags').click();
    await page.getByTestId('toast-message').click();
    await page.getByTestId('toast-message').click();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();
});