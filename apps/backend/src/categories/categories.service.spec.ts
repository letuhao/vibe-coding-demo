/**
 * @fileoverview CategoriesService Unit Tests - Unit tests for categories service
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: PrismaService;

  const mockCategory = {
    id: 'test-category-id',
    name: 'Test Category',
    type: 'EXPENSE' as const,
    userId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            expense: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Test Category',
      type: 'EXPENSE',
    };

    it('should create a new category successfully', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.category, 'create').mockResolvedValue(mockCategory);

      // Act
      const result = await service.create(mockUser.id, createCategoryDto);

      // Assert
      expect(result).toEqual(mockCategory);
    });

    it('should throw ConflictException if category with same name and type exists', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);

      // Act & Assert
      await expect(service.create(mockUser.id, createCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all categories for a user', async () => {
      // Arrange
      const categories = [mockCategory];
      jest.spyOn(prismaService.category, 'findMany').mockResolvedValue(categories);

      // Act
      const result = await service.findAll(mockUser.id);

      // Assert
      expect(result).toEqual(categories);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        orderBy: [
          { type: 'asc' },
          { name: 'asc' },
        ],
      });
    });

    it('should filter categories by type', async () => {
      // Arrange
      const categories = [mockCategory];
      jest.spyOn(prismaService.category, 'findMany').mockResolvedValue(categories);

      // Act
      const result = await service.findAll(mockUser.id, 'EXPENSE');

      // Assert
      expect(result).toEqual(categories);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        where: { 
          userId: mockUser.id,
          type: 'EXPENSE',
        },
        orderBy: [
          { type: 'asc' },
          { name: 'asc' },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      // Arrange
      const categoryId = 'test-category-id';
      jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue(mockCategory);

      // Act
      const result = await service.findOne(categoryId, mockUser.id);

      // Assert
      expect(result).toEqual(mockCategory);
      expect(prismaService.category.findUnique).toHaveBeenCalledWith({
        where: { 
          id: categoryId,
        },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      // Arrange
      const categoryId = 'non-existent-id';
      jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(categoryId, mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Updated Category',
    };

    it('should update a category successfully', async () => {
      // Arrange
      const categoryId = 'test-category-id';
      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      const categoryWithUserId = { ...mockCategory, userId: mockUser.id };
      jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue(categoryWithUserId);
      jest.spyOn(prismaService.category, 'update').mockResolvedValue(updatedCategory);

      // Act
      const result = await service.update(categoryId, mockUser.id, updateCategoryDto);

      // Assert
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      // Arrange
      const categoryId = 'non-existent-id';
      jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(categoryId, mockUser.id, updateCategoryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a category successfully', async () => {
      // Arrange
      const categoryId = 'test-category-id';
      const categoryWithUserId = { ...mockCategory, userId: mockUser.id };
      jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue(categoryWithUserId);
      jest.spyOn(prismaService.expense, 'count').mockResolvedValue(0);
      jest.spyOn(prismaService.category, 'delete').mockResolvedValue(mockCategory);

      // Act
      const result = await service.remove(categoryId, mockUser.id);

      // Assert
      expect(result).toEqual({ message: 'Category deleted successfully' });
      expect(prismaService.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      // Arrange
      const categoryId = 'non-existent-id';
      jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(categoryId, mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return category statistics', async () => {
      // Arrange
      const mockStats = {
        total: 5,
        expense: 3,
        income: 2,
      };
      jest.spyOn(prismaService.category, 'count').mockResolvedValueOnce(5);
      jest.spyOn(prismaService.category, 'count').mockResolvedValueOnce(3);
      jest.spyOn(prismaService.category, 'count').mockResolvedValueOnce(2);

      // Act
      const result = await service.getStats(mockUser.id);

      // Assert
      expect(result).toEqual(mockStats);
      expect(prismaService.category.count).toHaveBeenCalledTimes(3);
    });
  });
});
