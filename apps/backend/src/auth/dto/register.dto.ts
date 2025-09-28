/**
 * @fileoverview Register DTO - User registration validation
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

/**
 * DTO for user registration
 * Validates email format, password strength, and confirmation
 */
export class RegisterDto {
  /**
   * User email address
   * Must be a valid email format
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  /**
   * User password
   * Must be at least 8 characters long
   * Must contain at least one uppercase letter, one lowercase letter, and one number
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  /**
   * Password confirmation
   * Must match the password field
   */
  @IsString()
  confirmPassword: string;
}
