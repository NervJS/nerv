const dts = require('dts-bundle')
const { join } = require('path')

const cwd = process.cwd()
const pkgJSON = require(join(cwd, 'package.json'))

if (pkgJSON.name === 'nerv-redux') {
  return
}

try {
  const name = pkgJSON.name === 'nervjs' ? 'nerv' : pkgJSON.name
  dts.bundle({
    main: join(__dirname, 'lib', 'packages', name, 'src/index.d.ts'),
    name: pkgJSON.name,
    out: join(cwd, 'dist/index.d.ts')
  })
  console.log(`${pkgJSON.name} in typings is DONE`)
} catch (e) {
  throw Error(e)
}
