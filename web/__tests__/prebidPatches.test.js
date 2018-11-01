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

const prebidPath = '../node_modules/prebid.js'
const prebidSrcPath = `${prebidPath}/src`

const getPrebidSrcPath = filepath => `${prebidSrcPath}/${filepath}`

jest.mock(getPrebidSrcPath('cpmBucketManager'))
jest.mock(getPrebidSrcPath('utils'))

describe('Prebid.js patch test', () => {
  test('getRefererInfo returns expected values', () => {
    const { getRefererInfo } = require(getPrebidSrcPath('refererDetection'))

    // TODO
    expect(getRefererInfo(window)).toMatchObject({})
  })
})
