// Turn on a global notification. Set this to `true` to show
// the message in NotificationComponent to all users.
export const showGlobalNotification = () => true

export const isAnonymousUserSignInEnabled = () => false

export const isVariousAdSizesEnabled = () => false

export const isSearchPageEnabled = () =>
  process.env.REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED === 'true'
