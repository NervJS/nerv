const { typescript } = require('../build')
const { join } = require('path')
function resolver (path) {
  return join(__dirname, path)
}
module.exports = {
  input: resolver('src/index.ts'),
  output: {
    sourcemap: true,
    name: 'nerv-devtools',
    format: 'umd',
    file: resolver('dist/index.js')
  },
  external: ['nervjs'],
  globals: {
    nervjs: 'Nerv'
  },
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
