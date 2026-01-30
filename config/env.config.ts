import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Environment Configuration
 * Centralized access to environment variables
 */
export const config = {
  // User credentials
  credentials: {
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || '',
  },

  // Application URLs
  urls: {
    base: process.env.BASE_URL || 'https://kal-sense.prod.kaleidoo-dev.com',
    login: process.env.LOGIN_PATH || '/Kaleidoo_AI',
  },

  // Test configuration
  test: {
    headless: process.env.HEADLESS === 'true',
    timeout: parseInt(process.env.TIMEOUT || '30000', 10),
  },
};

/**
 * Validate that all required environment variables are present
 * Throws an error if any required variable is missing
 */
export const validateConfig = (): void => {
  const requiredVars = ['USERNAME', 'PASSWORD', 'BASE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please create a .env file in the project root with these variables.'
    );
  }
};

// Validate config on import
validateConfig();