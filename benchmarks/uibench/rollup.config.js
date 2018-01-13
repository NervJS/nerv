const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify')
const path = require('path')
const cjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const alias = require('rollup-plugin-alias')
const babel = require('rollup-plugin-babel')

module.exports = {
  dest: path.join(__dirname, 'build.js'),
  input: path.join(__dirname, 'app.js'),
  format: 'iife',
  name: 'Nerv',
  plugins: [
    alias({
      nervjs: path.join(
        __dirname,
        '..',
        '..',
        './packages',
        'nerv',
        'dist',
        'index.esm.js'
      )
    }),
    resolve(),
    cjs(),
    buble(),
    uglify()
  ],
  sourceMap: false,
  browser: true
}
