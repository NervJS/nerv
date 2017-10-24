import fs from 'fs'
import alias from 'rollup-plugin-alias'
import memory from 'rollup-plugin-memory'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import es3 from 'rollup-plugin-es3'
import { join } from 'path'
const babelRc = JSON.parse(fs.readFileSync('.babelrc'))
const pkg = JSON.parse(fs.readFileSync('./package.json'))

const format = process.env.TARGET === 'es' ? 'es' : 'umd'

const umd = {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    name: 'NervRedux',
    format: 'umd',
    file: pkg.main
  },
  exports: 'default',
  external: ['nervjs', 'redux'],
  useStrict: false,
  globals: {
    nervjs: 'Nerv',
    redux: 'Redux'
  },
  plugins: [
    format === 'umd' &&
      memory({
        path: 'src/index.js',
        contents: "export { default } from './index';"
      }),
    {
      // This insane thing transforms Lodash CommonJS modules to ESModules. Doing so shaves 500b (20%) off the library size.
      load: function (id) {
        if (id.match(/\blodash\b/)) {
          return fs
            .readFileSync(id, 'utf8')
            .replace(
              /\b(?:var\s+)?([\w$]+)\s*=\s*require\((['"])(.*?)\2\)\s*[,;]/g,
              'import $1 from $2$3$2;'
            )
            .replace(/\bmodule\.exports\s*=\s*/, 'export default ')
        }
      }
    },
    alias({
      'react-redux': 'node_modules/react-redux/src/index.js',
      react: join(__dirname, '/src/compat.js'),
      invariant: join(__dirname, '/src/invariant.js'),
      'prop-types': join(__dirname, '/src/invariant.js')
    }),
    babel({
      babelrc: false,
      presets: [
        [
          'es2015',
          {
            loose: true,
            modules: false
          }
        ]
      ].concat(babelRc.presets.slice(1)),
      plugins: babelRc.plugins
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: false
    }),
    commonjs({
      include: ['node_modules/**'],
      exclude: ['node_modules/react-redux/**']
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    es3()
  ].filter(Boolean)
}

const esm = Object.assign({}, umd)

esm.output.format = 'es'
esm.output.file = pkg.modules

export default [umd, esm]
