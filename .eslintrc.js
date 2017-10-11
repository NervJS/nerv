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
    before: true,
    beforeAll: true,
    beforeEach: true,
    after: true,
    afterAll: true,
    sinon: true,
    expect: true
  },
  parser: 'babel-eslint'
}
