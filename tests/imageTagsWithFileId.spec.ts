import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MediaPage } from '../pages/MediaPage';
import { ImageDetailsPage } from '../pages/ImageDetailsPage';
import { config } from '../config/env.config';
import testData from '../fixtures/testData.json';

/**
 * Test suite for Image Tags Update using specific file IDs
 * This approach works with already uploaded files in the system
 * 
 * Note: This test requires manual setup:
 * 1. Upload an image to the system
 * 2. Get the file ID from the image card data-testid
 * 3. Update the FILE_ID constant below
 */
test.describe('Image Tags Update - With File ID', () => {
  let loginPage: LoginPage;
  let mediaPage: MediaPage;
  let imageDetailsPage: ImageDetailsPage;

  // TODO: Replace with actual file ID from your uploaded image
  // Example: '21f0e514-7d5c-40f3-af3f-3f3be935837f.png-4'
  const FILE_ID = '21f0e514-7d5c-40f3-af3f-3f3be935837f.png-4';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    mediaPage = new MediaPage(page);
    imageDetailsPage = new ImageDetailsPage(page);

    // Login before each test
    const { username, password } = config.credentials;
    await loginPage.login(username, password);
  });

  test.skip('Update tags for specific image by file ID @manual-setup', async () => {
    // Note: This test is skipped by default because it requires manual file ID setup
    // To use: 
    // 1. Upload an image
    // 2. Get its file ID
    // 3. Update FILE_ID constant above
    // 4. Remove test.skip

    // Arrange
    const newTags = ['AlexL_Boot_Img', 'Updated_Tag', 'Test_Tag'];

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToGalleryTab();

    // Click on specific image by file ID
    await mediaPage.clickImageCard(FILE_ID);

    // Update tags
    await imageDetailsPage.updateImageTags(newTags);

    // Assert
    await mediaPage.waitForPageLoad();
    expect(mediaPage.getCurrentURL()).toBeTruthy();
  });

  test.skip('Add description to specific image @manual-setup', async () => {
    // Arrange
    const description = 'AlexL uploaded this file for testing - Updated description';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToGalleryTab();

    // Click on specific image
    await mediaPage.clickImageCard(FILE_ID);

    // Update description
    await imageDetailsPage.updateImageDescription(description);

    // Assert
    await mediaPage.waitForPageLoad();
    expect(mediaPage.getCurrentURL()).toBeTruthy();
  });

  test.skip('Update both tags and description for image @manual-setup', async () => {
    // Arrange
    const newTags = ['comprehensive-test', 'tags-and-description'];
    const description = 'Both tags and description updated in this test';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToGalleryTab();

    // Click on image
    await mediaPage.clickImageCard(FILE_ID);

    // Update tags first
    await imageDetailsPage.updateImageTags(newTags);
    await mediaPage.waitForPageLoad();

    // Then update description
    await imageDetailsPage.updateImageDescription(description);

    // Assert
    await mediaPage.waitForPageLoad();
    expect(mediaPage.getCurrentURL()).toBeTruthy();
  });

  test.skip('Verify edit tags and description buttons are visible @manual-setup', async () => {
    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToGalleryTab();

    // Click on image
    await mediaPage.clickImageCard(FILE_ID);

    // Assert - both buttons should be visible
    const isEditTagsVisible = await imageDetailsPage.isEditTagsButtonVisible();
    const isEditDescVisible = await imageDetailsPage.isEditDescriptionButtonVisible();

    expect(isEditTagsVisible).toBe(true);
    expect(isEditDescVisible).toBe(true);
  });
});

/**
 * Helper test to get file IDs from gallery
 * Run this test to discover file IDs of uploaded images
 */
test.describe('Helper - Get File IDs', () => {
  let loginPage: LoginPage;
  let mediaPage: MediaPage;

  test('List all image cards with data-testid to get file IDs', async ({ page }) => {
    // This test helps you find file IDs for use in other tests

    loginPage = new LoginPage(page);
    mediaPage = new MediaPage(page);

    const { username, password } = config.credentials;
    await loginPage.login(username, password);

    await mediaPage.navigateToMedia();
    await mediaPage.switchToGalleryTab();
    await mediaPage.waitForPageLoad();

    // Get all image cards
    const imageCards = page.locator('[data-testid*="imageCard"]');
    const count = await imageCards.count();

    console.log(`\n📸 Found ${count} image cards in gallery:`);
    console.log('================================');

    for (let i = 0; i < count; i++) {
      const testId = await imageCards.nth(i).getAttribute('data-testid');
      console.log(`${i + 1}. File ID: ${testId}`);
    }

    console.log('================================\n');
    console.log('💡 Copy a File ID from above and use it in your tests');
    console.log('💡 Update the FILE_ID constant in imageTagsWithFileId.spec.ts\n');

    expect(count).toBeGreaterThanOrEqual(0);
  });
});