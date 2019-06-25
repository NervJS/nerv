const typescript = require('rollup-plugin-typescript2')
const pkg = require('./package.json')
const alias = require('rollup-plugin-alias')
const { join } = require('path')
const cwd = __dirname
function resolver (path) {
  return join(__dirname, path)
}
module.exports = {
  input: 'src/index.ts',
  external: ['nervjs'],
  plugins: [
    alias({
      'nerv-shared': join(cwd, '../nerv-shared/dist/index'),
      'nerv-utils': join(cwd, '../nerv-utils/dist/index'),
      nervjs: join(cwd, '../nerv/dist/index.esm')
    }),
    typescript({
      tsconfig: resolver('../../tsconfig.json')
    })
  ],
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
