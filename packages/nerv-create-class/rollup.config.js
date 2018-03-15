const typescript = require('rollup-plugin-typescript2')
const resolve = require('rollup-plugin-node-resolve')
const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify')
const optimizeJs = require('optimize-js')
const babel = require('rollup-plugin-babel')
const es3 = require('rollup-plugin-es3')
const alias = require('rollup-plugin-alias')
const { join } = require('path')
const cwd = __dirname

function resolver (path) {
  return join(__dirname, path)
}

const optJSPlugin = {
  name: 'optimizeJs',
  transformBundle (code) {
    return optimizeJs(code, {
      sourceMap: false,
      sourceType: 'module'
    })
  }
}
const babelPlugin = babel({
  babelrc: false,
  presets: ['es3']
})
const uglifyPlugin = uglify({
  compress: {
    // compress options
    booleans: true,
    dead_code: true,
    drop_debugger: true,
    unused: true
  },
  ie8: true,
  parse: {
    // parse options
    html5_comments: false,
    shebang: false
  },
  sourceMap: false,
  toplevel: false,
  warnings: false
})
const baseConfig = {
  input: join(cwd, 'src/index.ts'),
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true
    },
    {
      file: join(cwd, 'dist/nerv-create-class.js'),
      format: 'umd',
      name: 'NervCreateClass',
      sourcemap: true
    }
  ],
  external: ['nervjs'],
  plugins: [
    alias({
      'nerv-shared': join(cwd, '../nerv-shared/dist/index'),
      'nerv-utils': join(cwd, '../nerv-utils/dist/index')
    }),
    resolve(),
    typescript({
      tsconfig: resolver('../../tsconfig.json'),
      typescript: require('typescript')
    }),
    buble(),
    babelPlugin,
    es3(['defineProperty', 'freeze'])
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/index.esm.js')
  })
})
const productionConfig = Object.assign({}, baseConfig, {
  output: {
    format: 'umd',
    file: join(cwd, 'dist/nerv-create-class.min.js'),
    name: 'NervCreateClass',
    sourcemap: false
  },
  plugins: baseConfig.plugins.concat([uglifyPlugin, optJSPlugin])
})

function rollup () {
  const target = process.env.TARGET

  if (target === 'umd') {
    return baseConfig
  } else if (target === 'esm') {
    return esmConfig
  } else {
    return [baseConfig, esmConfig, productionConfig]
  }
}
module.exports = rollup()
