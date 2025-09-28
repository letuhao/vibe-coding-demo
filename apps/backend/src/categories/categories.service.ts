/**
 * @fileoverview Categories Service - Category management business logic
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from '@prisma/client';

/**
 * CategoriesService handles category management operations
 * Provides CRUD operations for user categories
 */
@Injectable()
export class CategoriesService {
  /**
   * Constructor for CategoriesService
   * @param prismaService - Prisma service for database operations
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new category for a user
   * @param userId - User ID who owns the category
   * @param createCategoryDto - Category creation data
   * @returns Created category
   */
  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    const { name, type } = createCategoryDto;

    // Check if category with same name and type already exists for user
    const existingCategory = await this.prismaService.category.findFirst({
      where: {
        userId,
        name,
        type,
      },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name and type already exists');
    }

    // Create new category
    const category = await this.prismaService.category.create({
      data: {
        name,
        type,
        userId,
      },
    });

    return category;
  }

  /**
   * Get all categories for a user
   * @param userId - User ID
   * @param type - Optional category type filter
   * @returns Array of user categories
   */
  async findAll(userId: string, type?: CategoryType) {
    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }

    const categories = await this.prismaService.category.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { name: 'asc' },
      ],
    });

    return categories;
  }

  /**
   * Get a specific category by ID
   * @param id - Category ID
   * @param userId - User ID (for authorization)
   * @returns Category details
   */
  async findOne(id: string, userId: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return category;
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param userId - User ID (for authorization)
   * @param updateCategoryDto - Category update data
   * @returns Updated category
   */
  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    // First check if category exists and user has access
    await this.findOne(id, userId);

    const { name, type } = updateCategoryDto;

    // If updating name or type, check for conflicts
    if (name || type) {
      const existingCategory = await this.prismaService.category.findFirst({
        where: {
          userId,
          name: name || undefined,
          type: type || undefined,
          NOT: { id },
        },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name and type already exists');
      }
    }

    // Update category
    const updatedCategory = await this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return updatedCategory;
  }

  /**
   * Delete a category
   * @param id - Category ID
   * @param userId - User ID (for authorization)
   * @returns Success message
   */
  async remove(id: string, userId: string) {
    // First check if category exists and user has access
    await this.findOne(id, userId);

    // Check if category has associated expenses
    const expenseCount = await this.prismaService.expense.count({
      where: { categoryId: id },
    });

    if (expenseCount > 0) {
      throw new ConflictException('Cannot delete category with associated expenses');
    }

    // Delete category
    await this.prismaService.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }

  /**
   * Get category statistics for a user
   * @param userId - User ID
   * @returns Category statistics
   */
  async getStats(userId: string) {
    const [totalCategories, expenseCategories, incomeCategories] = await Promise.all([
      this.prismaService.category.count({
        where: { userId },
      }),
      this.prismaService.category.count({
        where: { userId, type: CategoryType.EXPENSE },
      }),
      this.prismaService.category.count({
        where: { userId, type: CategoryType.INCOME },
      }),
    ]);

    return {
      total: totalCategories,
      expense: expenseCategories,
      income: incomeCategories,
    };
  }
}
