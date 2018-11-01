/* eslint-env jest */

// We patch Prebid and Prebid adapters to make sure bid adapters
// pass the correct website domain when they load in the iframe
// within the browser new tab page. We use patch-package to
// modify the Node Prebid module code after it's installed.
// This file makes sure the patched Prebid code behaves as
// expected.

// Note that Prebid changed how adapters get the domain/referrer
// information from a utils function to the `refererInfo` object
// in the bidderRequest object:
// https://github.com/prebid/Prebid.js/issues/3072
// https://github.com/prebid/Prebid.js/pull/3067/files

// The Prebid code uses imports relative to its root, so our
// NODE_ENV must include node_modules/prebid.js/ before running
// this test. We set it in our NPM script.

// We must also transform Prebid files (node_modules/prebid.js/)
// before testing. We include Prebid files in Jest transformation
// as described here:
// https://jestjs.io/docs/en/tutorial-react-native#transformignorepatterns-customization

import { JSDOM } from 'jsdom'

const prebidPath = '../node_modules/prebid.js'
const prebidSrcPath = `${prebidPath}/src`

const getPrebidSrcPath = filepath => `${prebidSrcPath}/${filepath}`

jest.mock(getPrebidSrcPath('cpmBucketManager'))
jest.mock(getPrebidSrcPath('utils'))

const getMockWindow = () => {
  const mockWindow = Object.create(new JSDOM())

  // Create window object we'd expect in our iframed new tab page.
  // https://github.com/facebook/jest/issues/5124#issuecomment-415494099
  mockWindow.location = Object.assign({}, mockWindow.location, {
    ancestorOrigins: [
      'chrome-extension://abcdefghijklmnopqrs'
    ],
    host: 'tab.gladly.io',
    hostname: 'tab.gladly.io',
    href: 'https://tab.gladly.io/newtab/',
    origin: 'https://tab.gladly.io',
    pathname: '/newtab/',
    port: '',
    protocol: 'https:',
    search: ''
  })
  global.window = mockWindow
  return mockWindow
}

describe('Prebid.js patch test', () => {
  test('getRefererInfo returns expected values', () => {
    const mockWindow = getMockWindow()
    const { getRefererInfo } = require(getPrebidSrcPath('refererDetection'))

    // FIXME: our website domain should be the referer.
    expect(getRefererInfo(mockWindow)).toEqual({
      numIframes: 1,
      reachedTop: false,
      referer: 'chrome-extension://abcdefghijklmnopqrs',
      stack: [
        'chrome-extension://abcdefghijklmnopqrs',
        null
      ]
    })
  })
})
