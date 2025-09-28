/**
 * @fileoverview Categories Controller - Category management endpoints
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { User } from '../common/decorators/get-user.decorator';
import { CategoryType } from '@prisma/client';

/**
 * CategoriesController handles category management endpoints
 * Provides CRUD operations for user categories
 */
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  /**
   * Constructor for CategoriesController
   * @param categoriesService - Categories service
   */
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Create a new category
   * @param createCategoryDto - Category creation data
   * @param user - Current authenticated user
   * @returns Created category
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
  ) {
    const category = await this.categoriesService.create(user.id, createCategoryDto);
    
    return {
      success: true,
      data: category,
      message: 'Category created successfully',
    };
  }

  /**
   * Get all categories for the current user
   * @param user - Current authenticated user
   * @param type - Optional category type filter
   * @returns Array of user categories
   */
  @Get()
  async findAll(
    @GetUser() user: User,
    @Query('type') type?: CategoryType,
  ) {
    const categories = await this.categoriesService.findAll(user.id, type);
    
    return {
      success: true,
      data: categories,
      message: 'Categories retrieved successfully',
    };
  }

  /**
   * Get category statistics
   * @param user - Current authenticated user
   * @returns Category statistics
   */
  @Get('stats')
  async getStats(@GetUser() user: User) {
    const stats = await this.categoriesService.getStats(user.id);
    
    return {
      success: true,
      data: stats,
      message: 'Category statistics retrieved successfully',
    };
  }

  /**
   * Get a specific category by ID
   * @param id - Category ID
   * @param user - Current authenticated user
   * @returns Category details
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    const category = await this.categoriesService.findOne(id, user.id);
    
    return {
      success: true,
      data: category,
      message: 'Category retrieved successfully',
    };
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param updateCategoryDto - Category update data
   * @param user - Current authenticated user
   * @returns Updated category
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: User,
  ) {
    const category = await this.categoriesService.update(id, user.id, updateCategoryDto);
    
    return {
      success: true,
      data: category,
      message: 'Category updated successfully',
    };
  }

  /**
   * Delete a category
   * @param id - Category ID
   * @param user - Current authenticated user
   * @returns Success message
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    const result = await this.categoriesService.remove(id, user.id);
    
    return {
      success: true,
      data: result,
      message: 'Category deleted successfully',
    };
  }
}
