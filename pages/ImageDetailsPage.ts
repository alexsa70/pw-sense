import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ImageDetailsPage - Page Object for image details functionality
 * Handles editing tags, descriptions for images
 */
export class ImageDetailsPage extends BasePage {
  // Tag editing
  private readonly editTagsButton: Locator;
  private readonly tagInput: Locator;
  private readonly saveTagsButton: Locator;
  
  // Description editing
  private readonly editDescriptionButton: Locator;
  private readonly descriptionInput: Locator;
  private readonly saveDescriptionButton: Locator;
  private readonly cancelDescriptionButton: Locator;
  
  // Add to project
  private readonly addToProjectButton: Locator;
  
  // Toast notifications
  private readonly toastTitle: Locator;
  private readonly toastMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize tag editing locators
    this.editTagsButton = this.getByTestId('edit-tags');
    this.tagInput = this.getByRole('textbox', { name: 'Type A Tag' });
    this.saveTagsButton = this.getByTestId('save-tags');
    
    // Initialize description editing locators
    this.editDescriptionButton = this.getByTestId('edit-description');
    this.descriptionInput = this.getByRole('textbox', { name: /Enter description for/ });
    this.saveDescriptionButton = this.getByTestId('save-description-edit');
    this.cancelDescriptionButton = this.getByTestId('cancel-description-edit');
    
    // Initialize project locators
    this.addToProjectButton = this.getByTestId('add-to-project');
    
    // Initialize toast locators
    this.toastTitle = this.getByTestId('toast-title');
    this.toastMessage = this.getByTestId('toast-message');
  }

  /**
   * Click "Edit Tags" button
   */
  async clickEditTags(): Promise<void> {
    await this.click(this.editTagsButton);
  }

  /**
   * Enter a tag
   * @param tag - tag name to add
   */
  async enterTag(tag: string): Promise<void> {
    await this.fill(this.tagInput, tag);
    await this.press(this.tagInput, 'Enter');
  }

  /**
   * Add multiple tags
   * @param tags - array of tag names
   */
  async addMultipleTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.enterTag(tag);
    }
  }

  /**
   * Click "Save Tags" button
   */
  async clickSaveTags(): Promise<void> {
    await this.click(this.saveTagsButton);
  }

  /**
   * Complete flow to update image tags
   * @param tags - array of tags to add
   */
  async updateImageTags(tags: string[]): Promise<void> {
    await this.clickEditTags();
    await this.addMultipleTags(tags);
    await this.clickSaveTags();
    await this.waitForPageLoad();
  }

  /**
   * Click "Edit Description" button
   */
  async clickEditDescription(): Promise<void> {
    await this.click(this.editDescriptionButton);
  }

  /**
   * Enter description text
   * @param description - description text
   */
  async enterDescription(description: string): Promise<void> {
    await this.fill(this.descriptionInput, description);
  }

  /**
   * Click "Save Description" button
   */
  async clickSaveDescription(): Promise<void> {
    await this.click(this.saveDescriptionButton);
  }

  /**
   * Click "Cancel Description" button
   */
  async clickCancelDescription(): Promise<void> {
    await this.click(this.cancelDescriptionButton);
  }

  /**
   * Complete flow to update image description
   * @param description - description text
   */
  async updateImageDescription(description: string): Promise<void> {
    await this.clickEditDescription();
    await this.enterDescription(description);
    await this.clickSaveDescription();
    await this.waitForPageLoad();
  }

  /**
   * Click "Add to Project" button
   */
  async clickAddToProject(): Promise<void> {
    await this.click(this.addToProjectButton);
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
   * Check if "Edit Tags" button is visible
   * @returns true if visible
   */
  async isEditTagsButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.editTagsButton);
  }

  /**
   * Check if "Edit Description" button is visible
   * @returns true if visible
   */
  async isEditDescriptionButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.editDescriptionButton);
  }

  /**
   * Check if "Save Tags" button is visible
   * @returns true if visible
   */
  async isSaveTagsButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.saveTagsButton);
  }

  /**
   * Check if tag input is visible
   * @returns true if visible
   */
  async isTagInputVisible(): Promise<boolean> {
    return await this.isVisible(this.tagInput);
  }

  /**
   * Check if description input is visible
   * @returns true if visible
   */
  async isDescriptionInputVisible(): Promise<boolean> {
    return await this.isVisible(this.descriptionInput);
  }

  /**
   * Get current tag input value
   * @returns current input value
   */
  async getTagInputValue(): Promise<string> {
    return await this.tagInput.inputValue();
  }

  /**
   * Get current description input value
   * @returns current input value
   */
  async getDescriptionInputValue(): Promise<string> {
    return await this.descriptionInput.inputValue();
  }
}