/* eslint-env jest */
import React from 'react'

const mockTabAds = jest.genMockFromModule('tab-ads')
mockTabAds.AdComponent = () => <div data-test-note="mock-ad-component" />

module.exports = mockTabAds
