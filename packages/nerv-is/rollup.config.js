const typescript = require('rollup-plugin-typescript2')
const { join } = require('path')
const alias = require('rollup-plugin-alias')
function resolver (path) {
  return join(__dirname, path)
}
module.exports = {
  input: resolver('src/index.ts'),
  output: {
    sourcemap: true,
    format: 'es',
    file: resolver('dist/index.js')
  },
  plugins: [
    alias({
      'nerv-shared': join(process.cwd(), '../nerv-shared/dist/index')
    }),
    typescript({
      tsconfig: resolver('../../tsconfig.json'),
      typescript: require('typescript')
    })
  ]
}
