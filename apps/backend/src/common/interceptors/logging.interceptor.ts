/**
 * @fileoverview Logging Interceptor - Logs all HTTP requests and responses
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Logging interceptor that logs all HTTP requests and responses
 * Helps with debugging API calls
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Intercept and log HTTP requests/responses
   * @param context - Execution context
   * @param next - Next handler
   * @returns Observable with logging
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, query, params } = request;
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(`Incoming Request: ${method} ${url}`);
    this.logger.debug('Request details:', {
      method,
      url,
      body: this.sanitizeBody(body),
      query,
      params,
      headers: this.sanitizeHeaders(request.headers),
    });

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Log successful response
        this.logger.log(`Outgoing Response: ${method} ${url} - ${response.statusCode} (${duration}ms)`);
        this.logger.debug('Response details:', {
          statusCode: response.statusCode,
          duration: `${duration}ms`,
          data: this.sanitizeResponse(data),
        });
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Log error response
        this.logger.error(`Error Response: ${method} ${url} - ${error.status || 500} (${duration}ms)`);
        this.logger.error('Error details:', {
          statusCode: error.status || 500,
          duration: `${duration}ms`,
          message: error.message,
          stack: error.stack,
        });
        
        throw error;
      }),
    );
  }

  /**
   * Sanitize request body to remove sensitive information
   * @param body - Request body
   * @returns Sanitized body
   */
  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sanitized = { ...body };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'confirmPassword', 'refreshToken', 'accessToken'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  /**
   * Sanitize response data to remove sensitive information
   * @param data - Response data
   * @returns Sanitized data
   */
  private sanitizeResponse(data: any): any {
    if (!data) return data;
    
    const sanitized = { ...data };
    
    // Remove sensitive fields from response
    const sensitiveFields = ['password', 'refreshToken', 'accessToken'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  /**
   * Sanitize headers to remove sensitive information
   * @param headers - Request headers
   * @returns Sanitized headers
   */
  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    
    // Remove sensitive headers
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}
