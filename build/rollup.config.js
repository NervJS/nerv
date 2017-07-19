import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import fs from 'fs'

const babelConfig = JSON.parse(String(fs.readFileSync('.babelrc')))
babelConfig.plugins.push('external-helpers')

export default {
  moduleName: 'Nerv',
  entry: 'src/index.js',
  format: 'iife',
  plugins: [
    resolve({
      main: true
    }),
    babel({
      sourceMap: true,
      babelrc: false,
      presets: [
        ['es2015', {
          modules: false,
          loose: true
        }],
        'stage-0'
      ],
      plugins: babelConfig.plugins,
      exclude: 'node_modules/**'
    })
  ],
  dest: 'dist/nerv.js'
}
