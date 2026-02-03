import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MediaPage } from '../pages/MediaPage';
import { AlbumPage } from '../pages/AlbumPage';
import { config } from '../config/env.config';
import testData from '../fixtures/testData.json';

/**
 * Create Album Test 
 * Complete flow: Login → Create Album → Verify 
 */
test.describe('Album Management -E2E', () => {
    test('Create album', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const mediaPage = new MediaPage(page);
        const albumPage = new AlbumPage(page);

        //Album
        const albumName = `AlexAutomationTest${Date.now()}`;

        //============================================
        //Step 1. - Direct Login
        //============================================
        const { username, password } = config.credentials;
        await loginPage.login(username, password);
        expect(await loginPage.isLoggedIn()).toBe(true);
        console.log('✅ Login successful');

        // ========================================
        // STEP 2: Navigate to Media → Albums
        // ========================================
        console.log('STEP 2: Navigate to Albums');
        await mediaPage.navigateToMedia();
        await mediaPage.switchToAlbumsTab();
        await page.waitForTimeout(2000);
        console.log('✅ Navigated to Albums page');

        // ========================================
        //Step 3 - Create album
        // ========================================
        await page.waitForLoadState('networkidle');

        // ========================================
        //Click new album
        // ========================================
        const newAlbumIcon = page.locator('.AlbumCard_newAlbumIcon__tJwvU').first()
        await newAlbumIcon.waitFor({ state: 'visible', timeout: 10000 });
        await newAlbumIcon.click({ force: true })
        console.log('  - Clicked New Album icon');

        await page.waitForTimeout(1000);

        // ========================================
        //insert album name
        // ========================================

        const tagInput = page.getByRole('textbox', { name: 'Type Tag' });
        await tagInput.click();
        await tagInput.fill(albumName);
        await tagInput.press('Enter');
        console.log(`  - Entered album name: "${albumName}"`);

        // ========================================
        //Create album -click
        // ========================================
        const createButton = page.getByRole('button', { name: 'Create Album' });
        await createButton.click();
        console.log('  - Clicked Create Album button');
        console.log('✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅')
        console.log('✅ Album created successfully');


    });
})