// Used in CloudFront origin request for `/search*` URI
// (but not `/search/api*`).
/* eslint prefer-destructuring: 0 */

import { get } from 'lodash/object'
import { parse } from 'cookie'
import searchURLByRegion from './searchURLByRegion'

const { PublishCommand, SNSClient } = require('@aws-sdk/client-sns')

const PRODUCTION_STAGE = 'prod'

const decodeBase64 = string => {
  return Buffer.from(string, 'base64').toString('utf8')
}

const getCookieVal = rawString => {
  if (rawString) {
    try {
      // Auth library `next-firebase-auth` stringifies twice.
      const cookieVal = JSON.parse(JSON.parse(decodeBase64(rawString)))
      return cookieVal
      // Expect that cookie values could be manipulated or malformed.
      // eslint-disable-next-line no-empty
    } catch (e) {
      // console.error(e)
      console.error('===== DEBUG: error', e)
    }
  }

  return null
}

// Get the user's ID token from their auth cookie, if set. This is dependant
// on the behavior of `next-firebase-auth`:
// https://github.com/gladly-team/next-firebase-auth/blob/63563ad2913c402802bacb204cb9920d9df260ed/src/cookies.js
// If `next-firebase-auth` supports a function to get user data from
// cookies, we should use it:
// https://github.com/gladly-team/next-firebase-auth/issues/223
const getIdTokensFromCookies = (cookiesStr = '') => {
  const cookies = parse(cookiesStr)
  console.log(cookies)

  const authCookieName = 'TabAuth.AuthUserTokens'
  const authCookieSigName = 'TabAuth.AuthUserTokens.sig'

  const authCookieVal = cookies[authCookieName] || null
  const authCookieSigVal = cookies[authCookieSigName] || null

  return {
    authUserTokens: getCookieVal(authCookieVal),
    authUserTokensSig: getCookieVal(authCookieSigVal),
  }
}

const publishToSNS = async ({ stage, messageData }) => {
  // Get the SNS topic ARN. Example:
  //   "arn:aws:sns:eu-west-3:167811431063:dev-SearchRequest"
  const awsRegion = process.env.AWS_REGION
  const awsAccountId = '167811431063'
  const snsTopicName = 'SearchRequest'
  const snsTopicNamePrefix = stage === PRODUCTION_STAGE ? '' : 'dev-'
  const snsTopicARN = `arn:aws:sns:${awsRegion}:${awsAccountId}:${snsTopicNamePrefix}${snsTopicName}`

  // Publish.
  const message = JSON.stringify(messageData)
  const sns = new SNSClient()
  const params = {
    Message: message,
    TopicArn: snsTopicARN,
  }
  await sns.send(new PublishCommand(params))
}

// Rewrites URIs from /search* to another search provider.
// Examples of Lambda@Edge functions:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-general-examples
// CloudFront event object:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
exports.handler = async event => {
  const request = get(event, 'Records[0].cf.request')
  const SFAC_QUERY_QS_KEY = 'q'
  const params = new URLSearchParams(request.querystring)
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
  let searchSrc = null
  let causeId = null

  // Get the function "version" from the endpoint, which we use to QA new
  // functionality in production prior to rolling it out to users.
  const uri = get(event, 'Records[0].cf.request.uri', '')
  const defaultVersion = 3 // Bump this to "roll out" a new version
  let version
  if (uri.startsWith('/search/v1')) {
    version = 1
  } else if (uri.startsWith('/search/v2')) {
    version = 2
  } else if (uri.startsWith('/search/v3')) {
    version = 3
  } else {
    version = defaultVersion
  }

  if (version === 1) {
    // For v1, use Google for search results.
    searchProviderQueryKey = 'q'
    searchBaseURL = 'https://www.google.com/search'
  }
  const headers = get(request, 'headers', {})

  if (version >= 2) {
    // For v2, use Yahoo for search results.
    searchProviderQueryKey = 'p'

    // Yahoo localization needs access to headers:
    // * Accept-Language
    // * CloudFront-Viewer-Country
    const countryHeader = get(headers, 'cloudfront-viewer-country[0].value')
    const acceptLanguageHeader = get(headers, 'accept-language[0].value')
    const yahooBaseURL = searchURLByRegion(countryHeader, acceptLanguageHeader)

    // Set the "type" parameter, a string used for reporting.
    // We use unreserved characters for report readability/usability, and
    // Yahoo does not allow using hyphens.
    //   e.g.: type=src_tab.c_CA6A5C2uj.r_482
    try {
      searchSrc = params.get('src') || null
      causeId = params.get('c') || null
      const referralId = params.get('r') || null
      const NONE = 'none'
      const typeParamVal = `src_${searchSrc || NONE}.c_${causeId ||
        NONE}.r_${referralId || NONE}`
      const url = new URL(yahooBaseURL)
      url.searchParams.set('type', typeParamVal)
      searchBaseURL = url.href
    } catch (e) {
      // We may eventually want to log externally.
      // eslint-disable-next-line no-console
      console.error(e)
      searchBaseURL = yahooBaseURL
    }
  }

  // Construct the final search URL with the search query.
  const baseURL = new URL(searchBaseURL)
  if (searchQueryVal) {
    baseURL.searchParams.set(searchProviderQueryKey, searchQueryVal)
  }
  const redirectURL = baseURL.href

  // Publish the search request event to SNS.
  if (version >= 3) {
    try {
      const cookiesStr = get(headers, 'cookie[0].value', '')
      const idTokens = getIdTokensFromCookies(cookiesStr)
      const searchEngine = 'SearchForACause' // TODO: get from URL param later
      const messageData = {
        user: {
          // FIXME: This isn't a functional approach, because the ID token
          //   will often be expired. We need to make our authorizer
          //   function smarter and move some this cookie logic into it.
          ...idTokens,
        },
        data: {
          src: searchSrc,
          engine: searchEngine,
          causeId,
        },
      }
      await publishToSNS({ stage, messageData })
    } catch (e) {
      // TODO: add Sentry error logging.
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

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
  return response
}
