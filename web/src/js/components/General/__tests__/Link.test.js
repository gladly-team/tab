/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Link as LinkReactRouter } from 'react-router'

describe('Link', () => {
  it('renders without error', () => {
    const Link = require('../Link').default
    shallow(<Link to={'/'} />)
  })

  it('uses react-router Link component when navigating to a relative URL', () => {
    const Link = require('../Link').default
    const testUrls = ['/', '/some-url/here/', '/123/', '/thing']
    testUrls.forEach(testUrl => {
      const wrapper = shallow(<Link to={testUrl} />)
      expect(wrapper.find(LinkReactRouter).length).toBe(1)
    })
  })

  it('uses anchor elem when navigating to an absolute URL', () => {
    const Link = require('../Link').default
    const testUrls = [
      'https://tab.gladly.io/',
      'localhost:3000/some-url/here/',
      'https://gladly.io'
    ]
    testUrls.forEach(testUrl => {
      const wrapper = shallow(<Link to={testUrl} />)
      expect(wrapper.find('a').length).toBe(1)
    })
  })

  it('passes style prop to the react-router Link component', () => {
    const Link = require('../Link').default
    const someStyle = { fontSize: 12, color: '#cdcdcd' }
    const wrapper = shallow(
      <Link to={'/'} style={someStyle} hoverStyle={{ color: 'red' }} />
    )
    expect(wrapper.find(LinkReactRouter).props().style).toEqual(someStyle)
  })

  it('passes style prop to anchor elem', () => {
    const Link = require('../Link').default
    const someStyle = { fontSize: 12, color: '#cdcdcd' }
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
    const wrapper = shallow(
      <Link
        to={'https://tab.gladly.io/'}
        rel={'noopener'}
      />
    )
    expect(wrapper.find('a').props().rel).toEqual('noopener')
  })
})
