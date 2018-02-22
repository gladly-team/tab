/* eslint-env jest */

const webUtilsMock = jest.genMockFromModule('../utils')

webUtilsMock.isInIframe = jest.fn(() => false)
module.exports = webUtilsMock
