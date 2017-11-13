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
    nervjs: '<rootDir>/packages/nerv/src',
    '^nerv(.*?)$': '<rootDir>/packages/nerv$1/src'
  },
  mapCoverage: true,
  globals: {
    'ts-jest': {
      'skipBabel': true,
      tsConfigFile: {
        target: 'es5',
        removeComments: false,
        preserveConstEnums: true,
        moduleResolution: 'node',
        experimentalDecorators: true,
        noImplicitAny: false,
        allowSyntheticDefaultImports: true,
        strictNullChecks: true,
        noImplicitThis: true,
        inlineSourceMap: true,
        sourceMap: true
      }
    }
  },
  rootDir: __dirname,
  testMatch: [
    // '<rootDir>/packages/nerv/__tests__/componentDidCatch.spec.js'
    '<rootDir>/packages/nerv/__tests__/lifecycle.spec.js'
    // '<rootDir>/packages/**/__tests__/**/*spec.js'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)']
}
