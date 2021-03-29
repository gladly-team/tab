/* eslint-env jest */

import fbq from 'js/analytics/facebook-analytics'
import rdt from 'js/analytics/reddit-analytics'
import logger from 'js/utils/logger'

jest.mock('js/analytics/facebook-analytics')
jest.mock('js/analytics/reddit-analytics')
jest.mock('js/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
})

describe('logEvent', () => {
  test('pageview event calls analytics as expected', () => {
    const pageview = require('js/analytics/logEvent').pageview
    pageview()

    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
  })

  test('homepage view event calls analytics as expected', () => {
    const homepageView = require('js/analytics/logEvent').homepageView
    homepageView()

    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', {
      content_name: 'Homepage',
    })
    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
  })

  test('signup page button click event calls analytics as expected', () => {
    const signupPageButtonClick = require('js/analytics/logEvent')
      .signupPageButtonClick
    signupPageButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {
      content_name: 'SignupButtonClick',
    })
  })

  test('signup page social button click event calls analytics as expected', () => {
    const signupPageSocialButtonClick = require('js/analytics/logEvent')
      .signupPageSocialButtonClick
    signupPageSocialButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {
      content_name: 'SocialSignupButtonClick',
    })
  })

  test('signup page email button click event calls analytics as expected', () => {
    const signupPageEmailButtonClick = require('js/analytics/logEvent')
      .signupPageEmailButtonClick
    signupPageEmailButtonClick()

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {
      content_name: 'EmailSignupButtonClick',
    })
  })

  test('account created event calls analytics as expected', () => {
    const accountCreated = require('js/analytics/logEvent').accountCreated
    accountCreated()

    expect(fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', {
      content_name: 'AccountCreated',
    })
    expect(rdt).toHaveBeenCalledWith('track', 'SignUp')
  })

  test('new tab view event calls analytics as expected', () => {
    const newTabView = require('js/analytics/logEvent').newTabView
    newTabView()

    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', {
      content_name: 'Newtab',
    })
  })

  test('Search for a Cause account created event calls analytics as expected', () => {
    const { searchForACauseAccountCreated } = require('js/analytics/logEvent')
    searchForACauseAccountCreated()

    expect(fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', {
      content_name: 'SearchAccountCreated',
    })
    expect(rdt).toHaveBeenCalledWith('track', 'Search')
  })

  test('Search for a Cause account created event does not throw when analytics libraries throw and instead logs an error', () => {
    const mockErr = new Error(':o')
    fbq.mockImplementationOnce(() => {
      throw mockErr
    })
    const { searchForACauseAccountCreated } = require('js/analytics/logEvent')
    expect(() => {
      searchForACauseAccountCreated()
    }).not.toThrow()
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})
