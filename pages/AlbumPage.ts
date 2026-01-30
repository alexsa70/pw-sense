import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AlbumPage - Page Object for KalSense Album functionality
 * Handles album creation, editing, deletion, and navigation
 */
export class AlbumPage extends BasePage {
  // Album creation
  private readonly newAlbumIcon: Locator;
  private readonly albumTagInput: Locator;
  private readonly createAlbumButton: Locator;
  
  // Album navigation
  private readonly albumsButton: Locator;
  
  // Toast notifications
  private readonly toastTitle: Locator;
  private readonly toastMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize album creation locators
    this.newAlbumIcon = this.getLocator('.AlbumCard_newAlbumIcon__tJwvU').first();
    this.albumTagInput = this.getByRole('textbox', { name: 'Type Tag' });
    this.createAlbumButton = this.getByRole('button', { name: 'Create Album' });
    
    // Initialize navigation locators
    this.albumsButton = this.getByRole('button', { name: 'Albums' });
    
    // Initialize toast locators
    this.toastTitle = this.getByTestId('toast-title');
    this.toastMessage = this.getByTestId('toast-message');
  }

  /**
   * Navigate to Albums section
   */
  async navigateToAlbums(): Promise<void> {
    await this.click(this.albumsButton);
    await this.waitForPageLoad();
  }

  /**
   * Click on "Create New Album" icon
   */
  async clickNewAlbum(): Promise<void> {
    await this.click(this.newAlbumIcon);
  }

  /**
   * Enter album tag/name
   * @param tag - album tag/name
   */
  async enterAlbumTag(tag: string): Promise<void> {
    await this.fill(this.albumTagInput, tag);
    await this.press(this.albumTagInput, 'Enter');
  }

  /**
   * Enter multiple tags for album
   * @param tags - array of tags
   */
  async enterMultipleTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.fill(this.albumTagInput, tag);
      await this.press(this.albumTagInput, 'Enter');
    }
  }

  /**
   * Click "Create Album" button
   */
  async clickCreateAlbum(): Promise<void> {
    await this.click(this.createAlbumButton);
  }

  /**
   * Complete album creation flow
   * @param albumName - name/tag for the album
   */
  async createAlbum(albumName: string): Promise<void> {
    await this.clickNewAlbum();
    await this.enterAlbumTag(albumName);
    await this.clickCreateAlbum();
    await this.waitForToast();
  }

  /**
   * Create album with multiple tags
   * @param tags - array of tags for the album
   */
  async createAlbumWithMultipleTags(tags: string[]): Promise<void> {
    await this.clickNewAlbum();
    await this.enterMultipleTags(tags);
    await this.clickCreateAlbum();
    await this.waitForToast();
  }

  /**
   * Get album card by position (nth)
   * @param position - position of album (1-based index)
   * @returns Locator for the album card
   */
  getAlbumCardByPosition(position: number): Locator {
    return this.getLocator(`div:nth-child(${position}) > .AlbumCard_albumImageWrapper__XFkz4 > .AlbumCard_newAlbumIcon__tJwvU`);
  }

  /**
   * Click on album by position
   * @param position - position of album (1-based index)
   */
  async clickAlbumByPosition(position: number): Promise<void> {
    const albumCard = this.getAlbumCardByPosition(position);
    await this.click(albumCard);
  }

  /**
   * Get album by name/tag
   * @param albumName - name/tag of the album
   * @returns Locator for the album
   */
  getAlbumByName(albumName: string): Locator {
    return this.getLocator('div').filter({ hasText: new RegExp(`^${albumName}$`) }).nth(1);
  }

  /**
   * Click on album by name
   * @param albumName - name/tag of the album
   */
  async clickAlbumByName(albumName: string): Promise<void> {
    const album = this.getAlbumByName(albumName);
    await this.click(album);
  }

  /**
   * Check if album exists by name
   * @param albumName - name/tag of the album
   * @returns true if album is visible
   */
  async isAlbumVisible(albumName: string): Promise<boolean> {
    const album = this.getAlbumByName(albumName);
    return await this.isVisible(album, 5000);
  }

  /**
   * Get toast notification title
   * @returns toast title text
   */
  async getToastTitle(): Promise<string> {
    return await this.getText(this.toastTitle);
  }

  /**
   * Get toast notification message
   * @returns toast message text
   */
  async getToastMessage(): Promise<string> {
    return await this.getText(this.toastMessage);
  }

  /**
   * Wait for toast notification to appear
   */
  async waitForToast(): Promise<void> {
    await this.waitForVisible(this.toastTitle, 10000);
  }

  /**
   * Check if toast notification is visible
   * @returns true if toast is visible
   */
  async isToastVisible(): Promise<boolean> {
    return await this.isVisible(this.toastTitle, 5000);
  }

  /**
   * Check if "Create New Album" icon is visible
   * @returns true if visible
   */
  async isNewAlbumIconVisible(): Promise<boolean> {
    return await this.isVisible(this.newAlbumIcon);
  }

  /**
   * Check if "Create Album" button is enabled
   * @returns true if enabled
   */
  async isCreateAlbumButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.createAlbumButton);
  }
}