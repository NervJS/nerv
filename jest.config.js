module.exports = {
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'packages/nerv/src/**/*.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    nervjs: '<rootDir>/packages/nerv/src',
    'nerv-create-class': '<rootDir>/packages/nerv-create-class',
    'nerv-devtools': '<rootDir>/packages/nerv-devtools',
    'nerv-redux': '<rootDir>/packages/nerv-redux',
    'nerv-shared': '<rootDir>/packages/nerv-shared',
    'nerv-test-utils': '<rootDir>/packages/nerv-test-utils',
    'nerv-utils': '<rootDir>/packages/nerv-utils'
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        target: 'es5',
        removeComments: false,
        preserveConstEnums: true,
        moduleResolution: 'node',
        experimentalDecorators: true,
        noImplicitAny: false,
        allowSyntheticDefaultImports: true,
        strictNullChecks: true,
        noImplicitThis: true,
        sourceMap: true
      },
      diagnostics: false
    }
  },
  rootDir: __dirname,
  testMatch: [
    // '<rootDir>/packages/nerv/__tests__/cloneElement.spec.js',
    // '<rootDir>/packages/nerv/__tests__/component.spec.js',
    // '<rootDir>/packages/nerv/__tests__/render.spec.js',
    // '<rootDir>/packages/nerv/__tests__/lifecycle.spec.js',
    // '<rootDir>/packages/nerv/__tests__/svg.spec.js'
    // '<rootDir>/packages/nerv/__tests__/event.spec.js'
    // '<rootDir>/packages/**/__tests__/**/*spec.js'
    '<rootDir>/packages/**/__tests__/**/*spec.js'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)']
}
