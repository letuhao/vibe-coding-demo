/**
 * @fileoverview Prisma Service - Database connection and management
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService provides database connection and management
 * Implements OnModuleInit and OnModuleDestroy for proper lifecycle management
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Initialize Prisma connection when module starts
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Close Prisma connection when module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
