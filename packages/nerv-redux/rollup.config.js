import fs from 'fs'
import alias from 'rollup-plugin-alias'
import memory from 'rollup-plugin-memory'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import es3 from 'rollup-plugin-es3'
import { join } from 'path'

function resolver (path) {
  return join(__dirname, path)
}

const babelrc = JSON.parse(fs.readFileSync('../../.babelrc'))

const modules = {
  input: resolver('src/index.js'),
  output: [
    {
      sourcemap: true,
      name: 'NervRedux',
      format: 'es',
      file: resolver('dist/index.esm.js')
    },
    {
      sourcemap: true,
      format: 'cjs',
      file: resolver('dist/index.js')
    }
  ],
  exports: 'default',
  external: ['nervjs', 'redux'],
  useStrict: false,
  globals: {
    nervjs: 'Nerv',
    redux: 'Redux'
  },
  plugins: [
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
      'react-redux': join(__dirname, 'node_modules/react-redux/es/index.js'),
      react: 'nervjs',
      'react-dom': 'nervjs',
      invariant: join(__dirname, '/src/invariant.js'),
      'prop-types': join(__dirname, '/src/prop-types.js'),
      'react-is': join(process.cwd(), '../nerv-is/dist/index')
    }),
    babel({
      babelrc: false,
      presets: [
        [
          'env',
          {
            // spec: true,
            modules: false,
            useBuiltIns: false,
            loose: true
          }
        ],
        ['stage-0']
      ],
      plugins: babelrc.plugins.concat(['external-helpers'])
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
  ]
}

const umd = Object.assign({}, modules)

umd.output = {
  format: 'umd',
  sourcemap: true,
  file: resolver('dist/nerv-redux.js'),
  name: 'NervRedux'
}
umd.plugins = [
  memory({
    path: 'src/index.js',
    contents: "export { default } from './index';"
  })
].concat(modules.plugins)

export default [modules, umd]
