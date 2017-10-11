module.exports = {
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  globals: {
    usingJSDOM: true,
    usingJest: true
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  rootDir: __dirname,
  // setupFiles: ['<rootDir>/scripts/test/requestAnimationFrame.ts'],
  testMatch: [
    '<rootDir>/test/spec.js'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  }
}
