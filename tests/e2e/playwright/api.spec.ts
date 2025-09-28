/**
 * @fileoverview API Integration E2E tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });

    await page.goto('http://localhost:5173/login');
    
    // Try to login
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check for error handling
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });

  test('should handle network timeout', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/**', route => {
      // Simulate timeout
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Success' })
        });
      }, 10000);
    });

    await page.goto('http://localhost:5173/login');
    
    // Try to login
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check for loading state
    await expect(page.getByText(/loading/i)).toBeVisible();
  });

  test('should handle authentication token refresh', async ({ page }) => {
    // Mock token refresh scenario
    await page.route('**/api/auth/refresh', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token'
        })
      });
    });

    await page.goto('http://localhost:5173/dashboard');
    
    // Check that page loads successfully after token refresh
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should handle unauthorized access', async ({ page }) => {
    // Mock unauthorized response
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' })
      });
    });

    await page.goto('http://localhost:5173/dashboard');
    
    // Check that user is redirected to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle validation errors from API', async ({ page }) => {
    // Mock validation error response
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Validation failed',
          errors: {
            email: 'Invalid email format',
            password: 'Password is too short'
          }
        })
      });
    });

    await page.goto('http://localhost:5173/login');
    
    // Try to login
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check for API validation errors
    await expect(page.getByText(/invalid email format/i)).toBeVisible();
    await expect(page.getByText(/password is too short/i)).toBeVisible();
  });

  test('should handle successful API responses', async ({ page }) => {
    // Mock successful login response
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'test@example.com'
          },
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        })
      });
    });

    await page.goto('http://localhost:5173/login');
    
    // Try to login
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check that user is redirected to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle API rate limiting', async ({ page }) => {
    // Mock rate limit response
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Too Many Requests',
          retryAfter: 60
        })
      });
    });

    await page.goto('http://localhost:5173/login');
    
    // Try to login multiple times
    for (let i = 0; i < 3; i++) {
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /login/i }).click();
    }
    
    // Check for rate limit error
    await expect(page.getByText(/too many requests/i)).toBeVisible();
  });

  test('should handle API maintenance mode', async ({ page }) => {
    // Mock maintenance mode response
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Service temporarily unavailable',
          maintenance: true
        })
      });
    });

    await page.goto('http://localhost:5173/login');
    
    // Try to login
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check for maintenance mode message
    await expect(page.getByText(/service temporarily unavailable/i)).toBeVisible();
  });
});
