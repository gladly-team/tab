/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  color: 'purple',
})

describe('Logo component', () => {
  it('renders without error', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    shallow(<Logo {...mockProps} />)
  })

  it('has a default height of 40px', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.style = {}
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toMatchObject({
      height: 40,
    })
  })

  it('assigns style to the img element', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.style = {
      border: 'teal 2px dotted',
      background: '#ff0000',
    }
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toMatchObject({
      border: 'teal 2px dotted',
      background: '#ff0000',
    })
  })

  it('uses the correct file for color=purple', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.color = 'purple'
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo.svg')
  })

  it('uses the correct file for color=white', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.color = 'white'
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo-white.svg')
  })
})
