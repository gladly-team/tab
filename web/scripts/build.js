var path = require('path')
const spawnSync = require('child_process').spawnSync

// Load environment variables from .env file.
require('dotenv-extended').load({
  path: path.join(__dirname, '..', '.env.local'),
  defaults: path.join(__dirname, '..', '.env'),
})

// So we can use module imports relative to the src
// directory.
process.env.NODE_PATH = 'src/'

const argv = require('minimist')(process.argv.slice(2))
const appName = argv.app
var buildSubdirectory
switch (argv.app) {
  case 'newtab':
    process.env.REACT_APP_WHICH_APP = 'newtab'
    process.env.PUBLIC_URL = process.env.DEPLOYMENT_WEB_APP_PUBLIC_URL
    buildSubdirectory = 'newtab'
    break
  case 'search':
    process.env.REACT_APP_WHICH_APP = 'search'
    process.env.PUBLIC_URL = process.env.DEPLOYMENT_SEARCH_APP_PUBLIC_URL
    buildSubdirectory = 'search'
    break
  default:
    throw new Error(
      `Expected --app command line argument to equal "newtab" or "search".`
    )
}

console.log(
  `Building "${appName}" with PUBLIC_URL=${process.env.PUBLIC_URL}...`
)

// Build the app with react-scripts.
const result = spawnSync('react-scripts', ['build'], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'pipe',
  encoding: 'utf-8',
})
const stdout = result.stdout ? result.stdout.toString() : ''
const sterr = result.stderr ? result.stderr.toString() : ''
if (stdout) {
  console.log(stdout)
}
if (sterr) {
  console.log(sterr)
}

// Move built code into a subdirectory so that local servers
// can use the expected public path.
spawnSync('mv', ['build', 'build-temp'])
spawnSync('mkdir', ['build'])
spawnSync('mv', ['build-temp', 'build'])
spawnSync('mv', ['build/build-temp', `build/${buildSubdirectory}`])

// For the search app, un react-snap to prerender HTML.
if (appName === 'search') {
  console.log(`Running react-snap to prerender HTML...`)
  spawnSync('react-snap')
}

console.log(`Finished building "${appName}".`)
console.log('You can serve the app locally by running `yarn run serve`.')
