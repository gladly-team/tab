
export const isAnonymousUserSignInEnabled = () => false

export const isVariousAdSizesEnabled = () => false

export const isSearchPageEnabled = () => process.env.FEATURE_FLAG_SEARCH_PAGE_ENABLED === 'true'
