import { test, expect } from '@playwright/test';
// Import JSON file directly
import loginData from '../test-data/logins.json';

test.describe('Login Tests - JSON Data Driven', () => {

  // Create a test for each object in the JSON file
  for (const user of loginData) {
    
    test(`Login Test: ${user.type}`, async ({ page }) => {
      // (Assuming we have a hypothetical login page)
      // await page.goto('/login');
      console.log(`Testing: ${user.username} - Expected: ${user.expectedRole}`);
      
      // await page.locator('#username').fill(user.username);
      // await page.locator('#password').fill(user.password);
      // await page.locator('#loginButton').click();

      // Hypothetical validations
      if (user.expectedRole === 'admin') {
        // await expect(page.locator('#admin-dashboard')).toBeVisible();
        expect(user.expectedRole).toBe('admin'); // For demo purposes
      } else if (user.expectedRole === 'user') {
        // await expect(page.locator('#user-profile')).toBeVisible();
        expect(user.expectedRole).toBe('user'); // For demo purposes
      } else {
        // await expect(page.locator('.error-message')).toHaveText('Invalid username or password');
        expect(user.expectedRole).toBe('error'); // For demo purposes
      }
    });
  }
});