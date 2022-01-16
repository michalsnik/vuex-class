const tsJest = require.resolve('ts-jest');

export default {
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
    'ts'
  ],
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  },
  transform: {
    '^.+\\.ts$': tsJest
  },
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: [
    '**/*.spec.ts',
  ],
  // https://github.com/facebook/jest/issues/6766
  testURL: 'http://localhost/',
};
