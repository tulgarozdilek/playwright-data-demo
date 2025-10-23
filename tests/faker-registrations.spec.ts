import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Create dynamic user data for each test
const createRandomUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };
};

test.describe('User Registration Form - With Faker', () => {

  test('Successful user registration', async ({ page }) => {
    // 1. Generate random user data
    const randomUser = createRandomUser();
    console.log('Generated User:', randomUser.email);

    // 2. Navigate to registration page
    // Note: Update path according to your file structure
    await page.goto('file://' + process.cwd() + '/demo-app/register.html');

    // 3. Fill form with dynamic data
    await page.locator('#name').fill(randomUser.name);
    await page.locator('#email').fill(randomUser.email);
    await page.locator('#password').fill(randomUser.password);

    // 4. Click register button
    await page.locator('button[type="submit"]').click();

    // 5. Verify success message (Our demo HTML doesn't have a message, 
    //    but we can assume form gets cleared)
    // In a real application:
    // await expect(page.locator('#message')).toHaveText('Registration successful!');
    
    // For demo purposes, verify form is cleared (or input is empty)
    await expect(page.locator('#name')).toHaveValue('');
    
    // (In reality, form submission would refresh page or redirect)
  });
});