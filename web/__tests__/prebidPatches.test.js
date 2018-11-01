/* eslint-env jest */

const prebidPath = './node_modules/prebid.js'

describe('Prebid.js patch test', () => {
  test('getRefererInfo returns expected values', () => {
    const { getRefererInfo } = require(`${prebidPath}/src/refererDetection`)
    expect(getRefererInfo()).toEqual({})
  })
})
