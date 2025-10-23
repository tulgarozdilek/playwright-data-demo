import { test, expect } from '@playwright/test';
import { getUsersPageHtml } from './utils/html-templates';

test.describe('User List - API Mocking', () => {

  // Scenario 4.a: Successful API Response (Stubbing)
  test('Should display user list successfully', async ({ page }) => {
    
    // Get HTML content from utility (with mockable URL)
    const htmlContent = getUsersPageHtml('http://localhost/api/users');
    
    // Intercept API call and return mock response (stub)
    await page.route('**/api/users**', async (route) => {
      const mockResponse = [
        { id: 1, name: 'Mock User 1', email: 'mock1@test.com' },
        { id: 2, name: 'Mock User 2', email: 'mock2@test.com' },
      ];
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    // Load HTML content as data URL
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);

    // Wait for API call to complete
    await page.waitForLoadState('networkidle');

    // Verify page renders our mock data correctly
    await expect(page.locator('#user-list li').first()).toHaveText('1: Mock User 1 (mock1@test.com)');
    await expect(page.locator('#user-list li').last()).toHaveText('2: Mock User 2 (mock2@test.com)');
    await expect(page.locator('#error-message')).toBeEmpty();
  });

  // Scenario 4.b: Empty List Response
  test('Should show message when no users found', async ({ page }) => {
    
    const htmlContent = getUsersPageHtml('http://localhost/api/users');
    
    // Return empty array from API
    await page.route('**/api/users**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '[]', // Empty list
      });
    });

    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);

    // Wait for API call to complete
    await page.waitForLoadState('networkidle');

    // Verify correct message is displayed
    await expect(page.locator('#user-list li')).toHaveText('No registered users found.');
  });

  // Scenario 4.c: API Error Response (Mocking)
  test('Should show error message when API returns 500', async ({ page }) => {
    
    const htmlContent = getUsersPageHtml('http://localhost/api/users');
    
    // Intercept API call and return 500 server error
    await page.route('**/api/users**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'text/plain',
        body: 'Internal Server Error',
      });
    });

    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);

    // Wait for API call to complete
    await page.waitForLoadState('networkidle');

    // Verify error message is displayed correctly in UI
    await expect(page.locator('#error-message')).toContainText('An error occurred');
    await expect(page.locator('#user-list')).toBeEmpty();
  });
});