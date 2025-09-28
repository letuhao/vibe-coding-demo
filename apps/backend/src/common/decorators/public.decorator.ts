/**
 * @fileoverview Public Decorator - Mark routes as public (no authentication required)
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for public routes
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public decorator to mark routes as accessible without authentication
 * @returns Metadata decorator that sets the route as public
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
