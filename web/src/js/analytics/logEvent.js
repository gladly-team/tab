import fbq from 'js/analytics/facebook-analytics'
import GA from 'js/analytics/google-analytics'
import { redditAccountCreationEvent } from 'js/analytics/reddit-analytics'

// We automatically track most pageviews on location change.
// See ./withPageviewTracking higher-order component.
export const pageview = () => {
  // GA and fbq pageviews
  fbq('track', 'PageView')
  GA.pageview()
}

export const homepageView = () => {
  fbq('track', 'ViewContent', { content_name: 'Homepage' })
  fbq('track', 'PageView')

  // GA pageview
  GA.pageview()
}

export const signupPageButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'SignupButtonClick' })

  GA.event({
    category: 'ButtonClick',
    action: 'SignupButtonClick',
  })
}

export const signupPageSocialButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'SocialSignupButtonClick' })

  GA.event({
    category: 'ButtonClick',
    action: 'SocialSignupButtonClick',
  })
}

export const signupPageEmailButtonClick = () => {
  fbq('track', 'Lead', { content_name: 'EmailSignupButtonClick' })

  GA.event({
    category: 'ButtonClick',
    action: 'EmailSignupButtonClick',
  })
}

export const accountCreated = () => {
  fbq('track', 'CompleteRegistration', { content_name: 'AccountCreated' })
  GA.event({
    category: 'ButtonClick',
    action: 'AccountCreation',
  })
  redditAccountCreationEvent()

  // Google Ads conversion tracking.
  window.gtag('event', 'conversion', {
    send_to: 'AW-1013744060/v2M_COqV6owBELyDsuMD',
  })
}

export const searchExecuted = () => {
  // Need to wait for events to fire before navigating
  // away from the page.
  // https://support.google.com/analytics/answer/1136920?hl=en
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#hitCallback
  return new Promise(resolve => {
    // Using the original ga object because hitCallback isn't
    // implemented in react-ga for events:
    // https://github.com/react-ga/react-ga#reactgaga
    GA.ga('send', {
      hitType: 'event',
      eventCategory: 'Search',
      eventAction: 'SearchExecuted',
      hitCallback: resolve,
    })

    // In case GA fails to call the callback within a
    // reasonable amount of time, continue so we don't
    // interrupt the search.
    setTimeout(() => {
      resolve()
    }, 200)
  })
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
