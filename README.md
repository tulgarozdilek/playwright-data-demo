# Playwright Data-Driven Demo

This repository is a small demo showing common Playwright testing patterns: API mocking/stubbing, data-driven tests using JSON, generating test data with Faker, and verifying data in a database (SQLite). It also contains a tiny demo app (`demo-app`) used by some tests.

## Contents

- `tests/` - Playwright test files demonstrating techniques.
  - `api-mocking.spec.ts` - Shows how to stub and mock HTTP responses with `page.route()` and how the UI reacts to successful, empty, and error API responses.
  - `faker-registrations.spec.ts` - Generates random user data with `@faker-js/faker`, fills `demo-app/register.html`, and demonstrates form submission flows in tests.
  - `json-data-driven.spec.ts` - Data-driven tests that load `test-data/logins.json` and create a test per JSON entry (good for multiple credential/role scenarios).
  - `sql-verification.spec.ts` - Demonstrates seeding an in-memory SQLite database, inserting a record, and verifying the inserted data (useful for DB-level assertions).
  - `utils/html-templates.ts` - Shared HTML template used by `api-mocking.spec.ts` to host a simple user list page as a data URL so API calls can be intercepted.

- `demo-app/` - Simple static HTML pages used in tests:
  - `register.html` - Basic registration form used by `faker-registrations.spec.ts`.
  - `users.html` - Basic user-list page (the same UI logic also exists inside `tests/utils/html-templates.ts`).

- `test-data/logins.json` - Example JSON input file used by `json-data-driven.spec.ts`.

## Prerequisites

- Node.js (recommended >= 18.x) and npm installed.
- Install dependencies:

```powershell
npm install
```

Playwright is included as a devDependency in `package.json`. If you need browser binaries installed, run:

```powershell
npx playwright install
```

## Run tests

From the repository root you can run all tests with:

```powershell
npx playwright test
```

To run a single test file, for example the API mocking tests:

```powershell
npx playwright test tests/api-mocking.spec.ts
```

Note: Some tests load HTML files directly from disk (using `file://` URLs) or render HTML via data URLs. They do not require a running web server.

## What each test demonstrates

- api-mocking.spec.ts
  - Uses `page.route('**/api/users**', handler)` to intercept requests and either fulfill them with a mocked response or simulate server errors.
  - Tests three scenarios: successful list (stubbing), empty list, and server error handling. The test loads a small HTML template (from `tests/utils/html-templates.ts`) as a data URL so Playwright can intercept the API call.

- faker-registrations.spec.ts
  - Uses `@faker-js/faker` to generate dynamic user data for each test run.
  - Navigates to `demo-app/register.html` (via `file://` + `process.cwd()`) and fills the registration form, then asserts post-submit behavior (the demo simply clears the form).

- json-data-driven.spec.ts
  - Imports `test-data/logins.json` and iterates over each object to create a separate Playwright test for each dataset.
  - Demonstrates the pattern for credential matrix testing or role-based checks without duplicating test code.

- sql-verification.spec.ts
  - Creates an in-memory SQLite database (`:memory:`), creates a `users` table in `test.beforeAll`, inserts a test user, then queries the DB and asserts the inserted data matches expected values.
  - Useful pattern for tests where you need to seed and verify database state.

## Notes and suggestions

- The project currently has a minimal `package.json` and no test scripts. Consider adding convenient npm scripts, for example:

```json
"scripts": {
  "test": "playwright test",
  "test:report": "playwright test --reporter=html"
}
```

- Some tests (like the registration one) use `file://` URLs to load local HTML. If you prefer a production-like environment, add a small static server (for example `http-server`) and point Playwright `baseURL` to it via `playwright.config.ts`.

- `playwright.config.ts` is already configured to produce an HTML report and run tests in parallel across browsers. Adjust `projects` if you want Firefox/WebKit runs.

## Troubleshooting

- If imports like `import loginData from '../test-data/logins.json'` fail under your TypeScript configuration, enable `resolveJsonModule` in `tsconfig.json` or import via `fs` at runtime.
- If tests that use SQLite fail, ensure `sqlite3` is installed correctly for your platform (native binaries may require build tools on Windows).

## Quick checklist to get started

1. npm install
2. npx playwright install (optional, to install browsers)
3. npx playwright test

---

If you'd like, I can also:
- add npm scripts to `package.json`,
- install Playwright browsers automatically, or
- add a small static server and update `playwright.config.ts` to use `webServer` for a more realistic test environment.
