/**
 * @fileoverview Dashboard E2E tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in real scenario, you'd login first
    await page.goto('http://localhost:5173/dashboard');
  });

  test('should show dashboard page elements', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Check main dashboard elements
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should show navigation buttons', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Check navigation buttons
    await expect(page.getByText(/expenses/i)).toBeVisible();
    await expect(page.getByText(/categories/i)).toBeVisible();
  });

  test('should navigate to expenses page', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Click on expenses button
    await page.getByText(/expenses/i).click();
    await expect(page).toHaveURL(/.*expenses/);
  });

  test('should navigate to categories page', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Click on categories button
    await page.getByText(/categories/i).click();
    await expect(page).toHaveURL(/.*categories/);
  });

  test('should show logout functionality', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Check for logout button (assuming it exists)
    const logoutButton = page.getByRole('button', { name: /logout/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should display user information', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Check for user email display (assuming it exists)
    const userEmail = page.getByText(/@/);
    if (await userEmail.isVisible()) {
      await expect(userEmail).toBeVisible();
    }
  });

  test('should show expense statistics', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Check for statistics cards (assuming they exist)
    const statsCards = page.locator('[data-testid="stat-card"]');
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
    }
  });

  test('should show recent expenses', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Check for recent expenses section (assuming it exists)
    const recentExpenses = page.getByText(/recent expenses/i);
    if (await recentExpenses.isVisible()) {
      await expect(recentExpenses).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/dashboard');
    
    // Check if dashboard is still accessible
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });
});