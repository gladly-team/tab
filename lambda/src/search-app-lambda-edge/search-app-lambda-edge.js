/* eslint prefer-destructuring: 0 */

const path = require('path')

// This function rewrites all CloudFront HTML requests
// to return the origin's /search/index.html item.
// Examples of Lambda@Edge functions:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-general-examples
// CloudFront event object:
// https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-cloudfront
exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request
  if (!path.extname(request.uri)) {
    // Only return a prerendered page for the search page.
    // In the future, we may want to change this to pre-render
    // additional pages.
    if (request.uri.match('^/search/?(?!.*/)')) {
      request.uri = '/search/index.html'
    } else {
      request.uri = '/search/200.html'
    }
  }
  callback(null, request)
}
