// Used in CloudFront origin request for `/search*` URI
// (but not `/search/api*`).
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

  // Get the deploy stage (ex: prod, dev, or test). We set the custom
  // header value on the CloudFront distribution as a workaround to not
  // having access to environment variables in Lambda@Edge. See:
  // https://stackoverflow.com/a/58101487/1332513
  const stage = get(
    request,
    'origin.custom.customHeaders["x-tab-stage"][0].value'
  )

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
    const yahooBaseURL = searchURLByRegion(countryHeader, acceptLanguageHeader)

    // Set the "type" parameter, a string used for reporting.
    // We use unreserved characters for report readability/usability, and
    // Yahoo does not allow using hyphens.
    //   e.g.: type=src_tab.c_CA6A5C2uj.r_482
    try {
      const searchSrc = params.get('src') || 'none'
      const causeId = params.get('c') || 'none'
      const referralId = params.get('r') || 'none'
      const typeParamVal = `src_${searchSrc}.c_${causeId}.r_${referralId}`
      const url = new URL(yahooBaseURL)
      url.searchParams.set('type', typeParamVal)
      searchBaseURL = url.href
    } catch (e) {
      // We may eventually want to log externally.
      // eslint-disable-next-line no-console
      console.error(e)
      searchBaseURL = yahooBaseURL
    }
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
      'X-Tab-Debug-Stage': {
        key: 'X-Tab-Debug-Stage',
        value: stage,
      },
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
