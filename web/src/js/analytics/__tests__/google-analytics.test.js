/* eslint-env jest */

beforeAll(() => {
  window.gtag = jest.fn()
})

afterAll(() => {
  delete window.gtag
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('google-analytics tests', () => {
  test('calls Google Analytics as expected', () => {
    const googleAnalytics = require('js/analytics/google-analytics').default
    googleAnalytics('some', 'event', { my: 'data' })
    expect(window.gtag).toHaveBeenCalledWith('some', 'event', { my: 'data' })
  })

  test('an error is caught', () => {
    window.gtag.mockImplementationOnce(() => {
      throw new Error('Whoops')
    })
    const googleAnalytics = require('js/analytics/google-analytics').default

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    googleAnalytics('some', 'event')
  })
})
