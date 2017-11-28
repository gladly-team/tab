
import fbq from './facebook-analytics'
import GA from './google-analytics'

export const pageview = () => {
  console.log('GA.pageview', GA.pageview)
  // GA and fbq pageviews
  fbq('track', 'PageView')
  GA.pageview()
}

export const homepageView = () => {
  // Special event for Facebook.
  fbq('track', 'ViewContent', {content_name: 'Homepage'})

  // GA pageview
  GA.pageview()
}

export const signupPageView = () => {
  // GA and fbq pageviews
  fbq('track', 'PageView')
  GA.pageview()
}

export const signupPageSocialButtonClick = () => {
  fbq('track', 'Lead', {content_name: 'SocialSignupButtonClick'})

  GA.event({
    category: 'ButtonClick',
    action: 'SocialSignupButtonClick'
  })
}

export const signupPageEmailButtonClick = () => {
  fbq('track', 'Lead', {content_name: 'EmailSignupButtonClick'})

  GA.event({
    category: 'ButtonClick',
    action: 'EmailSignupButtonClick'
  })
}

export const accountCreated = () => {
  fbq('track', 'CompleteRegistration', {content_name: 'AccountCreated'})
  GA.event({
    category: 'ButtonClick',
    action: 'AccountCreation'
  })
}

export const emailVerified = () => {
  // GA and fbq pageviews
  fbq('track', 'PageView')
  GA.pageview()
}

export const newTabView = () => {
  // No Google Analytics because of rate limiting.
  // fbq pageview
  fbq('track', 'PageView')
  fbq('track', 'ViewContent', {content_name: 'Newtab'})
}
