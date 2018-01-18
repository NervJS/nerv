const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const isCI = require('is-ci')

const karmaPath = path.join(__dirname, 'node_modules', 'karma')

function upgradeKarma () {
  if (!isCI) {
    return
  }
  console.log(`you are using socket.io version under 2.x, upgrading now...`)
  cp.execSync('npm install socket.io@2.0.3', {
    cwd: karmaPath
  })
}

try {
  const { version } = JSON.parse(
    fs.readFileSync(
      path.join(karmaPath, 'node_modules', 'socket.io', 'package.json')
    )
  )
  if (parseInt(version, 10) < 2) {
    upgradeKarma()
  }
} catch (e) {
  upgradeKarma()
}
Not sure what i am doing
