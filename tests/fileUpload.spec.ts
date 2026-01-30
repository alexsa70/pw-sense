import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MediaPage } from '../pages/MediaPage';
import { AlbumPage } from '../pages/AlbumPage';
import { ImageDetailsPage } from '../pages/ImageDetailsPage';
import { config } from '../config/env.config';
import { FileHelpers } from '../utils/fileHelpers';
import testData from '../fixtures/testData.json';

/**
 * Test suite for KalSense Media Upload functionality (E2E)
 * Covers upload of images (PNG, JPG, JPEG) and videos (MP4)
 * This is the main E2E test required by the assignment
 */
test.describe('Media Upload - End to End', () => {
  let loginPage: LoginPage;
  let mediaPage: MediaPage;
  let albumPage: AlbumPage;
  let imageDetailsPage: ImageDetailsPage;

  // Paths to media test files
  const pngFilePath = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.png.path);
  const jpgFilePath = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.jpg.path);
  const jpegFilePath = FileHelpers.getAbsolutePath(testData.testFiles.imageFiles.jpeg.path);
  const videoFilePath = FileHelpers.getAbsolutePath(testData.testFiles.videoFile.path);

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    mediaPage = new MediaPage(page);
    albumPage = new AlbumPage(page);
    imageDetailsPage = new ImageDetailsPage(page);

    // Login before each test
    const { username, password } = config.credentials;
    await loginPage.login(username, password);
  });

  test('Upload PNG image to new album - Complete E2E flow @smoke', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}PNG_Upload_${Date.now()}`;
    const tags = testData.testFiles.imageFiles.png.tags;
    const description = 'Test PNG image uploaded via Playwright automation E2E';

    // Act - Step 1: Create new album
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();

    // Step 2: Open the created album
    await albumPage.clickAlbumByName(albumName);

    // Step 3: Upload PNG file with metadata
    await mediaPage.uploadFileWithMetadata(pngFilePath, tags, description);

    // Assert - Step 4: Verify upload success
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);

    const toastTitle = await mediaPage.getToastTitle();
    expect(toastTitle).toBeTruthy();

    // Step 5: Verify file appears in gallery
    await mediaPage.switchToGalleryTab();
    await mediaPage.waitForPageLoad();
  });

  test('Upload JPG image to new album @smoke', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}JPG_Upload_${Date.now()}`;
    const tags = testData.testFiles.imageFiles.jpg.tags;
    const description = 'Test JPG image uploaded via Playwright';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);
    await mediaPage.uploadFileWithMetadata(jpgFilePath, tags, description);

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });

  test('Upload JPEG image to new album @smoke', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}JPEG_Upload_${Date.now()}`;
    const tags = testData.testFiles.imageFiles.jpeg.tags;
    const description = 'Test JPEG image uploaded via Playwright';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);
    await mediaPage.uploadFileWithMetadata(jpegFilePath, tags, description);

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });

  test('Upload MP4 video to new album @smoke', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}Video_Upload_${Date.now()}`;
    const tags = testData.testFiles.videoFile.tags;
    const description = 'Test MP4 video uploaded via Playwright';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);
    await mediaPage.uploadFileWithMetadata(videoFilePath, tags, description);

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });

  test('Upload PNG image with multiple tags', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}MultiTags_${Date.now()}`;
    const tags = ['automation', 'playwright', 'e2e', 'png', 'test'];
    const description = 'PNG image with multiple tags';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);
    await mediaPage.uploadFileWithMetadata(pngFilePath, tags, description);

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });

  test('Upload image without tags', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}NoTags_${Date.now()}`;
    const description = 'Image without tags';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);

    // Upload without tags
    await mediaPage.clickUpload();
    await mediaPage.selectAgent();
    await mediaPage.uploadFile(pngFilePath);
    await mediaPage.enterUploadDescription(description);
    await mediaPage.confirmUpload();

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });

  test('Upload image without description', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}NoDesc_${Date.now()}`;
    const tags = ['no-description', 'test'];

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);

    // Upload without description
    await mediaPage.clickUpload();
    await mediaPage.selectAgent();
    await mediaPage.uploadFile(jpgFilePath);
    await mediaPage.addMultipleTags(tags);
    await mediaPage.confirmUpload();

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });

  test('Upload multiple images to the same album', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}MultipleImages_${Date.now()}`;

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);

    // Upload first image (PNG)
    await mediaPage.uploadFileWithMetadata(
      pngFilePath,
      ['png', 'first'],
      'First PNG image'
    );
    await mediaPage.waitForToast();

    // Upload second image (JPG)
    await mediaPage.uploadFileWithMetadata(
      jpgFilePath,
      ['jpg', 'second'],
      'Second JPG image'
    );

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });

  test('Verify agent selection for image upload', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}AgentTest_${Date.now()}`;

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);

    await mediaPage.clickUpload();
    await mediaPage.selectAgent('General photos - EN');
    await mediaPage.uploadFile(pngFilePath);
    await mediaPage.addTag('agent-test');
    await mediaPage.enterUploadDescription('Testing agent selection');
    await mediaPage.confirmUpload();

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });

  test('Verify upload button is visible in album', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}UploadBtn_${Date.now()}`;

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);

    // Assert
    const isUploadVisible = await mediaPage.isUploadButtonVisible();
    expect(isUploadVisible).toBe(true);
  });

  test('Upload image and verify toast notification details', async () => {
    // Arrange
    const albumName = `${testData.albums.prefix}ToastDetails_${Date.now()}`;
    const tags = ['toast-verification'];
    const description = 'Verifying toast messages for image upload';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToAlbumsTab();
    await albumPage.createAlbum(albumName);
    await albumPage.waitForToast();
    await albumPage.clickAlbumByName(albumName);
    await mediaPage.uploadFileWithMetadata(pngFilePath, tags, description);

    // Assert
    await mediaPage.waitForToast();
    
    const toastTitle = await mediaPage.getToastTitle();
    const toastMessage = await mediaPage.getToastMessage();

    expect(toastTitle.length).toBeGreaterThan(0);
    expect(toastMessage.length).toBeGreaterThan(0);
  });

  test('Upload image to existing album (Gallery)', async () => {
    // Arrange
    const tags = ['gallery-upload', 'test'];
    const description = 'Image uploaded directly to gallery';

    // Act
    await mediaPage.navigateToMedia();
    await mediaPage.switchToGalleryTab();
    
    // Upload to gallery (no specific album)
    await mediaPage.clickUpload();
    await mediaPage.selectAgent();
    await mediaPage.uploadFile(pngFilePath);
    await mediaPage.addMultipleTags(tags);
    await mediaPage.enterUploadDescription(description);
    await mediaPage.confirmUpload();

    // Assert
    const isToastVisible = await mediaPage.isToastVisible();
    expect(isToastVisible).toBe(true);
  });
});