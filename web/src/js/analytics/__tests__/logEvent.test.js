/* eslint-env jest */

import fbq from '../facebook-analytics'
import GA from '../google-analytics'

jest.mock('../facebook-analytics')
jest.mock('../google-analytics')

afterEach(() => {
  jest.clearAllMocks()
})

describe('logEvent', () => {
  test('pageview event calls analytics as expected', () => {
    const pageview = require('../logEvent').pageview
    pageview()

    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
    expect(GA.pageview).toHaveBeenCalled()
  })

  test('homepage view event calls analytics as expected', () => {
    const homepageView = require('../logEvent').homepageView
    homepageView()

    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', {content_name: 'Homepage'})
    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
    expect(GA.pageview).toHaveBeenCalled()
  })

  test('signup page button click event calls analytics as expected', () => {
    const signupPageButtonClick = require('../logEvent').signupPageButtonClick
    signupPageButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {content_name: 'SignupButtonClick'})
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'SignupButtonClick'
    })
  })

  test('signup page social button click event calls analytics as expected', () => {
    const signupPageSocialButtonClick = require('../logEvent').signupPageSocialButtonClick
    signupPageSocialButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {content_name: 'SocialSignupButtonClick'})
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'SocialSignupButtonClick'
    })
  })

  test('signup page email button click event calls analytics as expected', () => {
    const signupPageEmailButtonClick = require('../logEvent').signupPageEmailButtonClick
    signupPageEmailButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {content_name: 'EmailSignupButtonClick'})
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'EmailSignupButtonClick'
    })
  })

  test('account created event calls analytics as expected', () => {
    const accountCreated = require('../logEvent').accountCreated
    accountCreated()

    expect(fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', {content_name: 'AccountCreated'})
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'AccountCreation'
    })
  })

  test('new tab view event calls analytics as expected', () => {
    const newTabView = require('../logEvent').newTabView
    newTabView()

    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', {content_name: 'Newtab'})
    expect(GA.event).not.toHaveBeenCalledWith()
    expect(GA.pageview).not.toHaveBeenCalledWith()
  })
})
