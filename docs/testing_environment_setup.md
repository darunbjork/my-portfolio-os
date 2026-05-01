# Testing Environment Setup and CI Fixes

## Issue
Tests were failing in the CI environment (GitHub Actions) due to missing environment variables such as `MONGO_URI` and `SENDGRID_API_KEY`. Locally, `dotenv` was not loading environment variables correctly, leading to `MONGO_URI` being undefined.

## Solution

### Local Testing: In-Memory Database and `dotenv` Configuration
To ensure reliable and fast local testing:
1.  **`mongodb-memory-server` Integration:** Implemented `mongodb-memory-server` using Jest's global hooks (`globalSetup`, `globalTeardown`) to provide an isolated, in-memory MongoDB instance for tests. This eliminates reliance on external database services.
2.  **`.env.test` Loading:** Configured Jest (`jest.config.js`, `jest.global-setup.js`) to load environment variables from a dedicated `.env.test` file. This ensures test-specific variables like `MONGO_URI_TEST`, `JWT_SECRET`, and `SENDGRID_API_KEY` are correctly loaded. Placeholder values are used for sensitive information in `.env.test`, and the file should not be committed.
3.  **Jest Configuration:** Updated Jest configuration to use `globalSetup` and `globalTeardown` for managing the in-memory server lifecycle and environment variables.

### CI Environment (GitHub Actions): Secret Mapping and Deprecation Fixes
1.  **Secret Mapping:** Updated `.github/workflows/ci.yml` to correctly map GitHub repository secrets (`secrets.MONGO_URI_TEST`, `secrets.SENDGRID_API_KEY`, `secrets.JWT_SECRET`) to the environment variables expected by the application and tests (e.g., `process.env.MONGO_URI`).
2.  **Deprecation Warning Resolution:** Addressed deprecation warnings for Node.js 20 actions by forcing the use of Node.js 24 for JavaScript actions in the CI workflow.

## Outcome
Tests now pass consistently both locally and in the CI environment, providing a stable foundation for development and deployment. The use of an in-memory database for local tests enhances speed and reliability.