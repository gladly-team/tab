// Turn on a global notification. Set this to `true` to show
// the message in NotificationComponent to all users.
export const showGlobalNotification = () => false

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
