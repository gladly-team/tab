
// @experiment-anon-sign-in
export const isAnonymousUserSignInEnabled = () => {
  return process.env.FEATURE_FLAG_ANON_USER_SIGN_IN
    ? process.env.FEATURE_FLAG_ANON_USER_SIGN_IN === 'true'
    : false
}

// @experiment-various-ad-sizes
export const isVariousAdSizesEnabled = () => false

// @experiment-third-ad
export const isThirdAdEnabled = () => true
