/* eslint-env jest */

jest.mock('js/analytics/facebook-analytics')
jest.mock('js/analytics/google-analytics')

const logEventMock = jest.genMockFromModule('../logEvent')
module.exports = logEventMock
