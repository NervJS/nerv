module.exports = {
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'packages/nerv/src/**/*.ts',
    'packages/nerv-utils/src/**/*.ts',
    'packages/nerv-shared/src/**/*.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^nerv(.*?)$': '<rootDir>/packages/nerv$1/src'
  },
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/packages/*/__tests__/**/*spec.js?(x)'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)']
}
