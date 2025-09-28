/**
 * @fileoverview Get User Decorator - Extract user from request
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * User interface for JWT payload
 */
export interface User {
  /** User ID */
  id: string;
  /** User email */
  email: string;
  /** Token issued at timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
}

/**
 * GetUser decorator extracts user information from JWT token
 * @param data - Optional data parameter (unused)
 * @param ctx - Execution context containing request
 * @returns User object from JWT payload
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
