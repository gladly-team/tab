import AWS from 'aws-sdk'
import config from '../config'

// Explicitly configure S3 client to avoid inheriting incorrect endpoints
// from global AWS config (e.g., DYNAMODB_ENDPOINT).
const s3 = new AWS.S3({
  region: config.AWS_REGION || 'us-west-2',
  signatureVersion: 'v4',
  endpoint: `https://s3.${config.AWS_REGION || 'us-west-2'}.amazonaws.com`,
  s3ForcePathStyle: false,
})

/**
 * Generates a presigned URL for accessing an object in the private S3 bucket.
 * The URL expires after 15 minutes (900 seconds).
 * @param {string} key - The S3 object key (path within the bucket).
 * @returns {string} A presigned URL that grants temporary access to the object.
 */
const getPrivateBackgroundSignedUrl = (key) => {
  const bucket = `gladly-private-${config.STAGE}`
  const expiresInSeconds = 900 // 15 minutes

  return s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: key,
    Expires: expiresInSeconds,
  })
}

/**
 * Constructs the public URL for a photo in the public backgrounds bucket.
 * @param {string} photoFilename - The filename of the photo (e.g., "abc123.jpg").
 * @returns {string} The full public URL to the background image.
 */
const getPublicBackgroundUrl = (photoFilename) => {
  return `https://prod-tab2017-media.gladly.io/img/backgrounds/${photoFilename}`
}

export { getPrivateBackgroundSignedUrl, getPublicBackgroundUrl }
