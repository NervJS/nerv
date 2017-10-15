module.exports = {
  mapCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverage: true,
  // collectCoverageFrom: [
  //   'src/*.ts',
  //   'src/**/*.ts'
  // ],
  globals: {
    'ts-jest': {
      tsConfigFile: {
        'target': 'es5',
        'removeComments': true,
        'preserveConstEnums': true,
        'moduleResolution': 'node',
        'experimentalDecorators': true,
        'noImplicitAny': false,
        'allowSyntheticDefaultImports': true,
        'strictNullChecks': true,
        'noImplicitThis': true,
        'inlineSourceMap': true
      }
    }
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
