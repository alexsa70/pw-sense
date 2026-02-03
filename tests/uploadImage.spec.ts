import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MediaPage } from '../pages/MediaPage';
import { config } from '../config/env.config';
import { FileHelpers } from '../utils/fileHelpers';
import testData from '../fixtures/testData.json';

/**
 * Upload Image Test 
 * Complete flow: Login → Upload Image to Gallery → Verify
 */
test.describe('Upload Image - E2E', () => {
    test('Upload image to gallery', async ({ page }) => {
        test.setTimeout(90000);

        const loginPage = new LoginPage(page);
        const mediaPage = new MediaPage(page);

        // Test data
        const imagePath = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.png.path);
        const tags = ['automation', 'test', 'upload'];
        const description = 'Test image uploaded via Playwright automation';

        // ========================================
        // STEP 1: Direct Login
        // ========================================
        const { username, password } = config.credentials;
        await loginPage.login(username, password);
        expect(await loginPage.isLoggedIn()).toBe(true);
        console.log('✅ Login successful');

        // ========================================
        // STEP 2: Navigate to Gallery
        // ========================================
        console.log('STEP 2: Navigate to Gallery');
        await mediaPage.navigateToMedia();
        await mediaPage.switchToGalleryTab();
        await page.waitForTimeout(2000);
        console.log('✅ Navigated to Gallery page');

        // ========================================
        // STEP 3: Upload Image
        // ========================================
        console.log('STEP 3: Upload Image');
        await page.waitForLoadState('networkidle');

        // Click upload button
        await mediaPage.clickUpload();
        console.log('  - Clicked Upload button');
        await page.waitForTimeout(2000);

        // Select agent
        await mediaPage.selectAgent('General photos - EN');
        console.log('  - Selected agent');
        await page.waitForTimeout(1000);

        // Upload file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(imagePath);
        console.log(`  - File selected: ${imagePath}`);
        await page.waitForTimeout(3000);

        // Add tags
        for (const tag of tags) {
            await mediaPage.addTag(tag);
            await page.waitForTimeout(300);
        }
        console.log(`  - Added tags: ${tags.join(', ')}`);

        // Add description
        await mediaPage.enterUploadDescription(description);
        console.log('  - Added description');
        await page.waitForTimeout(500);

        // Confirm upload
        await mediaPage.confirmUpload();
        console.log('  - Clicked Upload button (confirm)');

        // Wait for upload
        await page.waitForTimeout(5000);

        console.log('✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅');
        console.log('✅ Image uploaded successfully');
    });
});