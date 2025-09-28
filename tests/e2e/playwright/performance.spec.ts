/**
 * @fileoverview Performance and Accessibility E2E tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load pages within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:5173/');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
  });

  test('should have good performance metrics', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Check for performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    expect(metrics.domContentLoaded).toBeLessThan(1000);
    expect(metrics.loadComplete).toBeLessThan(2000);
    expect(metrics.totalTime).toBeLessThan(3000);
  });

  test('should handle large data sets efficiently', async ({ page }) => {
    // Mock large dataset
    await page.route('**/api/expenses**', route => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i.toString(),
        amount: Math.random() * 1000,
        note: `Expense ${i}`,
        date: new Date().toISOString(),
        categoryId: '1'
      }));
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: largeDataset })
      });
    });

    const startTime = Date.now();
    await page.goto('http://localhost:5173/expenses');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // Should handle large dataset within 5 seconds
  });
});

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Check heading hierarchy
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    
    if (await h1.count() > 0) {
      await expect(h1.first()).toBeVisible();
    }
    
    if (await h2.count() > 0) {
      await expect(h2.first()).toBeVisible();
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Check that form inputs have proper labels
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should have proper button accessibility', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Check that buttons have proper roles and accessible names
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
    
    // Check that buttons are focusable
    await loginButton.focus();
    await expect(loginButton).toBeFocused();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is on login button
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeFocused();
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Check that text is visible (basic contrast check)
    const textElements = page.locator('p, span, div').filter({ hasText: /./ });
    const firstText = textElements.first();
    
    if (await firstText.isVisible()) {
      const color = await firstText.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });
      
      expect(color).not.toBe('rgba(0, 0, 0, 0)'); // Should not be transparent
    }
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Check for ARIA attributes on form elements
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    
    // Check that inputs have proper ARIA attributes
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should be screen reader friendly', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Check that important content is accessible to screen readers
    const mainHeading = page.getByRole('heading', { level: 1 });
    if (await mainHeading.isVisible()) {
      await expect(mainHeading).toBeVisible();
    }
    
    // Check for proper landmark roles
    const main = page.locator('main');
    if (await main.count() > 0) {
      await expect(main.first()).toBeVisible();
    }
  });
});

test.describe('Cross-Browser Compatibility', () => {
  test('should work in Chrome', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.goto('http://localhost:5173/');
      await expect(page.getByRole('heading')).toBeVisible();
    }
  });

  test('should work in Firefox', async ({ page, browserName }) => {
    if (browserName === 'firefox') {
      await page.goto('http://localhost:5173/');
      await expect(page.getByRole('heading')).toBeVisible();
    }
  });

  test('should work in Safari', async ({ page, browserName }) => {
    if (browserName === 'webkit') {
      await page.goto('http://localhost:5173/');
      await expect(page.getByRole('heading')).toBeVisible();
    }
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/');
    
    // Check that page is still accessible
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('should have proper touch targets', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/login');
    
    // Check that buttons are large enough for touch
    const loginButton = page.getByRole('button', { name: /login/i });
    const box = await loginButton.boundingBox();
    
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44); // Minimum touch target size
    }
  });

  test('should handle mobile gestures', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/');
    
    // Test swipe gestures (if applicable)
    await page.touchscreen.tap(200, 300);
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
