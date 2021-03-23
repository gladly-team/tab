/* eslint prefer-destructuring: 0 */

const path = require('path')

// This function rewrites all CloudFront HTML requests
// to return the origin's /newtab/index.html item.
// Examples of Lambda@Edge functions:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-general-examples
// CloudFront event object:
// https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-cloudfront
exports.handler = (event, context, callback) => {
  // If the cookie "tabV4OptIn" is set, change the origin to
  // the Tab V4 origin hosted on Vercel.
  // https://aws.amazon.com/blogs/networking-and-content-delivery/dynamically-route-viewer-requests-to-any-origin-using-lambdaedge/
  // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-content-based-custom-origin-request-trigger
  let isTabV4OptIn = false
  const request = event.Records[0].cf.request
  const headers = request.headers
  if (headers.cookie) {
    const cookieName = 'tabV4OptIn'
    const enabledVal = 'enabled'
    for (let i = 0; i < headers.cookie.length; i += 1) {
      if (headers.cookie[i].value.indexOf(`${cookieName}=${enabledVal}`) >= 0) {
        isTabV4OptIn = true
        break
      }
    }
  }

  // If visiting an auth page, always use the legacy Tab app
  // until the auth functionality is complete.
  const isAuthPage = request.uri.startsWith('/newtab/auth')

  if (isTabV4OptIn && !isAuthPage) {
    const tabV4Host = process.env.LAMBDA_TAB_V4_HOST
    if (!tabV4Host) {
      throw new Error('The LAMBDA_TAB_V4_HOST env variable must be set.')
    }
    request.origin = {
      custom: {
        domainName: tabV4Host,
        port: 443,
        protocol: 'https',
        path: '',
        sslProtocols: ['TLSv1', 'TLSv1.1'],
        readTimeout: 10,
        keepaliveTimeout: 10,
        customHeaders: {},
      },
    }
    request.headers.host = [{ key: 'host', value: tabV4Host }]
  } else if (!path.extname(request.uri)) {
    request.uri = '/newtab/index.html'
  }
  callback(null, request)
}
