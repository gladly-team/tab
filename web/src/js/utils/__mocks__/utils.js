/* eslint-env jest */

const webUtilsMock = jest.genMockFromModule('js/utils/utils')
const actualWebUtils = jest.requireActual('js/utils/utils')

webUtilsMock.isInIframe = jest.fn(() => false)
webUtilsMock.getUrlParameters = jest.fn(() => {
  return {}
})
webUtilsMock.parseUrlSearchString = actualWebUtils.parseUrlSearchString
webUtilsMock.validateAppName = actualWebUtils.validateAppName
module.exports = webUtilsMock
