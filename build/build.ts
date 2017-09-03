// tslint:disable:no-var-requires
const typescript = require('rollup-plugin-typescript2')
const resolve = require('rollup-plugin-node-resolve')
const bublePlugin = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify')
const optimizeJs = require('optimize-js')

const optJSPlugin = {
  name: 'optimizeJs',

  transformBundle (code) {
    return optimizeJs(code, {
      sourceMap: false,
      sourceType: 'module'
    })
  }
}

const uglifyPlugin = uglify({
  compress: {
    // compress options
    booleans: true,
    dead_code: true,
    drop_debugger: true,
    unused: true
  },
  ie8: false,
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
  input: 'src/index.ts',
  output: {
    file: 'dist/nerv.js',
    format: 'umd',
    name: 'Nerv',
    sourcemap: true
  },
  plugins: [
    resolve(),
    typescript({
      include: 'src/**',
      typescript: require('typescript')
    }),
    bublePlugin()
  ]
}

const esmConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    format: 'es',
    file: 'dist/nerv.esm.js'
  }
}

const productionConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    file: 'dist/nerv.min.js',
    sourcemap: false
  },
  plugins: baseConfig.plugins.concat([
    uglifyPlugin,
    optJSPlugin
  ])
}

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

export default rollup()
