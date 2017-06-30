/* eslint-env jest */

import 'utils/jsdom-shims'
import React from 'react'
import { findDOMNode } from 'react-dom'
import { mount, shallow } from 'enzyme'
import Ad from '../Ad'
import AdClient from 'ads/AdClient'

jest.mock('ads/AdClient')
jest.mock('ads/activeAdClient')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Ad component', function () {
  it('render a child with the provided ID', function () {
    const wrapper = shallow(
      <Ad
        adId='abc123'
        adSlotId='def'
        width={300}
        height={250} />
    )
    expect(wrapper.contains(<div id='abc123' />)).toBe(true)
  })

  it('calls to define the ad on mount', function () {
    const wrapper = shallow(
      <Ad
        adId='my-ad-987'
        adSlotId='slot-xyz'
        width={400}
        height={350} />
    )
    expect(AdClient.defineAdSlot).not.toHaveBeenCalled()
    wrapper.instance().componentDidMount()
    expect(AdClient.defineAdSlot).toHaveBeenCalledTimes(1)
    expect(AdClient.defineAdSlot).toHaveBeenCalledWith(
        'slot-xyz', [400, 350], 'my-ad-987')
  })

  it('calls to display ad on mount', function () {
    const wrapper = shallow(
      <Ad
        adId='my-ad-123'
        adSlotId='def'
        width={300}
        height={250} />
    )
    expect(AdClient.displayAd).not.toHaveBeenCalled()
    wrapper.instance().componentDidMount()
    expect(AdClient.displayAd).toHaveBeenCalledTimes(1)
    expect(AdClient.displayAd).toHaveBeenCalledWith('my-ad-123')
  })

  it('renders width and height correctly', function () {
    const wrapper = mount(
      <Ad
        adId='abc123'
        adSlotId='def'
        width={300}
        height={250} />
    )
    const elem = findDOMNode(wrapper.getNode())
    expect(elem.offsetWidth).toBe(300)
    expect(elem.offsetHeight).toBe(250)
  })

  it('renders width and height correctly again', function () {
    const wrapper = mount(
      <Ad
        adId='abc123'
        adSlotId='def'
        width={432}
        height={99} />
    )
    const elem = findDOMNode(wrapper.getNode())
    expect(elem.offsetWidth).toBe(432)
    expect(elem.offsetHeight).toBe(99)
  })

  it('assigns styles', function () {
    const wrapper = mount(
      <Ad
        adId='abc123'
        adSlotId='def'
        width={300}
        height={250}
        style={{
          display: 'inline',
          color: 'green'
        }} />
    )
    const elem = findDOMNode(wrapper.getNode())
    const elemStyle = window.getComputedStyle(elem)
    expect(elemStyle.display).toBe('inline')
    expect(elemStyle.color).toBe('green')
  })
})
