import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Load next.config.ts and .env files in the test environment
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // e2e/ is Playwright's; its specs must never run under Jest
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
};

export default createJestConfig(config);
