/* eslint-env jest */

const navigationUtilsMock = jest.genMockFromModule('js/navigation/utils')
const actualModule = jest.requireActual('js/navigation/utils')

navigationUtilsMock.isAbsoluteURL = actualModule.isAbsoluteURL
module.exports = navigationUtilsMock
