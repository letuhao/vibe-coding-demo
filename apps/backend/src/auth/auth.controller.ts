/**
 * @fileoverview Auth Controller - Authentication endpoints
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { User } from '../common/decorators/get-user.decorator';

/**
 * AuthController handles authentication endpoints
 * Provides registration, login, token refresh, and profile endpoints
 */
@Controller('auth')
export class AuthController {
  /**
   * Constructor for AuthController
   * @param authService - Authentication service
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * @param registerDto - User registration data
   * @returns User information and tokens
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Authenticate user login
   * @param loginDto - User login data
   * @returns User information and tokens
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh access token
   * @param refreshTokenDto - Refresh token data
   * @returns New access token
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * Get current user profile
   * @param user - Current authenticated user
   * @returns User profile information
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@GetUser() user: User) {
    return {
      success: true,
      data: user,
      message: 'Profile retrieved successfully',
    };
  }
}
