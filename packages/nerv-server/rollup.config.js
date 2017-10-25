const typescript = require('rollup-plugin-typescript2')
const pkg = require('./package.json')
const { join } = require('path')
module.exports = {
  input: 'src/index.ts',
  plugins: [typescript()],
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      file: join(__dirname, 'dist/index.js')
    },
    {
      format: 'es',
      sourcemap: true,
      file: join(__dirname, pkg.module)
    }
  ]
}
