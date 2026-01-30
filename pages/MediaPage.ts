import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * MediaPage - Page Object for KalSense Media functionality
 * Handles media gallery, albums, file uploads, and filters
 */
export class MediaPage extends BasePage {
    // Sidebar navigation
    private readonly sidebarToggle: Locator;
    private readonly mediaMenuItem: Locator;

    // Tab navigation
    private readonly albumsButton: Locator;
    private readonly galleryButton: Locator;

    // Upload functionality
    private readonly uploadButton: Locator;
    private readonly agentSelect: Locator;
    private readonly generalPhotosAgent: Locator;
    private readonly uploadImageDescription: Locator;
    private readonly uploadConfirmButton: Locator;

    // Tag functionality
    private readonly tagInput: Locator;

    // Toast notifications
    private readonly toastTitle: Locator;
    private readonly toastMessage: Locator;

    // Filter functionality
    private readonly datePickerButton: Locator;
    private readonly datePickerIcon: Locator;
    private readonly selectButton: Locator;
    private readonly clearButton: Locator;
    private readonly photoCheckbox: Locator;
    private readonly videoCheckbox: Locator;

    // More actions
    private readonly moreActionsButton: Locator;
    private readonly deleteOption: Locator;
    private readonly confirmButton: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize sidebar navigation locators
        this.sidebarToggle = this.getByTestId('sidebar-toggle');
        this.mediaMenuItem = this.getByTestId('Media');

        // Initialize tab navigation locators
        this.albumsButton = this.getByRole('button', { name: 'Albums' });
        this.galleryButton = this.getByRole('button', { name: 'Gallery' });

        // Initialize upload locators
        this.uploadButton = this.getByTestId('upload');
        this.agentSelect = this.getByTestId('agent-select');
        this.generalPhotosAgent = this.getByRole('button', { name: 'General photos - EN' });
        this.uploadImageDescription = this.getByRole('textbox', { name: 'Describe your uploaded images…' });
        this.uploadConfirmButton = this.getByRole('button', { name: /^upload$/ });

        // Initialize tag locators
        this.tagInput = this.getByRole('textbox', { name: 'type tag' });

        // Initialize toast locators
        this.toastTitle = this.getByTestId('toast-title');
        this.toastMessage = this.getByTestId('toast-message');

        // Initialize filter locators
        this.datePickerButton = this.getByTestId('date-picker-button');
        this.datePickerIcon = this.getLocator('.DatePickerButton_datePickerIcon__22vZQ');
        this.selectButton = this.getByRole('button', { name: /^Select$/ });
        this.clearButton = this.getByRole('button', { name: 'Clear' });
        this.photoCheckbox = this.getByRole('checkbox', { name: 'Photo' });
        this.videoCheckbox = this.getByRole('checkbox', { name: 'Video' });

