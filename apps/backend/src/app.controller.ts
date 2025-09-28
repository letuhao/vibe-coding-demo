/**
 * @fileoverview App Controller - Main application controller
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

/**
 * AppController handles root-level endpoints
 * Provides health check and basic application information
 */
@Controller()
export class AppController {
  /**
   * Constructor for AppController
   * @param appService - Application service
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   * @returns Application status and basic information
   */
  @Public()
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  /**
   * Health check endpoint for monitoring
   * @returns Health status
   */
  @Public()
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'expense-manager-api',
    };
  }
}
