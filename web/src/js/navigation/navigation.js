import { createBrowserHistory } from 'history'
import { externalRedirect, isURLForDifferentApp } from 'js/navigation/utils'
import { getUrlParameters } from 'js/utils/utils'
import qs from 'qs'

export const browserHistory = createBrowserHistory()

/**
 * Push a browser history entry with the specified URL.
 * @param {String} path - The path or URL to navigate to
 * @param {Object} paramsObj - An object of URL parameter values
 *   to add to the search string
 * @param {Object} options
 * @param {Boolean} options.keepURLParams - If true, the new
 *   URL's search string will contain the same values as the
 *   current URL, plus any additional values provided in the
 *   paramsObj parameter.
 * @return undefined
 */
export const goTo = (path, paramsObj = {}, { keepURLParams = false } = {}) => {
  const queryString = keepURLParams
    ? qs.stringify(Object.assign({}, getUrlParameters(), paramsObj))
    : qs.stringify(paramsObj)
  if (isURLForDifferentApp(path)) {
    let externalURL = queryString ? `${path}?${queryString}` : path
    externalRedirect(externalURL)
  } else {
    browserHistory.push({
      pathname: path,
      search: queryString ? `?${queryString}` : null,
    })
  }
}

/**
 * Replace the browser history entry with the specified URL.
 * @param {String} path - The path or URL to navigate to
 * @param {Object} paramsObj - An object of URL parameter values
 *   to add to the search string
 * @param {Object} options
 * @param {Boolean} options.keepURLParams - If true, the new
 *   URL's search string will contain the same values as the
 *   current URL, plus any additional values provided in the
 *   paramsObj parameter.
 * @return undefined
 */
export const replaceUrl = (
  path,
  paramsObj = {},
  { keepURLParams = false } = {}
) => {
  const queryString = keepURLParams
    ? qs.stringify(Object.assign({}, getUrlParameters(), paramsObj))
    : qs.stringify(paramsObj)
  if (isURLForDifferentApp(path)) {
    let externalURL = queryString ? `${path}?${queryString}` : path
    externalRedirect(externalURL)
  } else {
    browserHistory.replace({
      pathname: path,
      search: queryString ? `?${queryString}` : null,
    })
  }
}

export const modifyURLParams = (paramsObj = {}) => {
  const newParamsObj = Object.assign({}, getUrlParameters(), paramsObj)
  browserHistory.push({
    pathname: window.location.pathname,
    search: qs.stringify(newParamsObj)
      ? `?${qs.stringify(newParamsObj)}`
      : null,
  })
}

export const absoluteUrl = path => {
  // If the passed path is already an absolute URL,
  // just return it.
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const protocol = process.env.REACT_APP_WEBSITE_PROTOCOL
    ? process.env.REACT_APP_WEBSITE_PROTOCOL
    : 'https'
  const baseUrl = `${protocol}://${process.env.REACT_APP_WEBSITE_DOMAIN}`
  return `${baseUrl}${path}`
}

/**
 * Build and return a URL with given URL params and other options.
 * @param {String} path - The path or URL to navigate to
 * @param {Object} paramsObj - An object of URL parameter values
 *   to add to the search string
 * @param {Object} options
 * @param {Boolean} options.keepURLParams - If true, the new
 *   URL's search string will contain the same values as the
 *   current URL, plus any additional values provided in the
 *   paramsObj parameter.
 * @param {Boolean} options.absolute - If true, we make the URL
 *   absolute.
 * @return {String} A URL
 */
export const constructUrl = (
  path,
  paramsObj = {},
  { absolute = false, keepURLParams = false } = {}
) => {
  const queryString = keepURLParams
    ? qs.stringify(Object.assign({}, getUrlParameters(), paramsObj))
    : qs.stringify(paramsObj)
  const baseUrl = absolute ? absoluteUrl(path) : path
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

// ROUTES

export const dashboardURL = '/newtab/'

// Auth routes
export const loginURL = '/newtab/auth/'
export const verifyEmailURL = '/newtab/auth/verify-email/'
export const enterUsernameURL = '/newtab/auth/username/'
export const authMessageURL = '/newtab/auth/welcome/'
export const missingEmailMessageURL = '/newtab/auth/missing-email/'

// Settings and profile
export const settingsURL = '/newtab/settings/widgets/'
export const widgetSettingsURL = '/newtab/settings/widgets/'
export const backgroundSettingsURL = '/newtab/settings/background/'
export const donateURL = '/newtab/profile/donate/'
export const statsURL = '/newtab/profile/stats/'
export const inviteFriendsURL = '/newtab/profile/invite/'
export const accountURL = '/newtab/account/'

// Search
export const searchBaseURL = '/search'

// Homepage

export const homeURL = absoluteUrl('/')
export const privacyPolicyURL = absoluteUrl('/privacy/')
export const termsOfServiceURL = absoluteUrl('/terms/')
export const contactUsURL = absoluteUrl('/contact/')
export const financialsURL = absoluteUrl('/financials/')
export const teamURL = absoluteUrl('/team/')
export const jobsURL = absoluteUrl('/jobs/')
export const adblockerWhitelistingURL = absoluteUrl('/adblockers/')
export const adblockerWhitelistingForSearchURL = absoluteUrl(
  '/adblockers/search/'
)

// External links

// Surveys
export const postUninstallSurveyURL = 'https://goo.gl/forms/XUICFx9psTwCzEIE2'
export const searchPostUninstallSurveyURL =
  'https://forms.gle/A3Xam2op2gFjoQNU6'
export const searchBetaFeedback = 'https://forms.gle/B97aCWA6A68Qfe4u5'

// Zendesk
export const externalHelpURL =
  'https://gladly.zendesk.com/hc/en-us/categories/201939608-Tab-for-a-Cause'
export const externalContactUsURL =
  'https://gladly.zendesk.com/hc/en-us/requests/new'

// Social
export const facebookPageURL = 'https://www.facebook.com/TabForACause'
export const twitterPageURL = 'https://twitter.com/TabForACause'

// Browser extension pages
export const searchFirefoxExtensionPage =
  'https://addons.mozilla.org/en-US/firefox/addon/search-for-a-cause/'
export const searchChromeExtensionPage =
  'https://chrome.google.com/webstore/detail/search-for-a-cause/eeiiknnphladbapfamiamfimnnnodife/'

// TODO: stop using these and replace the existing uses.
//   They only cause additional complication during testing.
// CONVENIENCE FUNCTIONS

export const goToHome = () => {
  goTo(dashboardURL)
}

export const goToLogin = () => {
  // Use replace by default because likely redirecting when
  // user is not authenticated.
  replaceUrl(loginURL)
}

export const goToDashboard = () => {
  goTo(dashboardURL)
}

export const goToSettings = () => {
  goTo(settingsURL)
}

export const goToDonate = () => {
  goTo(donateURL)
}

export const goToStats = () => {
  goTo(statsURL)
}

export const goToInviteFriends = () => {
  goTo(inviteFriendsURL)
}
