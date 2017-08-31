const { join } = require('path')
const { rollup } = require('rollup')

const createPlugins = require('./plugins')

const cwd = process.cwd()
const pkgJSON = require(join(cwd, 'package.json'))

module.exports = function (options) {
  const filename = `${options.name}${options.env === 'production' ? '.min' : ''}.js`
  const { version, rollup: rollupConfig = {}, dependencies = {} } = pkgJSON

  const external = Object.keys(dependencies || {}).filter(
    n => !(rollupConfig.bundledDependencies || []).includes(n)
  )
  const plugins = createPlugins(version, options)

  return rollup({
    dest: `dist/${filename}`,
    moduleName: 'Nerv',
    entry: join(cwd, 'src/index.ts'),
    external,
    onwarn (warning) {
      if (warning.code === 'MISSING_EXPORTS') {
        console.warn(warning)
      }
    },
    plugins
  })
}
