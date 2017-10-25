const typescript = require('rollup-plugin-typescript2')
const { join } = require('path')
function resolver (path) {
  return join(__dirname, path)
}
module.exports = {
  input: resolver('src/index.ts'),
  output: [
    {
      sourcemap: true,
      format: 'cjs',
      file: resolver('dist/index.js')
    },
    {
      sourcemap: true,
      format: 'es',
      file: resolver('dist/index.esm.js')
    }
  ],
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
