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

  // More actions
  private readonly moreActionsButton: Locator;
  private readonly deleteOption: Locator;
  private readonly confirmButton: Locator;




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


    // More actions: data-testid="more-actions"; Delete: getByText per codegen
    this.moreActionsButton = this.getByTestId('more-actions');
    this.deleteOption = this.getByText('Delete');
    this.confirmButton = this.getByTestId('button-confirm');
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
    try {
      await this.waitForVisible(this.newAlbumIcon, 10000);
      await this.scrollToElement(this.newAlbumIcon);
      await this.click(this.newAlbumIcon);
      return;
    } catch {
      // Re-open Albums via sidebar if list didn't render
      await this.page.getByTestId('Media').click({ force: true });
      await this.page
        .getByRole('menuitem', { name: 'Albums' })
        .getByRole('button', { name: 'Albums' })
        .click({ force: true });
    }

    // Fallback: click the first new-album icon even if not marked visible
    const fallbackIcon = this.page.locator('.AlbumCard_newAlbumIcon__tJwvU').first();
    await fallbackIcon.waitFor({ state: 'attached', timeout: 10000 });
    await fallbackIcon.click({ force: true });
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
    // Previous approach (generic text search):
    // return this.page.getByText(albumName, { exact: false }).first();
    // New approach: target album title text by data-testid and filter by name
    return this.page
      .getByTestId('undefined-truncated-text')
      .filter({ hasText: albumName })
      .first();
  }

  /**
   * Click on album by name using alternative approach (data-testid or class)
   * @param albumName - name/tag of the album
   * @returns Locator for the album
   */
  getAlbumByNameAlternative(albumName: string): Locator {
    // Try to find album card that contains the text
    return this.page.locator('.AlbumCard_albumImageWrapper__XFkz4, [data-testid*="album"]')
      .filter({ hasText: albumName })
      .first();
  }

  /**
   * Debug method: Get all album names visible on page
   * @returns Array of album names
   */
  async getAllAlbumNames(): Promise<string[]> {
    // Wait for albums to load
    await this.page.waitForTimeout(2000);

    // Get all text content from album cards
    const albums = await this.page.locator('.AlbumCard_albumImageWrapper__XFkz4, [class*="album"]').all();
    const names: string[] = [];

    for (const album of albums) {
      const text = await album.textContent();
      if (text && text.trim()) {
        names.push(text.trim());
      }
    }

    console.log('📋 Found albums:', names);
    return names;
  }

  /**
   * Click on album by name
   * @param albumName - name/tag of the album
   */
  async clickAlbumByName(albumName: string): Promise<void> {
    // const album = this.getAlbumByName(albumName);
    // await this.click(album);
    // Wait a bit for albums to render
    await this.page.waitForTimeout(1000);

    try {
      // Try primary method
      const album = this.getAlbumByName(albumName);
      await this.click(album);
    } catch {
      // Try alternative method if primary fails
      const album = this.getAlbumByNameAlternative(albumName);
      await this.click(album);
    }
  }

  /**
   * Check if album exists by name
   * @param albumName - name/tag of the album
   * @returns true if album is visible
   */
  async isAlbumVisible(albumName: string): Promise<boolean> {
    try {
      const album = this.getAlbumByName(albumName);
      await album.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      try {
        const album = this.getAlbumByNameAlternative(albumName);
        await album.waitFor({ state: 'visible', timeout: 10000 });
        return true;
      } catch {
        return false;
      }
    }
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


  //Delete item (album or file)
  /**
   * Open more actions menu
   */
  async openMoreActions(): Promise<void> {
    await this.click(this.moreActionsButton);
  }

  // Delete item (album or file)
  async deleteItem(): Promise<void> {
    await this.openMoreActions();
    await this.deleteOption.waitFor({ state: 'visible', timeout: 5000 });
    await this.click(this.deleteOption);
    await this.confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.confirmButton.click({ force: true });
  }
}