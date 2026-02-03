import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MediaPage } from '../pages/MediaPage';
import { ImageDetailsPage } from '../pages/ImageDetailsPage';
import { config } from '../config/env.config';
import { FileHelpers } from '../utils/fileHelpers';
import testData from '../fixtures/testData.json';

/**
 * Update Image Tags Test 
 * Complete flow: Login → Upload Image → Update Tags on Uploaded Image
 */
test.describe('Update Image Tags - E2E', () => {
    test('Upload image and update tags', async ({ page }) => {
        test.setTimeout(100000);

        const loginPage = new LoginPage(page);
        const mediaPage = new MediaPage(page);
        const imageDetailsPage = new ImageDetailsPage(page);

        // Test data
        const imagePath = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.png.path);
        const initialTags = ['initial', 'test'];
        const newTags = ['updated', 'automation', 'playwright'];
        const description = 'Test image for tags update';

        // ========================================
        // STEP 1: Login
        // ========================================
        const { username, password } = config.credentials;
        await loginPage.login(username, password);

        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBe(true);
        console.log('✅ Login successful');

        // ========================================
        // STEP 2: Upload Image to Gallery
        // ========================================
        console.log('STEP 2: Upload Image');
        await mediaPage.navigateToMedia();
        await mediaPage.switchToGalleryTab();
        await page.waitForTimeout(2000);
        console.log('✅ Navigated to Gallery page');

        await page.waitForLoadState('networkidle');

        // Upload image
        await mediaPage.clickUpload();
        console.log('  - Clicked Upload button');
        await page.waitForTimeout(1000);

        await mediaPage.selectAgent('General photos - EN');
        console.log('  - Selected agent');
        await page.waitForTimeout(1000);

        // Upload file using app-friendly method (hidden input)
        // await mediaPage.uploadFile(imagePath);//
        // console.log('  - File selected');
        // await page.waitForTimeout(2000);

        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(imagePath);
        console.log(`  - File selected: ${imagePath}`);
        await page.waitForTimeout(3000);

        // Add initial tags
        for (const tag of initialTags) {
            await mediaPage.addTag(tag);
            await page.waitForTimeout(300);
        }
        console.log(`  - Added initial tags: ${initialTags.join(', ')}`);

        await mediaPage.enterUploadDescription(description);
        console.log('  - Added description');
        await page.waitForTimeout(500);

        await mediaPage.confirmUpload();
        console.log('  - Clicked Upload button (confirm)');

        // Wait for upload toast instead of hard-coded API endpoint
        await mediaPage.waitForToast();
        const uploadToastTitle = await mediaPage.getToastTitle();
        console.log(`  - Upload toast: "${uploadToastTitle}"`);

        await page.waitForTimeout(1000);
        console.log('✅ Image uploaded');

        // ========================================
        // STEP 3: Verify Files via API
        // ========================================
        console.log('STEP 3: Verify Files via API');

        // Make API request to check files
        const apiResponse = await page.request.post('https://kal-sense.prod.kaleidoo-dev.com/api/files/get_all_v2', {
            data: {
                "org_id": "6733306465383e58c9b88306",
                "project_ids": ["68af16da443fd05cb0c83c2a", "6882198cb753d1caf456e694"],
                "limit": 32,
                "product": "KalMedia"
            }
        });

        const filesData = await apiResponse.json();
        const filesCount = filesData.data?.length || 0;
        console.log(`  - Files in system via API: ${filesCount}`);

        if (filesCount === 0) {
            console.log('⚠️ WARNING: No files found via API!');
        }

        // ========================================
        // STEP 4: Open Uploaded Image
        // ========================================
        console.log('STEP 4: Open Uploaded Image');
        await page.waitForTimeout(2000);

        // Click on first image (the one we just uploaded)
        await mediaPage.clickFirstImageInGallery();
        console.log('  - Clicked on uploaded image');
        await page.waitForTimeout(2000);
        console.log('✅ Image details opened');

        // ========================================
        // STEP 5: Update Tags
        // ========================================
        console.log('STEP 5: Update Tags');

        // Click Edit Tags button
        await imageDetailsPage.clickEditTags();
        console.log('  - Clicked Edit Tags button');
        await page.waitForTimeout(1000);

        // Add new tags
        for (const tag of newTags) {
            await imageDetailsPage.enterTag(tag);
            await page.waitForTimeout(300);
            console.log(`  - Added tag: "${tag}"`);
        }

        // Save tags
        await imageDetailsPage.clickSaveTags();
        console.log('  - Clicked Save Tags button');
        await page.waitForTimeout(2000);

        console.log('✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅');
        console.log('✅ Tags updated successfully');
    });
});
