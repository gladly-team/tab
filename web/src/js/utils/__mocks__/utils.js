/* eslint-env jest */

const webUtilsMock = jest.genMockFromModule('../utils')

webUtilsMock.isInIframe = jest.fn(() => false)
webUtilsMock.getUrlParameters = jest.fn(() => {
  return {}
})
webUtilsMock.parseUrlSearchString = jest.fn(() => {
  return {}
})
module.exports = webUtilsMock
