module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/__mocks__/**',
    '!**/__tests__/**',
  ],
  coverageDirectory: './coverage/',
  testPathIgnorePatterns: ['/node_modules/', '/integration-tests/', '/build/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
}
