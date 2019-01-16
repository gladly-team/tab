/* eslint-env jest */

jest.mock('react-ga')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('google-analytics tests', () => {
  test('initializes on module load', () => {
    const ReactGA = require('react-ga').default
    require('js/analytics/google-analytics').default // eslint-disable-line no-unused-expressions
    expect(ReactGA.initialize).toHaveBeenCalledWith('UA-24159386-1')
  })

  test('does not throw error if ReactGA fails to initialize', () => {
    const ReactGA = require('react-ga').default
    ReactGA.initialize.mockImplementationOnce(() => {
      throw new Error('Bad stuff!')
    })

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    require('js/analytics/google-analytics').default // eslint-disable-line no-unused-expressions
  })

  test('does not throw error if ReactGA.pageview throws an error', () => {
    const ReactGA = require('react-ga').default
    ReactGA.pageview.mockImplementationOnce(() => {
      throw new Error('Bad pageview stuff!')
    })

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    const GA = require('js/analytics/google-analytics').default
    GA.pageview()
  })

  test('does not throw error if ReactGA.event throws an error', () => {
    const ReactGA = require('react-ga').default
    ReactGA.event.mockImplementationOnce(() => {
      throw new Error('Bad event stuff!')
    })

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    const GA = require('js/analytics/google-analytics').default
    GA.event()
  })

  test('does not throw error if ReactGA.ga throws an error', () => {
    const ReactGA = require('react-ga').default
    ReactGA.ga.mockImplementationOnce(() => {
      throw new Error('GA problem!')
    })

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    const GA = require('js/analytics/google-analytics').default
    GA.ga()
  })

  test('a pageview calls ReactGA as expected', () => {
    const ReactGA = require('react-ga').default

    const GA = require('js/analytics/google-analytics').default
    GA.pageview()

    expect(ReactGA.pageview).toHaveBeenCalled()
  })

  test('an event calls ReactGA as expected', () => {
    const ReactGA = require('react-ga').default

    const GA = require('js/analytics/google-analytics').default
    GA.event({
      foo: 'bar',
    })

    expect(ReactGA.event).toHaveBeenCalledWith({
      foo: 'bar',
    })
  })

  test('it calls ReactGA.ga as expected', () => {
    const ReactGA = require('react-ga').default

    const GA = require('js/analytics/google-analytics').default
    GA.ga('send', {
      hitType: 'event',
      eventCategory: 'Something',
      eventAction: 'SomethingHappened',
    })

    expect(ReactGA.ga).toHaveBeenCalledWith('send', {
      hitType: 'event',
      eventCategory: 'Something',
      eventAction: 'SomethingHappened',
    })
  })
})
