/**
 * @fileoverview Expenses Controller Unit Tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let expensesService: ExpensesService;

  const mockExpensesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
    getByCategory: jest.fn(),
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    expensesService = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      // Arrange
      const createExpenseDto: CreateExpenseDto = {
        amount: 100.50,
        note: 'Test expense',
        date: '2024-01-15',
        categoryId: 'test-category-id',
      };
      const serviceResult = {
        id: '1',
        amount: 100.50,
        note: 'Test expense',
        date: new Date('2024-01-15'),
        categoryId: 'test-category-id',
        userId: 'test-user-id',
      };
      const expectedResult = {
        success: true,
        message: 'Expense created successfully',
        data: serviceResult,
      };
      mockExpensesService.create.mockResolvedValue(serviceResult);

      // Act
      const result = await controller.create(createExpenseDto, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(expensesService.create).toHaveBeenCalledWith(mockUser.id, createExpenseDto);
    });
  });

  describe('findAll', () => {
    it('should return all expenses', async () => {
      // Arrange
      const queryDto: ExpenseQueryDto = {
        page: 1,
        limit: 10,
      };
      const serviceResult = {
        data: [
          { id: '1', amount: 100.50, note: 'Expense 1' },
          { id: '2', amount: 200.75, note: 'Expense 2' },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };
      const expectedResult = {
        success: true,
        message: 'Expenses retrieved successfully',
        data: serviceResult.data,
        pagination: serviceResult.pagination,
      };
      mockExpensesService.findAll.mockResolvedValue(serviceResult);

      // Act
      const result = await controller.findAll(mockUser, queryDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(expensesService.findAll).toHaveBeenCalledWith(mockUser.id, queryDto);
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      // Arrange
      const expenseId = '1';
      const serviceResult = {
          id: '1',
          amount: 100.50,
          note: 'Test expense',
          date: new Date('2024-01-15'),
          categoryId: 'test-category-id',
          userId: 'test-user-id',
        };
      const expectedResult = {
        success: true,
        message: 'Expense retrieved successfully',
        data: serviceResult,
      };
      mockExpensesService.findOne.mockResolvedValue(expectedResult.data);

      // Act
      const result = await controller.findOne(expenseId, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(expensesService.findOne).toHaveBeenCalledWith(expenseId, mockUser.id);
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      // Arrange
      const expenseId = '1';
      const updateExpenseDto: UpdateExpenseDto = {
        amount: 150.75,
        note: 'Updated expense',
      };
      const serviceResult = {
          id: '1',
          amount: 150.75,
          note: 'Updated expense',
          date: new Date('2024-01-15'),
          categoryId: 'test-category-id',
          userId: 'test-user-id',
        };
      const expectedResult = {
        success: true,
        message: 'Expense updated successfully',
        data: serviceResult,
      };
      mockExpensesService.update.mockResolvedValue(expectedResult.data);

      // Act
      const result = await controller.update(expenseId, updateExpenseDto, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(expensesService.update).toHaveBeenCalledWith(expenseId, mockUser.id, updateExpenseDto);
    });
  });

  describe('remove', () => {
    it('should delete an expense', async () => {
      // Arrange
      const expenseId = '1';
      const serviceResult = { message: 'Expense deleted successfully' };
      const expectedResult = {
        success: true,
        message: 'Expense deleted successfully',
        data: serviceResult,
      };
      mockExpensesService.remove.mockResolvedValue(expectedResult.data);

      // Act
      const result = await controller.remove(expenseId, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(expensesService.remove).toHaveBeenCalledWith(expenseId, mockUser.id);
    });
  });

  describe('getStats', () => {
    it('should return expense statistics', async () => {
      // Arrange
      const serviceResult = {
          totalExpenses: 10,
          totalAmount: 1000.50,
          averageAmount: 100.05,
          thisMonthExpenses: 5,
          thisMonthAmount: 500.25,
        };
      const expectedResult = {
        success: true,
        message: 'Expense statistics retrieved successfully',
        data: serviceResult,
      };
      mockExpensesService.getStats.mockResolvedValue(serviceResult);

      // Act
      const result = await controller.getStats(mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(expensesService.getStats).toHaveBeenCalledWith(mockUser.id, undefined, undefined);
    });
  });

  describe('getByCategory', () => {
    it('should return expenses by category', async () => {
      // Arrange
      const serviceResult = [
        {
          categoryId: 'test-category-id',
          category: { id: 'test-category-id', name: 'Test Category' },
          _sum: { amount: 1000.50 },
          _count: { id: 5 },
        },
      ];
      const expectedResult = {
        success: true,
        message: 'Expenses by category retrieved successfully',
        data: serviceResult,
      };
      mockExpensesService.getByCategory.mockResolvedValue(serviceResult);

      // Act
      const result = await controller.getByCategory(mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(expensesService.getByCategory).toHaveBeenCalledWith(mockUser.id, undefined, undefined);
    });
  });
});
