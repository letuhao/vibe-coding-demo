/**
 * @fileoverview JWT Auth Guard - JWT authentication guard
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * JWT Authentication Guard
 * Extends AuthGuard to use JWT strategy for authentication
 * Can be bypassed for public routes using @Public decorator
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Constructor for JWT Auth Guard
   * @param reflector - Reflector service for metadata access
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determine if the route should be accessible without authentication
   * @param context - Execution context containing request information
   * @returns True if route is public, false otherwise
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
