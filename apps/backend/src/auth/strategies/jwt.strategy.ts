/**
 * @fileoverview JWT Strategy - JWT authentication strategy
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * JWT Strategy for authentication
 * Extracts JWT token from Authorization header and validates it
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for JWT Strategy
   * @param configService - Configuration service for environment variables
   * @param prismaService - Prisma service for database operations
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validate JWT payload and return user information
   * @param payload - JWT payload containing user information
   * @returns User object if valid, throws UnauthorizedException if invalid
   */
  async validate(payload: any) {
    try {
      // Verify user still exists in database
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
