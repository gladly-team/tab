/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Link as LinkReactRouter } from 'react-router-dom'
import { isURLForDifferentApp } from 'js/navigation/utils'

jest.mock('react-router-dom')
jest.mock('js/navigation/utils')

beforeEach(() => {
  isURLForDifferentApp.mockReturnValue(false)
})

afterEach(() => {
  isURLForDifferentApp.mockReset()
})

describe('Link', () => {
  it('renders without error', () => {
    const Link = require('../Link').default
    shallow(<Link to={'/'} />)
  })

  it('uses react-router-dom Link component when navigating to a URL within the current single-page app', () => {
    const Link = require('../Link').default
    isURLForDifferentApp.mockReturnValue(false)
    const wrapper = shallow(<Link to={'/some/path/'} />)
    expect(wrapper.find(LinkReactRouter).exists()).toBe(true)
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('uses an anchor elem when navigating to a URL outside of the current single-page app', () => {
    const Link = require('../Link').default
    isURLForDifferentApp.mockReturnValue(true) // external URL
    const wrapper = shallow(<Link to={'/some/path/'} />)
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find(LinkReactRouter).exists()).toBe(false)
  })

  it('uses an anchor elem when navigating to an absolute URL', () => {
    const Link = require('../Link').default

    // An "internal" URL, but we'll still render an anchor element
    // because of the absolute URL.
    isURLForDifferentApp.mockReturnValue(false)

    const wrapper = shallow(<Link to={'https://example.com/some/path/'} />)
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find(LinkReactRouter).exists()).toBe(false)
  })

  it('passes style prop to the react-router-dom Link component and defaults to textDecoration = "none"', () => {
    const Link = require('../Link').default
    isURLForDifferentApp.mockReturnValue(false)
    const someStyle = { fontSize: 12, color: '#cdcdcd', textDecoration: 'none' }
    const wrapper = shallow(
      <Link to={'/'} style={someStyle} hoverStyle={{ color: 'red' }} />
    )
    expect(wrapper.find(LinkReactRouter).props().style).toEqual(someStyle)
  })

  it('passes other props to the react-router-dom Link component', () => {
    const Link = require('../Link').default
    isURLForDifferentApp.mockReturnValue(false)
    const wrapper = shallow(<Link to={'/some/path/'} rel={'noopener'} />)
    expect(wrapper.find(LinkReactRouter).props().rel).toEqual('noopener')
  })

  it('passes style prop to anchor elem and defaults to textDecoration = "none"', () => {
    const Link = require('../Link').default
    isURLForDifferentApp.mockReturnValue(true) // external URL
    const someStyle = { fontSize: 12, color: '#cdcdcd', textDecoration: 'none' }
    const wrapper = shallow(
      <Link
        to={'https://tab.gladly.io/'}
        style={someStyle}
        hoverStyle={{ color: 'red' }}
      />
    )
    expect(wrapper.find('a').props().style).toEqual(someStyle)
  })

  it('passes other props to the anchor elem', () => {
    const Link = require('../Link').default
    isURLForDifferentApp.mockReturnValue(true) // external URL
    const wrapper = shallow(
      <Link to={'https://tab.gladly.io/'} rel={'noopener'} />
    )
    expect(wrapper.find('a').props().rel).toEqual('noopener')
  })
})
