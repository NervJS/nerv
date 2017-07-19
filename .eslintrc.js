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
  globals: {
    describe: true,
    it: true
  },
  parser: 'babel-eslint'
}
