const bublePlugin = require('rollup-plugin-buble')
const tsPlugin = require('rollup-plugin-typescript2')
const uglify = require('rollup-plugin-uglify')
const optimizeJs = require('optimize-js')

const optJSPlugin = {
  name: 'optimizeJs',

  transformBundle: function (code) {
    return optimizeJs(code, {
      sourceMap: false,
      sourceType: 'module'
    })
  }
}

module.exports = function (version, options) {
  const plugins = [
    tsPlugin({
      abortOnError: true,
      check: true,
      clean: true,
      exclude: ['*.spec*', '**/*.spec*']
    }),
    bublePlugin()
  ]

  if (options.uglify) {
    plugins.push(
      uglify({
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
    )
  }

  if (options.optimize) {
    plugins.push(optJSPlugin)
  }

  return plugins
}
