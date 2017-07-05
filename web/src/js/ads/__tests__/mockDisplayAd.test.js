/* eslint-env jest */

import mockDisplayAd from '../mockDisplayAd'

jest.useFakeTimers()

describe('mockDisplayAd', function () {
  it('runs without error', () => {
    mockDisplayAd()
    jest.runAllTimers()
  })
})
