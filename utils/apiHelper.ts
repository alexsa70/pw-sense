import { Page } from "@playwright/test";
import {config} from '../config/env.config';

export class APIHelpers {
    /**
     * Get all files via API
     */
    static async getAllFiles(page: Page, limit: number = 32) {
      const apiResponse = await page.request.post(
        `${config.urls.base}/api/files/get_all_v2`,
        {
          data: {
            org_id: process.env.ORG_ID || "6733306465383e58c9b88306",
            project_ids: JSON.parse(process.env.PROJECT_IDS || '["68af16da443fd05cb0c83c2a", "6882198cb753d1caf456e694"]'),
            limit: limit,
            product: "KalMedia"
          }
        }
      );
      
      const filesData = await apiResponse.json();
      return filesData.data || [];
    }
  
    /**
     * Delete file via API
     */
    static async deleteFile(page: Page, fileId: string) {
      const response = await page.request.delete(
        `${config.urls.base}/api/files/${fileId}`
      );
      return response.ok;
    }
  
    /**
     * Verify file exists via API
     */
    static async fileExists(page: Page, fileName: string): Promise<boolean> {
      const files = await this.getAllFiles(page);
      return files.some((file: any) => file.name === fileName);
    }
  }