/* eslint-env jest */

jest.mock('js/analytics/facebook-analytics')

const logEventMock = jest.genMockFromModule('../logEvent')
module.exports = logEventMock
