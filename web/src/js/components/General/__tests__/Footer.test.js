/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Link from 'js/components/General/Link'
import Logo from 'js/components/Logo/Logo'

jest.mock('js/components/General/Link')

const getMockPropsFooterLink = () => ({
  to: '/some/place/',
})

describe('FooterLink', () => {
  it('renders without error', () => {
    const { FooterLink } = require('../Footer')
    const mockProps = getMockPropsFooterLink()
    shallow(<FooterLink {...mockProps} />).dive()
  })

  it('returns a Link component', () => {
    const { FooterLink } = require('../Footer')
    const mockProps = getMockPropsFooterLink()
    const wrapper = shallow(<FooterLink {...mockProps} />).dive()
    expect(wrapper.at(0).type()).toEqual(Link)
  })

  it('passes props on to the Link component', () => {
    const { FooterLink } = require('../Footer')
    const mockProps = getMockPropsFooterLink()
    const wrapper = shallow(<FooterLink {...mockProps} foo={'bar'} />).dive()
    expect(wrapper.find(Link).prop('foo')).toEqual('bar')
  })
})

const getMockProps = () => ({})

describe('Footer', () => {
  it('renders without error', () => {
    const Footer = require('../Footer').default
    const mockProps = getMockProps()
    shallow(<Footer {...mockProps} />).dive()
  })

  it('contains the grey search logo without text', () => {
    const Footer = require('../Footer').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Footer {...mockProps} />).dive()
    expect(wrapper.find(Logo).props()).toMatchObject({
      brand: 'search',
      color: 'grey',
      includeText: false,
      style: {
        width: 43,
        height: 43,
      },
    })
  })
})
