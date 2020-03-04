/* eslint-env jest */
import React from 'react'

const mockTabAds = jest.genMockFromModule('tab-ads')
mockTabAds.AdComponent = () => <div data-test-note="mock-ad-component" />

mockTabAds.getAvailableAdUnits = jest.fn(() => ({
  leaderboard: {
    // The long leaderboard ad.
    adId: 'div-gpt-ad-1464385677836-0',
    adUnitId: '/43865596/HBTL',
    sizes: [[728, 90]],
  },
  rectangleAdPrimary: {
    // The primary rectangle ad (bottom-right).
    adId: 'div-gpt-ad-1464385742501-0',
    adUnitId: '/43865596/HBTR',
    sizes: [[300, 250]],
  },
  rectangleAdSecondary: {
    // The second rectangle ad (right side, above the first).
    adId: 'div-gpt-ad-1539903223131-0',
    adUnitId: '/43865596/HBTR2',
    sizes: [[300, 250]],
  },
}))

module.exports = mockTabAds
