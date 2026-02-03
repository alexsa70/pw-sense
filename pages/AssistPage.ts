import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AssistPage - Page Object for KalSense Assist (AI Assistant) functionality
 * Handles chat, questions, file upload, and connector selection
 */
export class AssistPage extends BasePage {
    // Navigation
    private readonly assistMenuItem: Locator;

    // Welcome elements
    private readonly welcomeMessage: Locator;
    private readonly welcomeDialog: Locator;

    // Chat elements
    private readonly chatTextarea: Locator;
    private readonly sendButton: Locator;
    private readonly answerContainer: Locator;

    // Results
    private readonly resultsTitle: Locator;

    // Upload elements
    private readonly uploadButton: Locator;
    private readonly uploadFileText: Locator;
    private readonly connectorText: Locator;
    private readonly connectorDropdownIcon: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize navigation locators
        this.assistMenuItem = this.getByTestId('Assist');

        // Initialize welcome locators
        this.welcomeMessage = this.getByTestId('assist-welcome-message');
        this.welcomeDialog = this.page.locator('div').filter({
            hasText: /^Hi Tester, how can I help you today\?$/
        });

        // Initialize chat locators
        this.chatTextarea = this.getByTestId('chat-textarea');
        this.sendButton = this.getByTestId('send-button'); // If exists
        this.answerContainer = this.getLocator('.SearchRes_answerContainer__jxuKt');

        // Initialize results locators
        this.resultsTitle = this.getByText('Results');

        // Initialize upload locators
        this.uploadButton = this.getByTestId('upload');
        this.uploadFileText = this.getByText('Upload File');
        this.connectorText = this.getByText('Select A Connector For The');
        //this.connectorDropdownIcon = this.getLocator('.AgentSelectField_selectFieldDropdownIcon__j\\+2Tw > path');
        this.connectorDropdownIcon = this.getByTestId('agent-select');
    }

    /**
     * Navigate to Assist page
     */
    async navigateToAssist(): Promise<void> {
        await this.click(this.assistMenuItem);
        await this.waitForPageLoad();
    }

    /**
     * Check if welcome message is visible
     * @returns true if visible
     */
    async isWelcomeMessageVisible(): Promise<boolean> {
        return await this.isVisible(this.welcomeMessage);
    }

    /**
     * Check if welcome dialog with greeting text exists
     * @returns true if exists
     */
    async isWelcomeDialogVisible(): Promise<boolean> {
        const count = await this.welcomeDialog.count();
        return count > 0;
    }

    /**
     * Check if Results title is visible
     * @returns true if visible
     */
    async isResultsTitleVisible(): Promise<boolean> {
        return await this.isVisible(this.resultsTitle);
    }

    /**
     * Enter text in chat textarea
     * @param text - text to enter
     */
    async enterChatMessage(text: string): Promise<void> {
        await this.click(this.chatTextarea);
        await this.fill(this.chatTextarea, text);
    }

    /**
     * Send chat message (press Enter)
     */
    async sendChatMessage(): Promise<void> {
        await this.press(this.chatTextarea, 'Enter');
    }

    /**
     * Type and send chat message
     * @param message - message to send
     */
    async askQuestion(message: string): Promise<void> {
        await this.enterChatMessage(message);
        await this.sendChatMessage();
    }

    /**
     * Check if answer container appeared
     * @returns true if answer exists
     */
    async hasAnswerAppeared(): Promise<boolean> {
        const count = await this.answerContainer.count();
        return count > 0;
    }

    /**
     * Get answer text
     * @returns answer text or empty string
     */
    async getAnswerText(): Promise<string> {
        try {
            return await this.getText(this.answerContainer.first());
        } catch {
            return '';
        }
    }

    /**
     * Click upload button
     */
    async clickUpload(): Promise<void> {
        await this.click(this.uploadButton);
    }

    /**
     * Check if upload dialog is open
     * @returns true if upload file text is visible
     */
    async isUploadDialogOpen(): Promise<boolean> {
        try {
            return await this.uploadFileText.nth(1).isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    /**
     * Check if connector selection is visible
     * @returns true if visible
     */
    async isConnectorSelectionVisible(): Promise<boolean> {
        return await this.isVisible(this.connectorText);
    }

    /**
     * Open connector dropdown
     */
    async openConnectorDropdown(): Promise<void> {
        await this.click(this.connectorDropdownIcon);
    }

    /**
     * Select connector by name
     * @param connectorName - name of connector
     */
    async selectConnector(connectorName: string): Promise<void> {
        await this.openConnectorDropdown();
        await this.page.waitForTimeout(500);

        const connector = this.getByText(connectorName);
        await this.click(connector);
    }

    /**
     * Check if specific connector option exists
     * @param connectorName - name of connector
     * @returns true if exists
     */
    async isConnectorOptionAvailable(connectorName: string): Promise<boolean> {
        const connector = this.getByText(connectorName);
        const count = await connector.count();
        return count > 0;
    }
}