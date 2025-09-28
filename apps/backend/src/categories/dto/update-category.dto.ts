/**
 * @fileoverview Update Category DTO - Category update validation
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * DTO for updating an existing category
 * All fields are optional, inherits validation from CreateCategoryDto
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
