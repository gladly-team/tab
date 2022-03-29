/* eslint prefer-destructuring: 0 */

import { get } from 'lodash/object'
import searchURLByRegion from './searchURLByRegion'

// Rewrites URIs from /search* to another search provider.
// Examples of Lambda@Edge functions:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-general-examples
// CloudFront event object:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
exports.handler = (event, context, callback) => {
  const request = get(event, 'Records[0].cf.request')
  const SFAC_QUERY_QS_KEY = 'q'
  const params = new URLSearchParams(request.querystring.toLowerCase())
  const searchQueryVal = params.get(SFAC_QUERY_QS_KEY)

  // Get the redirect destination URL.
  let searchBaseURL
  let searchProviderQueryKey
  if (get(event, 'Records[0].cf.request.uri', '').startsWith('/search/v2')) {
    // For v2, use Yahoo for search results.
    searchProviderQueryKey = 'p'

    // Yahoo localization needs access to headers:
    // * Accept-Language
    // * CloudFront-Viewer-Country
    const headers = get(request, 'headers', {})
    const countryHeader = get(headers, 'cloudfront-viewer-country[0].value')
    const acceptLanguageHeader = get(headers, 'accept-language[0].value')
    searchBaseURL = searchURLByRegion(countryHeader, acceptLanguageHeader)
  } else {
    // For v1, use Google for search results.
    searchProviderQueryKey = 'q'
    searchBaseURL = 'https://www.google.com/search'
  }

  // Construct the final search URL with the search query.
  const baseURL = new URL(searchBaseURL)
  if (searchQueryVal) {
    baseURL.searchParams.set(searchProviderQueryKey, searchQueryVal)
  }
  const redirectURL = baseURL.href

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
