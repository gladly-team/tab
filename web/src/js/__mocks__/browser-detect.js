/* eslint-env jest */

// https://www.npmjs.com/package/browser-detect
const detectBrowser = jest.fn(() => ({
  name: 'chrome',
  version: '58.0.3029',
  versionNumber: 58.03029,
  mobile: false,
  os: 'Windows NT 10.0',
}))

export default detectBrowser
