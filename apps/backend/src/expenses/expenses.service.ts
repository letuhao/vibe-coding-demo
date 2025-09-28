/**
 * @fileoverview Expenses Service - Expense management business logic
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';

/**
 * ExpensesService handles expense management operations
 * Provides CRUD operations for user expenses with filtering and pagination
 */
@Injectable()
export class ExpensesService {
  /**
   * Constructor for ExpensesService
   * @param prismaService - Prisma service for database operations
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new expense for a user
   * @param userId - User ID who owns the expense
   * @param createExpenseDto - Expense creation data
   * @returns Created expense with category information
   */
  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const { amount, note, date, categoryId } = createExpenseDto;

    // Verify category exists and belongs to user
    const category = await this.prismaService.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      throw new BadRequestException('Category not found or access denied');
    }

    // Create new expense
    const expense = await this.prismaService.expense.create({
      data: {
        amount,
        note,
        date: new Date(date),
        categoryId,
        userId,
      },
      include: {
        category: true,
      },
    });

    return expense;
  }

  /**
   * Get all expenses for a user with filtering and pagination
   * @param userId - User ID
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated expenses with category information
   */
  async findAll(userId: string, query: ExpenseQueryDto) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: any = { userId };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (search) {
      where.note = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get total count
    const total = await this.prismaService.expense.count({ where });

    // Get expenses with pagination
    const expenses = await this.prismaService.expense.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get a specific expense by ID
   * @param id - Expense ID
   * @param userId - User ID (for authorization)
   * @returns Expense details with category information
   */
  async findOne(id: string, userId: string) {
    const expense = await this.prismaService.expense.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return expense;
  }

  /**
   * Update an expense
   * @param id - Expense ID
   * @param userId - User ID (for authorization)
   * @param updateExpenseDto - Expense update data
   * @returns Updated expense with category information
   */
  async update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    // First check if expense exists and user has access
    await this.findOne(id, userId);

    const { categoryId, ...updateData } = updateExpenseDto;

    // If updating category, verify it exists and belongs to user
    if (categoryId) {
      const category = await this.prismaService.category.findFirst({
        where: {
          id: categoryId,
          userId,
        },
      });

      if (!category) {
        throw new BadRequestException('Category not found or access denied');
      }
    }

    // Update expense
    const updatedExpense = await this.prismaService.expense.update({
      where: { id },
      data: {
        ...updateData,
        ...(categoryId && { categoryId }),
        ...(updateData.date && { date: new Date(updateData.date) }),
      },
      include: {
        category: true,
      },
    });

    return updatedExpense;
  }

  /**
   * Delete an expense
   * @param id - Expense ID
   * @param userId - User ID (for authorization)
   * @returns Success message
   */
  async remove(id: string, userId: string) {
    // First check if expense exists and user has access
    await this.findOne(id, userId);

    // Delete expense
    await this.prismaService.expense.delete({
      where: { id },
    });

    return { message: 'Expense deleted successfully' };
  }

  /**
   * Get expense statistics for a user
   * @param userId - User ID
   * @param startDate - Optional start date for statistics
   * @param endDate - Optional end date for statistics
   * @returns Expense statistics with proper income/expense separation
   */
  async getStats(userId: string, startDate?: string, endDate?: string) {
    const baseWhere: any = { userId };

    if (startDate || endDate) {
      baseWhere.date = {};
      if (startDate) {
        baseWhere.date.gte = new Date(startDate);
      }
      if (endDate) {
        baseWhere.date.lte = new Date(endDate);
      }
    }

    // This month filter
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const thisMonthWhere = {
      ...baseWhere,
      date: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    };

    const [
      // Total counts
      totalExpenses,
      totalIncome,
      totalExpense,
      
      // Total amounts
      totalIncomeAmount,
      totalExpenseAmount,
      
      // Average amounts
      avgIncomeAmount,
      avgExpenseAmount,
      
      // This month counts
      thisMonthExpenses,
      thisMonthIncome,
      thisMonthExpense,
      
      // This month amounts
      thisMonthIncomeAmount,
      thisMonthExpenseAmount,
    ] = await Promise.all([
      // Total counts
      this.prismaService.expense.count({ where: baseWhere }),
      this.prismaService.expense.count({ 
        where: { ...baseWhere, category: { type: 'INCOME' } } 
      }),
      this.prismaService.expense.count({ 
        where: { ...baseWhere, category: { type: 'EXPENSE' } } 
      }),
      
      // Total amounts
      this.prismaService.expense.aggregate({
        where: { ...baseWhere, category: { type: 'INCOME' } },
        _sum: { amount: true },
      }),
      this.prismaService.expense.aggregate({
        where: { ...baseWhere, category: { type: 'EXPENSE' } },
        _sum: { amount: true },
      }),
      
      // Average amounts
      this.prismaService.expense.aggregate({
        where: { ...baseWhere, category: { type: 'INCOME' } },
        _avg: { amount: true },
      }),
      this.prismaService.expense.aggregate({
        where: { ...baseWhere, category: { type: 'EXPENSE' } },
        _avg: { amount: true },
      }),
      
      // This month counts
      this.prismaService.expense.count({ where: thisMonthWhere }),
      this.prismaService.expense.count({ 
        where: { ...thisMonthWhere, category: { type: 'INCOME' } } 
      }),
      this.prismaService.expense.count({ 
        where: { ...thisMonthWhere, category: { type: 'EXPENSE' } } 
      }),
      
      // This month amounts
      this.prismaService.expense.aggregate({
        where: { ...thisMonthWhere, category: { type: 'INCOME' } },
        _sum: { amount: true },
      }),
      this.prismaService.expense.aggregate({
        where: { ...thisMonthWhere, category: { type: 'EXPENSE' } },
        _sum: { amount: true },
      }),
    ]);

    const totalIncomeSum = totalIncomeAmount._sum.amount || 0;
    const totalExpenseSum = totalExpenseAmount._sum.amount || 0;
    const thisMonthIncomeSum = thisMonthIncomeAmount._sum.amount || 0;
    const thisMonthExpenseSum = thisMonthExpenseAmount._sum.amount || 0;

    return {
      // Total statistics
      totalExpenses,
      totalIncome,
      totalExpense,
      totalIncomeAmount: totalIncomeSum,
      totalExpenseAmount: totalExpenseSum,
      netAmount: totalIncomeSum - totalExpenseSum, // Thu - Chi = Số dư
      
      // Average amounts
      averageIncomeAmount: avgIncomeAmount._avg.amount || 0,
      averageExpenseAmount: avgExpenseAmount._avg.amount || 0,
      
      // This month statistics
      thisMonthExpenses,
      thisMonthIncome,
      thisMonthExpense,
      thisMonthIncomeAmount: thisMonthIncomeSum,
      thisMonthExpenseAmount: thisMonthExpenseSum,
      thisMonthNetAmount: thisMonthIncomeSum - thisMonthExpenseSum,
    };
  }

  /**
   * Get expenses by category for a user
   * @param userId - User ID
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Expenses grouped by category
   */
  async getByCategory(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const expenses = await this.prismaService.expense.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    // Get category details
    const categoryIds = expenses.map(expense => expense.categoryId);
    const categories = await this.prismaService.category.findMany({
      where: {
        id: { in: categoryIds },
        userId,
      },
    });

    // Combine data
    const result = expenses.map(expense => {
      const category = categories.find(cat => cat.id === expense.categoryId);
      return {
        categoryId: expense.categoryId,
        categoryName: category?.name || 'Unknown',
        categoryType: category?.type || 'UNKNOWN',
        totalAmount: expense._sum.amount || 0,
        count: expense._count.id,
      };
    });

    return result;
  }
}
