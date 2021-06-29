/* eslint prefer-destructuring: 0 */

const querystring = require('querystring')

// Rewrites URIs from /search* to another search provider.
// Examples of Lambda@Edge functions:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-general-examples
// CloudFront event object:
// https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-cloudfront
exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request

  // Map our search URL onto another search provider's URL.
  const SFAC_QUERY_QS_KEY = 'q'
  const SEARCH_PROVIDER_DOMAIN = 'google.com'
  const SEARCH_PROVIDER_QS_KEY = 'q'
  const params = querystring.parse(request.querystring.toLowerCase())
  const newQuerystringVals = {
    ...(params[SFAC_QUERY_QS_KEY] && {
      [SEARCH_PROVIDER_QS_KEY]: params[SFAC_QUERY_QS_KEY],
    }),
  }
  request.origin = {
    custom: {
      domainName: SEARCH_PROVIDER_DOMAIN,
      port: 443,
      protocol: 'https',
      path: '',
      sslProtocols: ['TLSv1', 'TLSv1.1'],
      readTimeout: 10,
      keepaliveTimeout: 10,
      customHeaders: {},
    },
  }
  request.querystring = querystring.stringify(newQuerystringVals)
  callback(null, request)
}
