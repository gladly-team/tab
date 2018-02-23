/* eslint-env jest */

jest.mock('../facebook-analytics')
jest.mock('../google-analytics')

const logEventMock = jest.genMockFromModule('../logEvent')
module.exports = logEventMock
