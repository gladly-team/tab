// Turn on a global notification. Set this to `true` to show
// the message in NotificationComponent to all users.
export const showGlobalNotification = () => true

export const isAnonymousUserSignInEnabled = () => false

export const isVariousAdSizesEnabled = () => false

export const isSearchPageEnabled = () =>
  process.env.REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED === 'true'

export const shouldRedirectSearchToThirdParty = () =>
  process.env.REACT_APP_FEATURE_FLAG_REDIRECT_SEARCH_TO_THIRD_PARTY === 'true'

export const showBingJSAds = () =>
  process.env.REACT_APP_FEATURE_FLAG_BING_JS_ADS === 'true'

export const isBingJSAdsProductionMode = () =>
  process.env.REACT_APP_FEATURE_FLAG_BING_JS_ADS_PRODUCTION_MODE === 'true'

export const showSearchIntroductionMessage = () => false

// Note: disabled until we resolve the cross-domain problems
// for the consent data cookies with unset SameSite values.
// The CMP fails to store cookies on the new tab page in Chrome,
// because Chrome now requires the SameSite value to be set for
// third-party cookies, and the new tab page is a different
// domain.
export const requestEUAdPersonalization = () => false
