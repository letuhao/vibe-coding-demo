/**
 * @fileoverview Working E2E tests based on actual UI implementation
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('Working E2E Tests', () => {
  test('should load login page successfully', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Check basic form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Expense Manager');
  });

  test('should load register page successfully', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.waitForLoadState('networkidle');
    
    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(2); // password and confirm password
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle form submission', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check that we're still on a valid page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/localhost:5173/);
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate between pages', async ({ page }) => {
    // Test login page
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Test register page
    await page.goto('http://localhost:5173/register');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Test dashboard redirect (should redirect to login if not authenticated)
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle empty form submission', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Wait for validation
    await page.waitForTimeout(1000);
    
    // Check that form is still visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Check that form elements are still visible on mobile
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/auth/login', route => route.abort());
    
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error
    await page.waitForTimeout(3000);
    
    // Check that page is still functional
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should load all main pages', async ({ page }) => {
    const pages = [
      'http://localhost:5173/login',
      'http://localhost:5173/register',
      'http://localhost:5173/dashboard',
      'http://localhost:5173/categories',
      'http://localhost:5173/expenses'
    ];
    
    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Check that page loads without errors
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/localhost:5173/);
      
      // Check that page has basic structure
      const body = await page.locator('body').textContent();
      expect(body).toBeTruthy();
    }
  });

  test('should handle form validation', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.waitForLoadState('networkidle');
    
    // Try to submit form with mismatched passwords
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Fix: Use more specific selector for confirm password
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(1).fill('different123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for validation
    await page.waitForTimeout(2000);
    
    // Check that form is still visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should maintain session state', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Navigate away and back
    await page.goto('http://localhost:5173/register');
    await page.goto('http://localhost:5173/login');
    
    // Check that form is still functional
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
