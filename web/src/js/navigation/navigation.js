import createBrowserHistory from 'history/createBrowserHistory'
import { getUrlParameters } from 'js/utils/utils'
import qs from 'qs'

export const browserHistory = createBrowserHistory()

export const goTo = (location, paramsObj = {}) => {
  // TODO: if the first path is not the same, we are on a separate
  //   SPA (/newtab/ vs. /search/), so we must externalRedirect.
  //   Let's do that automatically so we can use the same navigation
  //   everywhere.
  // TODO: automatically use externalRedirect for absolute URLs to
  //   a different domain. Then, we can deprecate externalRedirect.
  browserHistory.push({
    pathname: location,
    search: qs.stringify(paramsObj) ? `?${qs.stringify(paramsObj)}` : null,
  })
}

export const replaceUrl = (location, paramsObj = {}) => {
  // TODO: if the first path is not the same, we are on a separate
  //   SPA (/newtab/ vs. /search/), so we must externalRedirect.
  //   Let's do that automatically so we can use the same navigation
  //   everywhere.
  // TODO: automatically use externalRedirect for absolute URLs to
  //   a different domain. Then, we can deprecate externalRedirect.
  browserHistory.replace({
    pathname: location,
    search: qs.stringify(paramsObj) ? `?${qs.stringify(paramsObj)}` : null,
  })
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

export const externalRedirect = externalURL => {
  window.location = externalURL
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

// Homepage

export const homeURL = absoluteUrl('/')
export const privacyPolicyURL = absoluteUrl('/privacy/')
export const termsOfServiceURL = absoluteUrl('/terms/')
export const contactUsURL = absoluteUrl('/contact/')
export const financialsURL = absoluteUrl('/financials/')
export const teamURL = absoluteUrl('/team/')
export const jobsURL = absoluteUrl('/jobs/')
export const adblockerWhitelistingURL = absoluteUrl('/adblockers/')

// External links

export const postUninstallSurveyURL = 'https://goo.gl/forms/XUICFx9psTwCzEIE2'

// Zendesk
export const externalHelpURL =
  'https://gladly.zendesk.com/hc/en-us/categories/201939608-Tab-for-a-Cause'
export const externalContactUsURL =
  'https://gladly.zendesk.com/hc/en-us/requests/new'

// Social
export const facebookPageURL = 'https://www.facebook.com/TabForACause'
export const twitterPageURL = 'https://twitter.com/TabForACause'

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
