/* eslint-disable no-undef */
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // '@' 접두사를 'src' 디렉토리로 매핑
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom'
};
