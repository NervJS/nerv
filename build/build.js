const { mkdir } = require('fs')
const { join } = require('path')

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
      name: pkgJSON.name,
      optimize: true,
      replace: true,
      uglify: true,
      version: pkgJSON.version
    }
  })

  const createRollup = require('./rollup')
  // const createBundle = require('./bundle')

  const rollup = createRollup(options)
  // const bundle = createBundle(options)

  async function build () {
    try {
      const bundle = await rollup
      const filename = `${options.name}${options.env === 'production' ? '.min' : ''}.js`
      const dest = join(cwd, 'dist', filename)
      const { format } = options
      await bundle.write({
        dest,
        format,
        moduleName: 'Nerv'
      })
    } catch (err) {
      console.log(err)
    }
  }
  build()

  // rollup
  //   // .catch(err => console.log(err))
  //   // .then(bundle)
  //   .then(() => {
  //     console.log(`${pkgJSON.name} in ${options.format} is DONE`)
  //   })
  //   .catch(error => {
  //     console.warn(error)
  //     console.error(
  //       `${pkgJSON.name} in ${options.format} is FAILED ${error.message}`
  //     )
  //     exit(-1)
  //   })
})
