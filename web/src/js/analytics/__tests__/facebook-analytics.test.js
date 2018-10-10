/* eslint-env jest */

beforeAll(() => {
  window.fbq = jest.fn()
})

afterAll(() => {
  delete window.fbq
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('facebook-analytics tests', () => {
  test('calls FB analytics library as expected', () => {
    const fbAnalytics = require('js/analytics/facebook-analytics').default
    fbAnalytics('some', 'event', {my: 'data'})
    expect(window.fbq).toHaveBeenCalledWith('some', 'event', {my: 'data'})
  })

  test('a FB analytics error is caught', () => {
    window.fbq.mockImplementationOnce(() => {
      throw new Error('FB analytics oopsie')
    })
    const fbAnalytics = require('js/analytics/facebook-analytics').default

    // Suppress an expected console error
    jest.spyOn(global.console, 'error')
      .mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    fbAnalytics('some', 'event')
  })
})
