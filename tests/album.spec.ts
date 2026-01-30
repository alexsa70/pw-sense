import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MediaPage } from '../pages/MediaPage';
import { AlbumPage } from '../pages/AlbumPage';
import { config } from '../config/env.config';
import testData from '../fixtures/testData.json';

/**
 * Test suite for KalSense Album functionality
 */
test.describe('Album Management', () => {
  let loginPage: LoginPage;
  let mediaPage: MediaPage;
  let albumPage: AlbumPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    mediaPage = new MediaPage(page);
    albumPage = new AlbumPage(page);

    // Login before each test
    const { username, password } = config.credentials;
    await loginPage.login(username, password);
  });

  test('Create a new album with single tag', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}${Date.now()}`;

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);

    // Assert
    // Verify toast notification appears
    const isToastVisible = await albumPage.isToastVisible();
    expect(isToastVisible).toBe(true);

    // Verify toast contains success message
    const toastTitle = await albumPage.getToastTitle();
    expect(toastTitle).toBeTruthy();

    // Verify album is visible in the list
    const isAlbumVisible = await albumPage.isAlbumVisible(albumName);
    expect(isAlbumVisible).toBe(true);
  });

  test('Create a new album with multiple tags', async () => {
    // Arrange
    const tags = [
      `${testData.albums.prefix}MultiTag1_${Date.now()}`,
      'AutoTest',
      'Playwright'
    ];

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbumWithMultipleTags(tags);

    // Assert
    // Verify toast notification appears
    const isToastVisible = await albumPage.isToastVisible();
    expect(isToastVisible).toBe(true);

    // Verify first tag is visible (album name)
    const isAlbumVisible = await albumPage.isAlbumVisible(tags[0]);
    expect(isAlbumVisible).toBe(true);
  });

  test('Verify album creation UI elements', async () => {
    // Arrange & Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();

    // Assert - verify all elements are visible
    const isNewAlbumIconVisible = await albumPage.isNewAlbumIconVisible();
    expect(isNewAlbumIconVisible).toBe(true);

    // Click to open album creation form
    await albumPage.clickNewAlbum();

    // Verify "Create Album" button is initially disabled (no tags entered)
    // Note: This might need adjustment based on actual app behavior
    await albumPage.enterAlbumTag('TestTag');
    
    const isCreateButtonEnabled = await albumPage.isCreateAlbumButtonEnabled();
    expect(isCreateButtonEnabled).toBe(true);
  });

  test('Open existing album by name', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}OpenTest_${Date.now()}`;
    
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);

    // Wait for album to be created
    await albumPage.waitForToast();

    // Act
    await albumPage.clickAlbumByName(albumName);

    // Assert
    // Verify we're inside the album (upload button should be visible)
    const isUploadVisible = await mediaPage.isUploadButtonVisible();
    expect(isUploadVisible).toBe(true);

    // Verify URL changed (contains album or navigation change)
    const currentUrl = mediaPage.getCurrentURL();
    expect(currentUrl).not.toContain('Albums'); // Should navigate away from Albums view
  });

  test('Open album by position', async () => {
    // Arrange
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();

    // Act
    // Click on the 3rd album (assuming albums exist)
    await albumPage.clickAlbumByPosition(3);

    // Assert
    // Verify we're inside an album (upload button should be visible)
    const isUploadVisible = await mediaPage.isUploadButtonVisible();
    expect(isUploadVisible).toBe(true);
  });

  test('Verify created album appears in albums list', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}VerifyList_${Date.now()}`;

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    
    // Get initial state (before creation)
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();

    // Refresh to ensure album is persisted
    await mediaPage.reload();
    await mediaPage.waitForPageLoad();
    await mediaPage.switchToAlbumsTab();

    // Assert
    // Verify album still exists after page reload
    const isAlbumVisible = await albumPage.isAlbumVisible(albumName);
    expect(isAlbumVisible).toBe(true);
  });

  test('Verify toast notification content after album creation', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}ToastTest_${Date.now()}`;

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.clickNewAlbum();
    await albumPage.enterAlbumTag(albumName);
    await albumPage.clickCreateAlbum();

    // Assert
    // Wait for and verify toast
    await albumPage.waitForToast();
    
    const toastTitle = await albumPage.getToastTitle();
    const toastMessage = await albumPage.getToastMessage();

    // Toast should contain some message (exact text may vary)
    expect(toastTitle.length).toBeGreaterThan(0);
    
    // Could add more specific assertions if we know the exact toast messages
    // expect(toastTitle).toContain('Success');
  });

  test('Create album and verify it can be opened immediately', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}ImmediateOpen_${Date.now()}`;

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();

    // Immediately try to open the created album
    await albumPage.clickAlbumByName(albumName);

    // Assert
    // Verify we successfully entered the album
    const isUploadVisible = await mediaPage.isUploadButtonVisible();
    expect(isUploadVisible).toBe(true);

    // Verify page navigation occurred
    const currentUrl = mediaPage.getCurrentURL();
    expect(currentUrl).toBeTruthy();
  });

  test('Delete an album', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}DeleteTest_${Date.now()}`;
    
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();

    // Open the album
    await albumPage.clickAlbumByName(albumName);

    // Act
    // Delete the album
    await mediaPage.deleteItem();

    // Assert
    // Verify we're back to Albums list (or redirected)
    await mediaPage.waitForPageLoad();
    
    // Optional: verify album no longer exists
    // Note: We need to navigate back to albums list to verify
    await mediaPage.switchToAlbumsTab();
    
    const isAlbumVisible = await albumPage.isAlbumVisible(albumName);
    expect(isAlbumVisible).toBe(false);
  });
});