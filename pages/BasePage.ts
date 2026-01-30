import { Page, Locator } from '@playwright/test';

/**
 * BasePage - parent class for all Page Objects
* Uses Playwright's modern Locator API approach
* Contains common methods for working with pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Redirect to the specified URL
   * @param url - relative or absolute URL
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Getting a locator by selector
   * @param selector - CSS selector, data-testid, role, etc.
   * @returns Locator object
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Obtaining a locator by data-testid
   * @param testId - value of the data-testid attribute
   * @returns Locator object
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Getting a locator by text
   * @param text - element text
   * @param exact - exact match (default false)
   * @returns Locator object
   */
  getByText(text: string, exact: boolean = false): Locator {
    return this.page.getByText(text, { exact });
  }

  /**
   *Getting a locator by role
   * @param role - ARIA role
   * @param options - additional options (name, etc.)
   * @returns Locator object
   */
  getByRole(role: string, options?: { name?: string | RegExp }): Locator {
    return this.page.getByRole(role as any, options);
  }

  /**
   * Click on an element
   * @param locator - Locator object
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Entering text in the field
   * @param locator - Locator object
   * @param text - text to be entered
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Getting the text of an element
   * @param locator - Locator object
   * @returns text of the element
   */
  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  /**
   * Checking element visibility
   * @param locator - Locator object
   * @param timeout - wait timeout (default 5000ms)
   * @returns true if the element is visible, false if not
   */
  async isVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Waiting for element visibility
   * @param locator - Locator object
   * @param timeout - waiting timeout (default 10000ms)
   */
  async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Ожидание исчезновения элемента
   * @param locator - Locator объект
   * @param timeout - таймаут ожидания (по умолчанию 10000ms)
   */
  async waitForHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Waiting for page to load(networkidle)
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Waiting DOM Content Loaded
   */
  async waitForDOMLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Scroll to element
   * @param locator - Locator объект
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   *Screenshot of the page
   * @param name - file name (without extension)
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/${name}.png`, 
      fullPage: true 
    });
  }

  /**
   * Pressing a key
   * @param locator - Locator объект
   * @param key - key name (Enter, Escape и т.д.)
   */
  async press(locator: Locator, key: string): Promise<void> {
    await locator.press(key);
  }

  /**
   * Getting the value of an element attribute
   * @param locator - Locator объект
   * @param attribute - attribute name
   * @returns attribute value or null
   */
  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return await locator.getAttribute(attribute);
  }

  /**
   * Verify that the element is enabled (not disabled)
   * @param locator - Locator object
   * @returns true if the element enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Verify that the checkbox/radio button is selected
   * @param locator - Locator object
   * @returns true if marked
   */
  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  /**
   * Getting the current URL
   * @returnscurrent page URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Getting the page title
   * @returns title pages
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Return to previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Moving forward
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }
}