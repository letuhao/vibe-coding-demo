/**
 * @fileoverview Auth Types - Authentication related type definitions
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

/**
 * User interface for authentication
 */
export interface User {
  /** User ID */
  id: string;
  /** User email address */
  email: string;
  /** User creation timestamp */
  createdAt: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  /** User email address */
  email: string;
  /** User password */
  password: string;
  /** Password confirmation */
  confirmPassword: string;
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
  /** Refresh token string */
  refreshToken: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  /** User information */
  user: User;
  /** JWT access token */
  accessToken: string;
  /** JWT refresh token */
  refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  /** New JWT access token */
  accessToken: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Indicates if the request was successful */
  success: boolean;
  /** Response data */
  data?: T;
  /** Response message */
  message?: string;
  /** Response timestamp */
  timestamp?: string;
  /** Error details if any */
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}
