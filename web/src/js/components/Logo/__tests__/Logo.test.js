/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  brand: 'tab',
  color: 'purple',
  includeText: false,
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

  it('defaults to the purple "tab" logo', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    delete mockProps.brand
    delete mockProps.color
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo.svg')
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

  it('throws an error when passed an invalid color', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.color = 'orange'
    expect(() => {
      shallow(<Logo {...mockProps} />)
    }).toThrow('No "tab" logo exists with color "orange"')
  })

  it('uses the correct file for includeText=true', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.includeText = true
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo-with-text.svg')
  })

  it('[brand=search] uses the correct file', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.brand = 'search'
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('search-logo.svg')
  })

  it('[brand=search] uses the correct file for includeText=true', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.brand = 'search'
    mockProps.includeText = true
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('search-logo-with-text.svg')
  })

  it('throws an error when passed an invalid brand', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    mockProps.brand = 'coolApp'
    expect(() => {
      shallow(<Logo {...mockProps} />)
    }).toThrow('No logo exists for brand "coolApp".')
  })
})
