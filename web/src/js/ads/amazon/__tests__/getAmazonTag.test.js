/* eslint-env jest */

import getAmazonTag from 'js/ads/amazon/getAmazonTag'

afterEach(() => {
  delete window.apstag
})

describe('getAmazonTag', function () {
  it('uses existing window.apstag object if one exists', () => {
    // Set a fake existing googletag
    const fakeExistingAmazonTag = {
      something: {}
    }
    window.apstag = fakeExistingAmazonTag

    const amazonTag = getAmazonTag()
    expect(amazonTag).toBe(fakeExistingAmazonTag)
  })

  it('returns undefined if window.apstag is not set', () => {
    const amazonTag = getAmazonTag()
    expect(amazonTag).toBeUndefined()
  })
})
