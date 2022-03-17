/* eslint prefer-destructuring: 0 */

const querystring = require('querystring')

// Rewrites URIs from /search* to another search provider.
// Examples of Lambda@Edge functions:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-general-examples
// CloudFront event object:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request

  // Needs access to headers:
  // * Accept-Language
  // * CloudFront-Viewer-Country

  // Map our search URL onto another search provider's URL.
  const SFAC_QUERY_QS_KEY = 'q'
  const SEARCH_PROVIDER_URL = 'https://www.google.com/search'
  const SEARCH_PROVIDER_QS_KEY = 'q'
  const params = querystring.parse(request.querystring.toLowerCase())
  const searchQueryVal = params[SFAC_QUERY_QS_KEY]
  const redirectURL = searchQueryVal
    ? `${SEARCH_PROVIDER_URL}?${querystring.stringify({
        [SEARCH_PROVIDER_QS_KEY]: searchQueryVal,
      })}`
    : SEARCH_PROVIDER_URL
  const response = {
    status: '307',
    statusDescription: 'Found',
    headers: {
      location: [
        {
          key: 'Location',
          value: redirectURL,
        },
      ],
    },
  }
  callback(null, response)
}
