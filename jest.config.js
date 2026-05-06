module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  moduleNameMapper: {
    '\\.module\\.css$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.css$': '<rootDir>/tests/__mocks__/styleMock.js',
  },
};
