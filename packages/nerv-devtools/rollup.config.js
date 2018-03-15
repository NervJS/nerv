const typescript = require('rollup-plugin-typescript2')
const alias = require('rollup-plugin-alias')
const { join } = require('path')
function resolver (path) {
  return join(__dirname, path)
}
const cwd = process.cwd()
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
    alias({
      'nerv-shared': join(cwd, '../nerv-shared/dist/index'),
      'nerv-utils': join(cwd, '../nerv-utils/dist/index')
    }),
    typescript({
      tsconfig: resolver('../../tsconfig.json'),
      typescript: require('typescript')
    })
  ]
}
