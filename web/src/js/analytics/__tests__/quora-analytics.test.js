/* eslint-env jest */

beforeAll(() => {
  window.qp = jest.fn()
})

afterAll(() => {
  delete window.qp
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('quora-analytics tests', () => {
  test('calls the Quora pixel JS as expected', () => {
    const quoraAnalytics = require('js/analytics/quora-analytics').default
    quoraAnalytics('some', 'event', { my: 'data' })
    expect(window.qp).toHaveBeenCalledWith('some', 'event', { my: 'data' })
  })

  test('a Quora JS error is caught', () => {
    window.qp.mockImplementationOnce(() => {
      throw new Error('Quora analytics oopsie')
    })
    const quoraAnalytics = require('js/analytics/quora-analytics').default

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    quoraAnalytics('some', 'event')
  })
})
