/**
 * @fileoverview Login DTO - User authentication validation
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for user login
 * Validates email format and password presence
 */
export class LoginDto {
  /**
   * User email address
   * Must be a valid email format
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  /**
   * User password
   * Must be at least 1 character (presence validation)
   */
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
