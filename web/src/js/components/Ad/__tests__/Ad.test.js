/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Ad from '../Ad'
import AdClient from 'ads/AdClient'

jest.mock('ads/AdClient')
jest.mock('ads/activeAdClient')

describe('Ad component', function () {
  it('should render without throwing an error', function () {
    const wrapper = shallow(
      <Ad
        adId='abc123'
        adSlotId='def'
        width={300}
        height={250} />
    )
    expect(wrapper.contains(<div id='abc123' />)).toBe(true)
  })

  it('calls to display ad on mount', function () {
    const wrapper = shallow(
      <Ad
        adId='abc123'
        adSlotId='def'
        width={300}
        height={250} />
    )
    expect(AdClient.displayAd).not.toHaveBeenCalled()
    wrapper.instance().componentDidMount()
    expect(AdClient.displayAd).toHaveBeenCalledTimes(1)
  })
})
