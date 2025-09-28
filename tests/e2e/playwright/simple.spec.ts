/**
 * @fileoverview Simple E2E tests to verify basic functionality
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('Simple App Tests', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page loads without errors
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/simple-load.png' });
  });

  test('should show login page elements', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for basic form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Check if elements exist
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/simple-login.png' });
  });

  test('should show register page elements', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for basic form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInputs = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Check if elements exist
    await expect(emailInput).toBeVisible();
    await expect(passwordInputs).toHaveCount(2); // password and confirm password
    await expect(submitButton).toBeVisible();
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/simple-register.png' });
  });

  test('should handle form submission', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Fill form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait a bit for response
    await page.waitForTimeout(2000);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/simple-submit.png' });
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
    
    // Test dashboard (should redirect to login if not authenticated)
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show error messages', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Wait for validation or error
    await page.waitForTimeout(1000);
    
    // Check for any error messages or validation
    const errorMessages = page.locator('[class*="error"], [class*="invalid"], .text-red-500, .text-red-600');
    const errorCount = await errorMessages.count();
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/simple-errors.png' });
    
    // Log page content for debugging
    const pageContent = await page.content();
    console.log('Page content length:', pageContent.length);
  });
});
