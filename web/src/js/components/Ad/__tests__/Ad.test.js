/* eslint-env jest */

import 'utils/jsdom-shims'
import React from 'react'
import { findDOMNode } from 'react-dom'
import { mount, shallow } from 'enzyme'
import Ad from '../Ad'
import displayAd from 'ads/displayAd'

jest.mock('ads/displayAd')

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

  it('calls to display ad on mount', function () {
    const wrapper = shallow(
      <Ad
        adId='my-ad-123'
        adSlotId='def'
        width={300}
        height={250} />
    )
    expect(displayAd).not.toHaveBeenCalled()
    wrapper.instance().componentDidMount()
    expect(displayAd).toHaveBeenCalledTimes(1)
    expect(displayAd).toHaveBeenCalledWith('my-ad-123')
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
