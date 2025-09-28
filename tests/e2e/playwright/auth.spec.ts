/**
 * @fileoverview Authentication E2E tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start backend server before each test
    // Note: In real scenario, you'd start the backend server
    await page.goto('http://localhost:5173/');
  });

  test('should redirect to login page from root', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveURL(/.*login/);
    // Check for login form instead of heading
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should show login form elements', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Check form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByText(/don't have an account/i)).toBeVisible();
  });

  test('should show register form elements', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    // Check form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    await expect(page.getByText(/already have an account/i)).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    // Test login to register navigation
    await page.goto('http://localhost:5173/login');
    await page.getByText(/don't have an account/i).click();
    await expect(page).toHaveURL(/.*register/);
    
    // Test register to login navigation
    await page.getByText(/already have an account/i).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for validation errors (assuming form validation is implemented)
    // Note: This test assumes client-side validation exists
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Fill form with invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).first().fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for email validation error
    await expect(page.getByText(/please provide a valid email/i)).toBeVisible();
  });

  test('should show validation errors for short password', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    // Fill form with short password
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).first().fill('123');
    await page.getByLabel(/confirm password/i).fill('123');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Check for password validation error
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible();
  });

  test('should show validation error for password mismatch', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    // Fill form with mismatched passwords
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).first().fill('password123');
    await page.getByLabel(/confirm password/i).fill('different123');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Check for password mismatch error
    await expect(page.getByText(/password confirmation does not match/i)).toBeVisible();
  });

  test('should handle login with non-existent user', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Fill form with non-existent user
    await page.getByLabel(/email/i).fill('nonexistent@example.com');
    await page.getByLabel(/password/i).first().fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for error message (assuming backend returns error)
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should handle registration with existing email', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    // Fill form with existing email
    await page.getByLabel(/email/i).fill('existing@example.com');
    await page.getByLabel(/password/i).first().fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Check for error message
    await expect(page.getByText(/user with this email already exists/i)).toBeVisible();
  });

  test('should show loading state during form submission', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Fill form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).first().fill('password123');
    
    // Submit form and check loading state
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for loading indicator (assuming it exists)
    await expect(page.getByText(/loading/i)).toBeVisible();
  });
});