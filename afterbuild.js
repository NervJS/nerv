const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const karmaPath = path.join(__dirname, 'node_modules', 'karma')

try {
  const { version } = JSON.parse(
    fs.readFileSync(
      path.join(karmaPath, 'node_modules', 'socket.io', 'package.json')
    )
  )
  if (parseInt(version, 10) < 2) {
    console.log(`you are using karma version under 2.x, upgrading now...`)
    cp.execSync('npm install socket.io@2.0.3', {
      cwd: karmaPath
    })
  }
} catch (e) {}
