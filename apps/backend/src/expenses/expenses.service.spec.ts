/**
 * @fileoverview ExpensesService Unit Tests - Unit tests for expenses service
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let prismaService: PrismaService;

  const mockExpense = {
    id: 'test-expense-id',
    amount: 100.50,
    note: 'Test expense' as string | null,
    date: new Date('2024-01-15'),
    categoryId: 'test-category-id',
    userId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: 'test-category-id',
      name: 'Test Category',
      type: 'EXPENSE' as const,
      userId: 'test-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockCategory = {
    id: 'test-category-id',
    name: 'Test Category',
    type: 'EXPENSE' as const,
    userId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: PrismaService,
          useValue: {
            expense: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
              groupBy: jest.fn(),
              aggregate: jest.fn(),
            },
            category: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createExpenseDto: CreateExpenseDto = {
      amount: 100.50,
      note: 'Test expense',
      date: '2024-01-15',
      categoryId: 'test-category-id',
    };

    it('should create a new expense successfully', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prismaService.expense, 'create').mockResolvedValue(mockExpense);

      // Act
      const result = await service.create(mockUser.id, createExpenseDto);

      // Assert
      expect(result).toEqual(mockExpense);
    });

    it('should throw BadRequestException if category not found', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(mockUser.id, createExpenseDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all expenses for a user with pagination', async () => {
      // Arrange
      const expenses = [mockExpense];
      const queryDto: ExpenseQueryDto = {
        page: 1,
        limit: 10,
      };
      jest.spyOn(prismaService.expense, 'findMany').mockResolvedValue(expenses);
      jest.spyOn(prismaService.expense, 'count').mockResolvedValue(1);

      // Act
      const result = await service.findAll(mockUser.id, queryDto);

      // Assert
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.data).toEqual(expenses);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should filter expenses by category', async () => {
      // Arrange
      const expenses = [mockExpense];
      const queryDto: ExpenseQueryDto = {
        categoryId: 'test-category-id',
        page: 1,
        limit: 10,
      };
      jest.spyOn(prismaService.expense, 'findMany').mockResolvedValue(expenses);
      jest.spyOn(prismaService.expense, 'count').mockResolvedValue(1);

      // Act
      const result = await service.findAll(mockUser.id, queryDto);

      // Assert
      expect(result.data).toEqual(expenses);
      expect(prismaService.expense.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          categoryId: 'test-category-id',
        },
        include: {
          category: true,
        },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter expenses by date range', async () => {
      // Arrange
      const expenses = [mockExpense];
      const queryDto: ExpenseQueryDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        page: 1,
        limit: 10,
      };
      jest.spyOn(prismaService.expense, 'findMany').mockResolvedValue(expenses);
      jest.spyOn(prismaService.expense, 'count').mockResolvedValue(1);

      // Act
      const result = await service.findAll(mockUser.id, queryDto);

      // Assert
      expect(result.data).toEqual(expenses);
      expect(prismaService.expense.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          date: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-01-31'),
          },
        },
        include: {
          category: true,
        },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      // Arrange
      const expenseId = 'test-expense-id';
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(mockExpense);

      // Act
      const result = await service.findOne(expenseId, mockUser.id);

      // Assert
      expect(result).toEqual(mockExpense);
      expect(prismaService.expense.findUnique).toHaveBeenCalledWith({
        where: { 
          id: expenseId,
        },
        include: {
          category: true,
        },
      });
    });

    it('should throw NotFoundException if expense not found', async () => {
      // Arrange
      const expenseId = 'non-existent-id';
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(expenseId, mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateExpenseDto: UpdateExpenseDto = {
      amount: 150.75,
      note: 'Updated expense',
    };

    it('should update an expense successfully', async () => {
      // Arrange
      const expenseId = 'test-expense-id';
      const updatedExpense = { ...mockExpense, ...updateExpenseDto, date: new Date('2024-01-15') };
      const expenseWithUserId = { ...mockExpense, userId: mockUser.id };
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(expenseWithUserId);
      jest.spyOn(prismaService.expense, 'update').mockResolvedValue(updatedExpense);

      // Act
      const result = await service.update(expenseId, mockUser.id, updateExpenseDto);

      // Assert
      expect(result).toEqual(updatedExpense);
      expect(prismaService.expense.update).toHaveBeenCalledWith({
        where: { id: expenseId },
        data: updateExpenseDto,
        include: {
          category: true,
        },
      });
    });

    it('should throw NotFoundException if expense not found', async () => {
      // Arrange
      const expenseId = 'non-existent-id';
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(expenseId, mockUser.id, updateExpenseDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an expense successfully', async () => {
      // Arrange
      const expenseId = 'test-expense-id';
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(mockExpense);
      jest.spyOn(prismaService.expense, 'delete').mockResolvedValue(mockExpense);

      // Act
      const result = await service.remove(expenseId, mockUser.id);

      // Assert
      expect(result).toEqual({ message: 'Expense deleted successfully' });
      expect(prismaService.expense.delete).toHaveBeenCalledWith({
        where: { id: expenseId },
      });
    });

    it('should throw NotFoundException if expense not found', async () => {
      // Arrange
      const expenseId = 'non-existent-id';
      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(expenseId, mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return expense statistics with income/expense separation', async () => {
      // Arrange
      const mockStats = {
        // Total statistics
        totalExpenses: 10,
        totalIncome: 5,
        totalExpense: 5,
        totalIncomeAmount: 1500.00,
        totalExpenseAmount: 1000.50,
        netAmount: 499.50, // 1500 - 1000.50
        
        // Average amounts
        averageIncomeAmount: 300.00,
        averageExpenseAmount: 200.10,
        
        // This month statistics
        thisMonthExpenses: 8,
        thisMonthIncome: 4,
        thisMonthExpense: 4,
        thisMonthIncomeAmount: 1200.00,
        thisMonthExpenseAmount: 800.50,
        thisMonthNetAmount: 399.50,
      };

      // Mock all the required calls
      jest.spyOn(prismaService.expense, 'count')
        .mockResolvedValueOnce(10) // totalExpenses
        .mockResolvedValueOnce(5)  // totalIncome
        .mockResolvedValueOnce(5)  // totalExpense
        .mockResolvedValueOnce(8)  // thisMonthExpenses
        .mockResolvedValueOnce(4)  // thisMonthIncome
        .mockResolvedValueOnce(4); // thisMonthExpense

      jest.spyOn(prismaService.expense, 'aggregate')
        .mockResolvedValueOnce({ _sum: { amount: 1500.00 } }) // totalIncomeAmount
        .mockResolvedValueOnce({ _sum: { amount: 1000.50 } }) // totalExpenseAmount
        .mockResolvedValueOnce({ _avg: { amount: 300.00 } })  // avgIncomeAmount
        .mockResolvedValueOnce({ _avg: { amount: 200.10 } })  // avgExpenseAmount
        .mockResolvedValueOnce({ _sum: { amount: 1200.00 } }) // thisMonthIncomeAmount
        .mockResolvedValueOnce({ _sum: { amount: 800.50 } }); // thisMonthExpenseAmount

      // Act
      const result = await service.getStats(mockUser.id);

      // Assert
      expect(result).toEqual(mockStats);
    });
  });

});
