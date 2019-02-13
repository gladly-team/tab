/* eslint-env jest */

import fbq from 'js/analytics/facebook-analytics'
import GA from 'js/analytics/google-analytics'
import rdt from 'js/analytics/reddit-analytics'

jest.mock('js/analytics/facebook-analytics')
jest.mock('js/analytics/google-analytics')
jest.mock('js/analytics/reddit-analytics')

beforeAll(() => {
  window.gtag = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('logEvent', () => {
  test('pageview event calls analytics as expected', () => {
    const pageview = require('js/analytics/logEvent').pageview
    pageview()

    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
    expect(GA.pageview).toHaveBeenCalled()
  })

  test('homepage view event calls analytics as expected', () => {
    const homepageView = require('js/analytics/logEvent').homepageView
    homepageView()

    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', {
      content_name: 'Homepage',
    })
    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
    expect(GA.pageview).toHaveBeenCalled()
  })

  test('signup page button click event calls analytics as expected', () => {
    const signupPageButtonClick = require('js/analytics/logEvent')
      .signupPageButtonClick
    signupPageButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {
      content_name: 'SignupButtonClick',
    })
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'SignupButtonClick',
    })
  })

  test('signup page social button click event calls analytics as expected', () => {
    const signupPageSocialButtonClick = require('js/analytics/logEvent')
      .signupPageSocialButtonClick
    signupPageSocialButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {
      content_name: 'SocialSignupButtonClick',
    })
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'SocialSignupButtonClick',
    })
  })

  test('signup page email button click event calls analytics as expected', () => {
    const signupPageEmailButtonClick = require('js/analytics/logEvent')
      .signupPageEmailButtonClick
    signupPageEmailButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {
      content_name: 'EmailSignupButtonClick',
    })
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'EmailSignupButtonClick',
    })
  })

  test('account created event calls analytics as expected', () => {
    const accountCreated = require('js/analytics/logEvent').accountCreated
    accountCreated()

    expect(fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', {
      content_name: 'AccountCreated',
    })
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'AccountCreation',
    })
    expect(rdt).toHaveBeenCalledWith('track', 'SignUp')
    expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-1013744060/v2M_COqV6owBELyDsuMD',
    })
  })

  test('a search event calls analytics as expected', async () => {
    expect.assertions(3)

    const searchExecuted = require('js/analytics/logEvent').searchExecuted
    searchExecuted()

    expect(fbq).not.toHaveBeenCalled()
    expect(rdt).not.toHaveBeenCalled()
    expect(GA.ga).toHaveBeenCalledWith('send', {
      hitType: 'event',
      eventCategory: 'Search',
      eventAction: 'SearchExecuted',
      hitCallback: expect.any(Function),
    })
  })

  test('new tab view event calls analytics as expected', () => {
    const newTabView = require('js/analytics/logEvent').newTabView
    newTabView()

    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', {
      content_name: 'Newtab',
    })
    expect(GA.event).not.toHaveBeenCalledWith()
    expect(GA.pageview).not.toHaveBeenCalledWith()
  })
})
