/* eslint-env jest */

import 'js/utils/jsdom-shims'
import React from 'react'
import { findDOMNode } from 'react-dom'
import { mount, shallow } from 'enzyme'
import Ad from 'js/components/Ad/Ad'
import displayAd from 'js/ads/displayAd'

jest.mock('js/ads/displayAd')

afterEach(() => {
  jest.clearAllMocks()
})

function getMockProps () {
  return {
    adId: 'abc123',
    style: undefined,
    adWrapperStyle: undefined
  }
}

describe('Ad component', () => {
  it('render a child with the provided ID', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(
      <Ad {...mockProps} />
    )
    expect(wrapper.find('div#abc123').length).toBe(1)
  })

  it('calls to display ad on mount', () => {
    const mockProps = getMockProps()
    mockProps.adId = 'my-ad-123'
    const wrapper = shallow(
      <Ad {...mockProps} />,
      { disableLifecycleMethods: true }
    )
    expect(displayAd).not.toHaveBeenCalled()
    wrapper.instance().componentDidMount()
    expect(displayAd).toHaveBeenCalledTimes(1)
    expect(displayAd).toHaveBeenCalledWith('my-ad-123')
  })

  it('assigns styles', () => {
    const mockProps = getMockProps()
    mockProps.style = {
      display: 'inline',
      color: 'green'
    }
    const wrapper = mount(
      <Ad {...mockProps} />
    )
    const elem = findDOMNode(wrapper.instance())
    const elemStyle = window.getComputedStyle(elem)
    expect(elemStyle.display).toBe('inline')
    expect(elemStyle.color).toBe('green')
  })

  it('does not rerender after initial mount', done => {
    const mockProps = getMockProps()
    mockProps.style = {
      background: 'purple'
    }
    const wrapper = mount(
      <Ad {...mockProps} />
    )
    const elem = findDOMNode(wrapper.instance())
    wrapper.setProps({ style: { background: 'yellow' } }, () => {
      const elemStyle = window.getComputedStyle(elem)
      expect(elemStyle.background).toBe('purple')
      done()
    })
  })
})