        // Initialize more actions locators
        this.moreActionsButton = this.getByTestId('more-actions');
        this.deleteOption = this.getByText('Delete');
        this.confirmButton = this.getByTestId('button-confirm');
    }

    /**
     * Navigate to Media page
     */
    async navigateToMedia(): Promise<void> {
        await this.click(this.sidebarToggle);
        await this.click(this.mediaMenuItem);
        await this.waitForPageLoad();
    }

    /**
     * Switch to Albums tab
     */
    async switchToAlbumsTab(): Promise<void> {
        await this.click(this.albumsButton);
        await this.waitForPageLoad();
    }

    /**
     * Switch to Gallery tab
     */
    async switchToGalleryTab(): Promise<void> {
        await this.click(this.galleryButton);
        await this.waitForPageLoad();
    }

    /**
     * Click upload button to start upload flow
     */
    async clickUpload(): Promise<void> {
        await this.click(this.uploadButton);
    }

    /**
     * Select agent for image processing
     * @param agentName - name of the agent (default: 'General photos - EN')
     */
    async selectAgent(agentName: string = 'General photos - EN'): Promise<void> {
        await this.click(this.agentSelect);

        if (agentName === 'General photos - EN') {
            await this.click(this.generalPhotosAgent);
        } else {
            await this.click(this.getByRole('button', { name: agentName }));
        }
    }

    /**
     * Upload file from file path
     * @param filePath - path to the file to upload
     */
    async uploadFile(filePath: string): Promise<void> {
        await this.page.locator('body').setInputFiles(filePath);
    }

    /**
     * Add tag to uploaded file
     * @param tag - tag name to add
     */
    async addTag(tag: string): Promise<void> {
        await this.fill(this.tagInput, tag);
        await this.press(this.tagInput, 'Enter');
    }

    /**
     * Add multiple tags to uploaded file
     * @param tags - array of tag names
     */
    async addMultipleTags(tags: string[]): Promise<void> {
        for (const tag of tags) {
            await this.addTag(tag);
        }
    }

    /**
     * Enter description for uploaded images
     * @param description - description text
     */
    async enterUploadDescription(description: string): Promise<void> {
        await this.fill(this.uploadImageDescription, description);
    }

    /**
     * Confirm file upload
     */
    async confirmUpload(): Promise<void> {
        await this.click(this.uploadConfirmButton);
    }

    /**
     * Complete file upload flow
     * @param filePath - path to file
     * @param tags - array of tags
     * @param description - file description
     */
    async uploadFileWithMetadata(
        filePath: string,
        tags: string[],
        description: string
    ): Promise<void> {
        await this.clickUpload();
        await this.selectAgent();
        await this.uploadFile(filePath);
        await this.addMultipleTags(tags);
        await this.enterUploadDescription(description);
        await this.confirmUpload();
    }

    /**
     * Get toast notification title text
     * @returns toast title text
     */
    async getToastTitle(): Promise<string> {
        return await this.getText(this.toastTitle);
    }

    /**
     * Get toast notification message text
     * @returns toast message text
     */
    async getToastMessage(): Promise<string> {
        return await this.getText(this.toastMessage);
    }

    /**
     * Check if toast notification is visible
     * @returns true if toast is visible
     */
    async isToastVisible(): Promise<boolean> {
        return await this.isVisible(this.toastTitle, 5000);
    }

    /**
     * Wait for toast notification to appear
     */
    async waitForToast(): Promise<void> {
        await this.waitForVisible(this.toastTitle, 10000);
    }

    /**
     * Open date picker filter
     */
    async openDatePicker(): Promise<void> {
        await this.click(this.datePickerButton);
    }

    /**
     * Select date in date picker
     * @param day - day number to select (1-31)
     */
    async selectDate(day: number): Promise<void> {
        await this.click(this.getByText(day.toString(), true));
    }

    /**
     * Select date range in date picker
     * @param startDay - start day number
     * @param endDay - end day number
     */
    async selectDateRange(startDay: number, endDay: number): Promise<void> {
        await this.click(this.getByText(startDay.toString(), true));

        // Select end date with Ctrl/Cmd key pressed
        const endDayLocator = this.getByText(endDay.toString());
        await endDayLocator.click({ modifiers: ['ControlOrMeta'] });
    }

    /**
     * Navigate to previous month in date picker
     */
    async goToPreviousMonth(): Promise<void> {
        await this.click(this.getByRole('button', { name: '<' }));
    }

    /**
     * Confirm date selection
     */
    async confirmDateSelection(): Promise<void> {
        await this.click(this.selectButton);
    }

    /**
     * Clear date filter
     */
    async clearDateFilter(): Promise<void> {
        await this.click(this.clearButton);
    }

    /**
     * Toggle photo filter
     */
    async togglePhotoFilter(): Promise<void> {
        await this.click(this.photoCheckbox);
    }

    /**
     * Toggle video filter
     */
    async toggleVideoFilter(): Promise<void> {
        await this.click(this.videoCheckbox);
    }

    /**
     * Check if photo filter is checked
     * @returns true if checked
     */
    async isPhotoFilterChecked(): Promise<boolean> {
        return await this.isChecked(this.photoCheckbox);
    }

    /**
     * Check if video filter is checked
     * @returns true if checked
     */
    async isVideoFilterChecked(): Promise<boolean> {
        return await this.isChecked(this.videoCheckbox);
    }

    /**
     * Get image card by file ID
     * @param fileId - file ID/name
     * @returns Locator for the image card
     */
    getImageCard(fileId: string): Locator {
        return this.getByTestId(`${fileId}-imageCard`);
    }

    /**
     * Click on image card
     * @param fileId - file ID/name
     */
    async clickImageCard(fileId: string): Promise<void> {
        const imageCard = this.getImageCard(fileId);
        await this.click(imageCard.getByRole('img', { name: 'Media' }));
    }

    /**
     * Open more actions menu
     */
    async openMoreActions(): Promise<void> {
        await this.click(this.moreActionsButton);
    }

    /**
     * Delete item (album or file)
     */
    async deleteItem(): Promise<void> {
        await this.openMoreActions();
        await this.click(this.deleteOption);
        await this.click(this.confirmButton);
    }

    /**
     * Check if upload button is visible
     * @returns true if visible
     */
    async isUploadButtonVisible(): Promise<boolean> {
        return await this.isVisible(this.uploadButton);
    }
}