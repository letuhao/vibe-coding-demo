/**
 * @fileoverview App Service - Main application service
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Injectable } from '@nestjs/common';

/**
 * AppService provides main application functionality
 * Handles basic application operations and health checks
 */
@Injectable()
export class AppService {
  /**
   * Get basic application information
   * @returns Application greeting message
   */
  getHello(): string {
    return 'Expense Manager API is running! 🚀';
  }
}
