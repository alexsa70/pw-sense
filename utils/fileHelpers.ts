import * as fs from 'fs';
import * as path from 'path';

/**
 * File helper utilities for test file operations
 */
export class FileHelpers {
  /**
   * Check if file exists
   * @param filePath - path to file
   * @returns true if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Read file content
   * @param filePath - path to file
   * @returns file content as string
   */
  static readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Get file size in bytes
   * @param filePath - path to file
   * @returns file size in bytes
   */
  static getFileSize(filePath: string): number {
    const stats = fs.statSync(filePath);
    return stats.size;
  }

  /**
   * Get file extension
   * @param filePath - path to file
   * @returns file extension (e.g., '.txt', '.jpg')
   */
  static getFileExtension(filePath: string): string {
    return path.extname(filePath);
  }

  /**
   * Get file name without extension
   * @param filePath - path to file
   * @returns file name without extension
   */
  static getFileName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Get full file name with extension
   * @param filePath - path to file
   * @returns full file name
   */
  static getFullFileName(filePath: string): string {
    return path.basename(filePath);
  }

  /**
   * Create a test text file
   * @param filePath - path where to create file
   * @param content - file content
   */
  static createTextFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Delete file if exists
   * @param filePath - path to file
   */
  static deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Generate unique file name with timestamp
   * @param baseName - base name for file
   * @param extension - file extension (with dot, e.g., '.txt')
   * @returns unique file name
   */
  static generateUniqueFileName(baseName: string, extension: string): string {
    const timestamp = Date.now();
    return `${baseName}_${timestamp}${extension}`;
  }

  /**
   * Get test files directory path
   * @returns absolute path to test-files directory
   */
  static getTestFilesDir(): string {
    return path.resolve(__dirname, '../test-files');
  }

  /**
   * Get path to test file
   * @param fileName - name of test file
   * @returns absolute path to test file
   */
  static getTestFilePath(fileName: string): string {
    return path.join(this.getTestFilesDir(), fileName);
  }

  /**
   * Get absolute path for file from relative path in testData
   * @param relativePath - relative path from testData (e.g., 'test-files/documents/test.txt')
   * @returns absolute path to file
   */
  static getAbsolutePath(relativePath: string): string {
    return path.resolve(__dirname, '..', relativePath);
  }

  /**
   * Get image file path
   * @param fileName - name of image file
   * @returns absolute path to image file
   */
  static getImageFilePath(fileName: string): string {
    return path.join(this.getTestFilesDir(), 'images', fileName);
  }

  /**
   * Get document file path
   * @param fileName - name of document file
   * @returns absolute path to document file
   */
  static getDocumentFilePath(fileName: string): string {
    return path.join(this.getTestFilesDir(), 'documents', fileName);
  }

  /**
   * Get video file path
   * @param fileName - name of video file
   * @returns absolute path to video file
   */
  static getVideoFilePath(fileName: string): string {
    return path.join(this.getTestFilesDir(), 'videos', fileName);
  }

  /**
   * Verify file is valid for upload
   * @param filePath - path to file
   * @param maxSizeMB - maximum file size in MB (default: 10MB)
   * @returns true if file is valid
   */
  static isValidForUpload(filePath: string, maxSizeMB: number = 10): boolean {
    if (!this.fileExists(filePath)) {
      return false;
    }

    const sizeInBytes = this.getFileSize(filePath);
    const sizeInMB = sizeInBytes / (1024 * 1024);

    return sizeInMB <= maxSizeMB;
  }

  /**
   * Get file MIME type based on extension
   * @param filePath - path to file
   * @returns MIME type string
   */
  static getMimeType(filePath: string): string {
    const ext = this.getFileExtension(filePath).toLowerCase();
    
    const mimeTypes: { [key: string]: string } = {
      '.txt': 'text/plain',
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.mp4': 'video/mp4',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}