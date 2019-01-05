
export const isAnonymousUserSignInEnabled = () => false

export const isVariousAdSizesEnabled = () => false

export const isSearchPageEnabled = () => process.env.REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED === 'true'
