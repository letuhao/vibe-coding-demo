/**
 * @fileoverview Expenses Controller - Expense management endpoints
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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { User } from '../common/decorators/get-user.decorator';

/**
 * ExpensesController handles expense management endpoints
 * Provides CRUD operations for user expenses with filtering and pagination
 */
@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  /**
   * Constructor for ExpensesController
   * @param expensesService - Expenses service
   */
  constructor(private readonly expensesService: ExpensesService) {}

  /**
   * Create a new expense
   * @param createExpenseDto - Expense creation data
   * @param user - Current authenticated user
   * @returns Created expense
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @GetUser() user: User,
  ) {
    const expense = await this.expensesService.create(user.id, createExpenseDto);
    
    return {
      success: true,
      data: expense,
      message: 'Expense created successfully',
    };
  }

  /**
   * Get all expenses for the current user
   * @param user - Current authenticated user
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated expenses
   */
  @Get()
  async findAll(
    @GetUser() user: User,
    @Query() query: ExpenseQueryDto,
  ) {
    const result = await this.expensesService.findAll(user.id, query);
    
    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: 'Expenses retrieved successfully',
    };
  }

  /**
   * Get expense statistics
   * @param user - Current authenticated user
   * @param startDate - Optional start date for statistics
   * @param endDate - Optional end date for statistics
   * @returns Expense statistics
   */
  @Get('stats')
  async getStats(
    @GetUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const stats = await this.expensesService.getStats(user.id, startDate, endDate);
    
    return {
      success: true,
      data: stats,
      message: 'Expense statistics retrieved successfully',
    };
  }

  /**
   * Get expenses by category
   * @param user - Current authenticated user
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Expenses grouped by category
   */
  @Get('by-category')
  async getByCategory(
    @GetUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const result = await this.expensesService.getByCategory(user.id, startDate, endDate);
    
    return {
      success: true,
      data: result,
      message: 'Expenses by category retrieved successfully',
    };
  }

  /**
   * Get a specific expense by ID
   * @param id - Expense ID
   * @param user - Current authenticated user
   * @returns Expense details
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    const expense = await this.expensesService.findOne(id, user.id);
    
    return {
      success: true,
      data: expense,
      message: 'Expense retrieved successfully',
    };
  }

  /**
   * Update an expense
   * @param id - Expense ID
   * @param updateExpenseDto - Expense update data
   * @param user - Current authenticated user
   * @returns Updated expense
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser() user: User,
  ) {
    const expense = await this.expensesService.update(id, user.id, updateExpenseDto);
    
    return {
      success: true,
      data: expense,
      message: 'Expense updated successfully',
    };
  }

  /**
   * Delete an expense
   * @param id - Expense ID
   * @param user - Current authenticated user
   * @returns Success message
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    const result = await this.expensesService.remove(id, user.id);
    
    return {
      success: true,
      data: result,
      message: 'Expense deleted successfully',
    };
  }
}
