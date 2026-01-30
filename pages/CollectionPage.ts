import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CollectionPage - Page Object for KalSense Collection functionality
 * Handles adding files to collections and collection management
 */
export class CollectionPage extends BasePage {
  // Collection actions
  private readonly addToProjectButton: Locator;
  private readonly createNewCollectionIcon: Locator;
  private readonly collectionNameInput: Locator;
  private readonly createCollectionButton: Locator;
  
  // File actions
  private readonly expandIcon: Locator;
  
  // Toast notifications
  private readonly toastTitle: Locator;
  private readonly toastMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize collection action locators
    this.addToProjectButton = this.getByTestId('add-to-project');
    this.createNewCollectionIcon = this.getLocator('.lucide');
    this.collectionNameInput = this.getByTestId('name');
    this.createCollectionButton = this.getByTestId('create');
    
    // Initialize file action locators
    this.expandIcon = this.getLocator('div').filter({ hasText: /^▶$/ }).first();
    
    // Initialize toast locators
    this.toastTitle = this.getByTestId('toast-title');
    this.toastMessage = this.getByTestId('toast-message');
  }

  /**
   * Click on "Add to Project/Collection" button
   */
  async clickAddToProject(): Promise<void> {
    await this.click(this.addToProjectButton);
  }

  /**
   * Click on "Create New Collection" icon
   */
  async clickCreateNewCollection(): Promise<void> {
    await this.click(this.createNewCollectionIcon);
  }

  /**
   * Enter collection name
   * @param name - collection name
   */
  async enterCollectionName(name: string): Promise<void> {
    await this.fill(this.collectionNameInput, name);
  }

  /**
   * Click "Create" button to create collection
   */
  async clickCreate(): Promise<void> {
    await this.click(this.createCollectionButton);
  }

  /**
   * Complete flow to add file to new collection
   * @param collectionName - name for the new collection
   */
  async addFileToNewCollection(collectionName: string): Promise<void> {
    await this.clickAddToProject();
    await this.clickCreateNewCollection();
    await this.enterCollectionName(collectionName);
    await this.clickCreate();
    await this.waitForToast();
  }

  /**
   * Expand/collapse file or folder
   */
  async clickExpandIcon(): Promise<void> {
    await this.click(this.expandIcon);
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
   * Check if "Add to Project" button is visible
   * @returns true if visible
   */
  async isAddToProjectButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.addToProjectButton);
  }

  /**
   * Check if collection name input is visible
   * @returns true if visible
   */
  async isCollectionNameInputVisible(): Promise<boolean> {
    return await this.isVisible(this.collectionNameInput);
  }

  /**
   * Check if "Create" button is enabled
   * @returns true if enabled
   */
  async isCreateButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.createCollectionButton);
  }

  /**
   * Get collection name input value
   * @returns current input value
   */
  async getCollectionNameValue(): Promise<string> {
    return await this.collectionNameInput.inputValue();
  }
}