module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/__mocks__/**',
    '!**/__tests__/**',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/integration-tests/',
    '<rootDir>/build/',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
}
