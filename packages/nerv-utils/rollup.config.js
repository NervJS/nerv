const typescript = require('rollup-plugin-typescript2')
const { join } = require('path')
function resolver (path) {
  return join(__dirname, path)
}
module.exports = {
  input: resolver('src/index.ts'),
  output: {
    sourcemap: true,
    name: 'nerv-devtools',
    format: 'es',
    file: resolver('dist/index.js')
  },
  external: ['nerv-shared'],
  plugins: [
    typescript({
      tsconfig: resolver('../../tsconfig.json'),
      typescript: require('typescript')
    })
  ]
}
