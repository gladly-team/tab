
export const isAnonymousUserSignInEnabled = () => false

export const isVariousAdSizesEnabled = () => false

// @experiment-third-ad
export const isThirdAdEnabled = () => true

export const isSearchPageEnabled = () => process.env.FEATURE_FLAG_SEARCH_PAGE_ENABLED === 'true'
