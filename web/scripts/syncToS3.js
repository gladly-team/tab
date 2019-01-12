
var path = require('path')
const spawnSync = require('child_process').spawnSync

// Load environment variables from .env file.
require('dotenv-extended').load({
  path: path.join(__dirname, '..', '.env.local'),
  defaults: path.join(__dirname, '..', '.env')
})

const s3Bucket = process.env.DEPLOYMENT_WEB_APP_S3_BUCKET_NAME
const s3BucketPath = process.env.DEPLOYMENT_WEB_APP_S3_BUCKET_PATH || ''

// Sync *.html files.
function syncHTML () {
  const args = [
    's3',
    'sync',
    'build/',
    `s3://${s3Bucket}${s3BucketPath}/`,
    '--exclude',
    '*',
    '--include',
    '*.html',
    '--cache-control',
    'no-cache',
    '--metadata-directive',
    'REPLACE'
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

// Sync everything except *.html files.
function syncStaticFiles () {
  const STATIC_FILES_CACHE_CONTROL_SECONDS = 60 * 60 * 24 * 365
  const args = [
    's3',
    'sync',
    'build/',
    `s3://${s3Bucket}${s3BucketPath}/`,
    '--include',
    '*',
    '--exclude',
    '*.html',
    '--cache-control',
    `max-age=${STATIC_FILES_CACHE_CONTROL_SECONDS}`,
    '--metadata-directive',
    'REPLACE'
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

function syncDirectory () {
  syncHTML()
  syncStaticFiles()
}

// syncs the `build` directory to the provided bucket.
// https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html
syncDirectory()
