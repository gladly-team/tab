var path = require('path')
const spawnSync = require('child_process').spawnSync

// Load environment variables from .env file.
require('dotenv-extended').load({
  path: path.join(__dirname, '..', '.env.local'),
  defaults: path.join(__dirname, '..', '.env'),
})

const argv = require('minimist')(process.argv.slice(2))
var s3Destination

// TODO: set the subdirectory of the build
switch (argv.app) {
  case 'newtab':
    s3Destination = `s3://${
      process.env.DEPLOYMENT_WEB_APP_S3_BUCKET_NAME
    }${process.env.DEPLOYMENT_WEB_APP_S3_BUCKET_PATH || ''}/`
    break
  case 'search':
    s3Destination = `s3://${
      process.env.DEPLOYMENT_SEARCH_APP_S3_BUCKET_NAME
    }${process.env.TEST_DEPLOYMENT_SEARCH_APP_S3_BUCKET_PATH || ''}/`
    break
  default:
    throw new Error(
      'Expected --app command line argument to equal "newtab" or "search".'
    )
}
console.log(`Deploying "${argv.app}" app to ${s3Destination}`)

// Sync everything except the static folder.
function syncNonStaticFiles() {
  const args = [
    's3',
    'sync',
    'build/',
    s3Destination,
    '--include',
    '*',
    '--exclude',
    'static/*',
    '--cache-control',
    'no-cache',
    '--metadata-directive',
    'REPLACE',
  ]
  const result = spawnSync('aws', args)
  const stdout = result.stdout ? result.stdout.toString() : ''
  const sterr = result.stderr ? result.stderr.toString() : ''
  if (stdout) {
    console.log(stdout)
  }
  if (sterr) {
    console.log(sterr)
  }
  if (!sterr) {
    console.log('Successfully synced HTML files to the S3 bucket')
  }
}

// Sync everything in the static folder.
function syncStaticFiles() {
  const STATIC_FILES_CACHE_CONTROL_SECONDS = 60 * 60 * 24 * 365
  const args = [
    's3',
    'sync',
    'build/',
    s3Destination,
    '--include',
    'static/*',
    '--cache-control',
    `max-age=${STATIC_FILES_CACHE_CONTROL_SECONDS}`,
    '--metadata-directive',
    'REPLACE',
  ]
  const result = spawnSync('aws', args)
  const stdout = result.stdout ? result.stdout.toString() : ''
  const sterr = result.stderr ? result.stderr.toString() : ''
  if (stdout) {
    console.log(stdout)
  }
  if (sterr) {
    console.log(sterr)
  }
  if (!sterr) {
    console.log('Successfully synced all non-HTML files to the S3 bucket')
  }
}

function syncDirectory() {
  syncNonStaticFiles()
  syncStaticFiles()
}

// syncs the `build` directory to the provided bucket.
// https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html
syncDirectory()
