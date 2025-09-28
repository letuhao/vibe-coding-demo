/**
 * @fileoverview Categories Controller Unit Tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      // Arrange
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
        type: 'EXPENSE',
      };
      const serviceResult = {
          id: '1',
          name: 'Test Category',
          type: 'EXPENSE',
          userId: 'test-user-id',
        };
      const expectedResult = {
        success: true,
        message: 'Category created successfully',
        data: serviceResult,
      };
      mockCategoriesService.create.mockResolvedValue(expectedResult.data);

      // Act
      const result = await controller.create(createCategoryDto, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(categoriesService.create).toHaveBeenCalledWith(mockUser.id, createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      // Arrange
      const serviceResult = [
        { id: '1', name: 'Category 1', type: 'EXPENSE' },
        { id: '2', name: 'Category 2', type: 'INCOME' },
      ];
      const expectedResult = {
        success: true,
        message: 'Categories retrieved successfully',
        data: serviceResult,
      };
      mockCategoriesService.findAll.mockResolvedValue(serviceResult);

      // Act
      const result = await controller.findAll(mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(categoriesService.findAll).toHaveBeenCalledWith(mockUser.id, undefined);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      // Arrange
      const categoryId = '1';
      const serviceResult = {
          id: '1',
          name: 'Test Category',
          type: 'EXPENSE',
        };
      const expectedResult = {
        success: true,
        message: 'Category retrieved successfully',
        data: serviceResult,
      };
      mockCategoriesService.findOne.mockResolvedValue(expectedResult.data);

      // Act
      const result = await controller.findOne(categoryId, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(categoriesService.findOne).toHaveBeenCalledWith(categoryId, mockUser.id);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      // Arrange
      const categoryId = '1';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };
      const serviceResult = {
          id: '1',
          name: 'Updated Category',
          type: 'EXPENSE',
        };
      const expectedResult = {
        success: true,
        message: 'Category updated successfully',
        data: serviceResult,
      };
      mockCategoriesService.update.mockResolvedValue(expectedResult.data);

      // Act
      const result = await controller.update(categoryId, updateCategoryDto, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(categoriesService.update).toHaveBeenCalledWith(categoryId, mockUser.id, updateCategoryDto);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      // Arrange
      const categoryId = '1';
      const serviceResult = { message: 'Category deleted successfully' };
      const expectedResult = {
        success: true,
        message: 'Category deleted successfully',
        data: serviceResult,
      };
      mockCategoriesService.remove.mockResolvedValue(expectedResult.data);

      // Act
      const result = await controller.remove(categoryId, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(categoriesService.remove).toHaveBeenCalledWith(categoryId, mockUser.id);
    });
  });

  describe('getStats', () => {
    it('should return category statistics', async () => {
      // Arrange
      const serviceResult = {
          totalCategories: 5,
          expenseCategories: 3,
          incomeCategories: 2,
        };
      const expectedResult = {
        success: true,
        message: 'Category statistics retrieved successfully',
        data: serviceResult,
      };
      mockCategoriesService.getStats.mockResolvedValue(expectedResult.data);

      // Act
      const result = await controller.getStats(mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(categoriesService.getStats).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
