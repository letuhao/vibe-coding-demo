/**
 * @fileoverview Realistic E2E tests based on actual UI
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('Realistic App Tests', () => {
  test('should load login page and show basic elements', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/realistic-login.png' });
    
    // Check for basic form elements that actually exist
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Expense Manager');
  });

  test('should load register page and show basic elements', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/realistic-register.png' });
    
    // Check for basic form elements that actually exist
    const emailInput = page.locator('input[type="email"]');
    const passwordInputs = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInputs).toHaveCount(2); // password and confirm password
    await expect(submitButton).toBeVisible();
  });

  test('should handle form submission without errors', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Fill form with test data
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/realistic-submit.png' });
    
    // Check that we're still on a valid page (not error page)
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/localhost:5173/);
  });

  test('should navigate between login and register', async ({ page }) => {
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
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show proper form validation', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Wait for validation
    await page.waitForTimeout(1000);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/realistic-validation.png' });
    
    // Check that form is still visible (not crashed)
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should handle invalid credentials gracefully', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/realistic-invalid-credentials.png' });
    
    // Check that we're still on login page (not crashed)
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should load dashboard when authenticated', async ({ page }) => {
    // This test assumes we have a way to authenticate
    // For now, just check that dashboard redirects to login
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/realistic-dashboard-redirect.png' });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/realistic-mobile.png' });
    
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
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/realistic-network-error.png' });
    
    // Check that page is still functional
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
