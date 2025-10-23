import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import sqlite3 from 'sqlite3';

// Set up database connection (in-memory for testing)
const db = new sqlite3.Database(':memory:');

// Helper function: Query user from database
async function getUserFromDb(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Create database table before test suite starts
test.beforeAll(async () => {
  await new Promise<void>((resolve, reject) => {
    db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)', (err) => {
      if (err) return reject(err);
      console.log('Test database table created.');
      resolve();
    });
  });
});

// Close database connection after tests complete
test.afterAll(async () => {
  await new Promise<void>((resolve) => {
    db.close(() => {
      console.log('Database connection closed.');
      resolve();
    });
  });
});


test('Database verification after registration', async ({ page }) => {
  // 1. Create dynamic user
  const testUser = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
  };

  // 2. Add this user to database (instead of API or UI)
  // This is an example of "Test Seeding" (Data Insertion).
  await new Promise<void>((resolve, reject) => {
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [testUser.name, testUser.email], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // 3. Database Verification
  // After performing an action in UI, we could come here and verify.
  console.log(`Searching in database: ${testUser.email}`);
  const userInDb = await getUserFromDb(testUser.email);

  // 4. Validation
  expect(userInDb).toBeDefined();
  expect(userInDb.name).toBe(testUser.name);
  expect(userInDb.email).toBe(testUser.email);
});