module.exports = {
  extends: ['standard', 'standard-jsx'],
  ecmaFeatures: {
    classes: true
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'no-unused-expressions': 0,
    'prefer-const': ['error']
  },
  globals: {
    describe: true,
    it: true,
    beforeAll: true,
    beforeEach: true,
    afterEach: true,
    afterAll: true,
    expect: true,
    jasmine: true,
    jest: true
  },
  parser: 'babel-eslint'
}
