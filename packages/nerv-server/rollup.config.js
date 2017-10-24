const typescript = require('rollup-plugin-typescript2')
const pkg = require('./package.json')

module.exports = {
  input: 'src/index.ts',
  plugins: [typescript()],
  output: [
    {
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'es',
      file: pkg.module
    }
  ]
}
