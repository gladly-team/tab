/* eslint prefer-destructuring: 0 */

const path = require('path')

// This function rewrites all CloudFront HTML requests
// to return the origin's /newtab/index.html item.
// Examples of Lambda@Edge functions:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-general-examples
// CloudFront event object:
// https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-cloudfront
exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request
  if (!path.extname(request.uri)) {
    request.uri = '/newtab/index.html'
  }
  callback(null, request)
}
