/* eslint-env jest */

const webUtilsMock = jest.genMockFromModule('js/utils/utils')

webUtilsMock.isInIframe = jest.fn(() => false)
webUtilsMock.getUrlParameters = jest.fn(() => {
  return {}
})
webUtilsMock.parseUrlSearchString = jest.requireActual(
  'js/utils/utils'
).parseUrlSearchString
module.exports = webUtilsMock
