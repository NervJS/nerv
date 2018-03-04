const prompts = require('prompts')
const cp = require('child_process')

async function f () {
  const response = await prompts({
    type: 'select',
    name: 'version',
    message: `What's the release version?`,
    choices: [
      { title: 'auto (by semver version)', value: 'auto' },
      { title: 'beta', value: 'beta' },
      { title: 'manual', value: 'manual' }
    ],
    initial: 1
  })

  const { version } = response
  const command = 'npm run build && lerna publish --exact --conventional-commits'
  switch (version) {
    case 'auto':
      cp.execSync(command)
      break
    case 'beta':
      cp.execSync(command + '--cd-version=prepatch --preid=beta --npm-tag=beta')
      break
    case 'manual':
      const manual = await prompts({
        type: 'text',
        name: 'version',
        message: `What's the EXACT version that you want to publish?`
      })
      cp.execFileSync(`${command} --repo-version ${manual.version}`)
      break
    default:
      break
  }
}

f()
