const { mkdir } = require('fs')
const { join } = require('path')
const createRollup = require('./rollup')

const cwd = process.cwd()
const pkgJSON = require(join(cwd, 'package.json'))

mkdir(join(cwd, 'dist'), err => {
  if (err && err.code !== 'EEXIST') {
    throw Error(err)
  }

  const options = require('minimist')(process.argv.slice(2), {
    boolean: ['replace', 'optimize', 'uglify'],
    default: {
      env: 'development',
      format: 'umd',
      name: 'nerv',
      optimize: true,
      replace: true,
      uglify: true,
      version: pkgJSON.version
    }
  })

  const rollup = createRollup(options)

  async function build () {
    try {
      const bundle = await rollup
      const isProduction = options.env === 'production'
      const filename = `${options.name}${isProduction ? '.min' : ''}.js`
      const dest = join(cwd, 'dist', filename)
      const { format } = options
      await bundle.write({
        dest,
        format,
        sourceMap: false,
        // FIX: sourceMap not working
        // sourceMap: isProduction || format === 'es'
        //   ? false
        //   : 'inline',
        moduleName: 'Nerv'
      })
    } catch (err) {
      console.log(err)
    }
  }
  build()
})
