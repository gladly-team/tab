import fbq from 'js/analytics/facebook-analytics'
import rdt from 'js/analytics/reddit-analytics'
import gtag from 'js/analytics/google-analytics'
import logger from 'js/utils/logger'

// We automatically track most pageviews on location change.
// See ./withPageviewTracking higher-order component.
export const pageview = () => {
  fbq('track', 'PageView')
}

export const homepageView = () => {
  fbq('track', 'ViewContent', { content_name: 'Homepage' })
  fbq('track', 'PageView')
}

export const signupPageButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'SignupButtonClick' })
}

export const signupPageSocialButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'SocialSignupButtonClick' })
}

export const signupPageEmailButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'EmailSignupButtonClick' })
}

export const accountCreated = () => {
  // Should match v4:
  // https://github.com/gladly-team/tab-web/pull/302
  fbq('track', 'CompleteRegistration', { content_name: 'AccountCreated' })
  rdt('track', 'SignUp')
  gtag('event', 'sign_up')
}

// TODO: later
// export const emailVerified = () => {
//   // GA and fbq pageviews
//   fbq('track', 'PageView')
//   GA.pageview()
// }

export const newTabView = () => {
  // No Google Analytics because of rate limiting.
  fbq('track', 'PageView')
  fbq('track', 'ViewContent', { content_name: 'Newtab' })
}

export const searchForACauseAccountCreated = () => {
  try {
    fbq('track', 'CompleteRegistration', {
      content_name: 'SearchAccountCreated',
    })
    rdt('track', 'Search')

    // A note about Quora, in case we reimplement its pixel in the future:
    // It can cause fatal errors when paired with react-snap pre-rendering:
    // "Quora Pixel Error: Base pixel code is not installed properly."
    // Be cautious about implementing it on the Search app.
  } catch (e) {
    logger.error(e)
  }
}
