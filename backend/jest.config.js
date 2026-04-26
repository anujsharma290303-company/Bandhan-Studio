/**
 * Jest Configuration - Unit and Integration Test Runner
 * Compiles TypeScript, runs Node environment tests, generates coverage reports
 */
module.exports = {
  preset: 'ts-jest',           // Use ts-jest to compile TypeScript
  testEnvironment: 'node',       // Run tests in Node.js environment (not browser)
  roots: ['<rootDir>/tests'],    // Look for tests in /tests folder
  testMatch: ['**/*.test.ts'],   // Match files ending in .test.ts
  moduleFileExtensions: ['ts', 'js', 'json'],  // Supported file extensions
  collectCoverageFrom: ['src/**/*.ts'],  // Collect coverage from all src files
  transform: {
    // Transform TypeScript files with ts-jest
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        types: ['jest', 'node']  // Include Jest and Node.js types
      }
    }]
  }
};