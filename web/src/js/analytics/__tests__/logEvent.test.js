/* eslint-env jest */

import fbq from 'js/analytics/facebook-analytics'
import GA from 'js/analytics/google-analytics'
import rdt from 'js/analytics/reddit-analytics'
import qp from 'js/analytics/quora-analytics'
import logger from 'js/utils/logger'

jest.mock('js/analytics/facebook-analytics')
jest.mock('js/analytics/google-analytics')
jest.mock('js/analytics/reddit-analytics')
jest.mock('js/analytics/quora-analytics')
jest.mock('js/utils/logger')

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
    expect(qp).toHaveBeenCalledWith('track', 'ViewContent')
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
    expect(qp).toHaveBeenCalledWith('track', 'CompleteRegistration')
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

  test('Search for a Cause account created event calls analytics as expected', () => {
    const { searchForACauseAccountCreated } = require('js/analytics/logEvent')
    searchForACauseAccountCreated()

    expect(fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', {
      content_name: 'SearchAccountCreated',
    })
    expect(GA.event).toHaveBeenCalledWith({
      category: 'ButtonClick',
      action: 'SearchAccountCreation',
    })
    expect(rdt).toHaveBeenCalledWith('track', 'Search')
    expect(qp).toHaveBeenCalledWith('track', 'Search')
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
