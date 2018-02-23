/* eslint-env jest */

const ReactGA = jest.genMockFromModule('react-ga')
ReactGA.initialize = jest.fn()
module.exports = ReactGA
