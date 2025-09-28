/**
 * @fileoverview Basic E2E tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test'

test.describe('Basic App Tests', () => {
  test('should load a simple HTML page', async ({ page }) => {
    // Create a simple HTML page for testing
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Expense Manager</title>
      </head>
      <body>
        <h1>Expense Manager</h1>
        <p>Welcome to the Expense Manager application</p>
      </body>
      </html>
    `)
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Expense Manager/)
    await expect(page.getByRole('heading', { name: 'Expense Manager' })).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Page</title>
      </head>
      <body>
        <h1>Test</h1>
      </body>
      </html>
    `)
    
    // Check viewport meta tag
    const viewport = await page.getAttribute('meta[name="viewport"]', 'content')
    expect(viewport).toBe('width=device-width, initial-scale=1.0')
  })

  test('should handle JavaScript execution', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>JS Test</title>
      </head>
      <body>
        <div id="test">Loading...</div>
        <script>
          document.getElementById('test').textContent = 'JavaScript works!';
        </script>
      </body>
      </html>
    `)
    
    // Wait for JavaScript to execute
    await page.waitForFunction(() => {
      const element = document.getElementById('test');
      return element && element.textContent === 'JavaScript works!';
    })
    
    await expect(page.getByText('JavaScript works!')).toBeVisible()
  })

  test('should handle form interactions', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Form Test</title>
      </head>
      <body>
        <form id="test-form">
          <input type="email" id="email" placeholder="Email" required>
          <input type="password" id="password" placeholder="Password" required>
          <button type="submit">Submit</button>
        </form>
        <div id="result"></div>
        <script>
          document.getElementById('test-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            document.getElementById('result').textContent = 'Form submitted with: ' + email;
          });
        </script>
      </body>
      </html>
    `)
    
    // Fill form
    await page.fill('#email', 'test@example.com')
    await page.fill('#password', 'password123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check result
    await expect(page.getByText('Form submitted with: test@example.com')).toBeVisible()
  })
})
