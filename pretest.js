const fs = require('fs')
const path = require('path')
const rm = require('rimraf')

const karmaSocketIO = path.join(__dirname, 'node_modules', 'karma', 'node_modules', 'socket.io')

try {
  const version = JSON.parse(fs.readFileSync(path.join(karmaSocketIO, 'package.json'))).version
  if (parseInt(version, 10) < 2) {
    rm(karmaSocketIO, () => {
      fs.renameSync(path.join(__dirname, 'node_modules', 'socket.io'), karmaSocketIO)
    })
  }
} catch (e) {
  console.log(e)
  throw new Error('pretest error...')
}
