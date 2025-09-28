/**
 * @fileoverview Refresh Token DTO - Token refresh validation
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for refresh token request
 * Validates refresh token presence
 */
export class RefreshTokenDto {
  /**
   * Refresh token string
   * Must not be empty
   */
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
