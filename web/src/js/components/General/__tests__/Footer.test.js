/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Link from 'js/components/General/Link'
import Logo from 'js/components/Logo/Logo'
import {
  adblockerWhitelistingForSearchURL,
  externalContactUsURL,
  financialsURL,
  privacyPolicyURL,
  searchHomeURL,
  searchExternalHelpURL,
  termsOfServiceURL,
} from 'js/navigation/navigation'

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

  it('links to the search homepage from the logo', () => {
    const Footer = require('../Footer').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Footer {...mockProps} />).dive()
    const logoParent = wrapper.find(Logo).parent()
    expect(logoParent.type()).toEqual(Link)
    expect(logoParent.prop('to')).toEqual(searchHomeURL)
  })

  it('contains a link to our help center', () => {
    const Footer = require('../Footer').default
    const { FooterLink } = require('../Footer')
    const mockProps = getMockProps()
    const wrapper = shallow(<Footer {...mockProps} />).dive()
    const linkElem = wrapper
      .find(FooterLink)
      .filterWhere(e => e.prop('children') === 'Help')
    expect(linkElem.exists()).toBe(true)
    expect(linkElem.prop('to')).toEqual(searchExternalHelpURL)
  })

  it('contains a link to the search adblocker whitelisting page', () => {
    const Footer = require('../Footer').default
    const { FooterLink } = require('../Footer')
    const mockProps = getMockProps()
    const wrapper = shallow(<Footer {...mockProps} />).dive()
    const linkElem = wrapper
      .find(FooterLink)
      .filterWhere(e => e.prop('children') === 'Adblockers')
    expect(linkElem.exists()).toBe(true)
    expect(linkElem.prop('to')).toEqual(adblockerWhitelistingForSearchURL)
  })

  it('contains a link to the financials page', () => {
    const Footer = require('../Footer').default
    const { FooterLink } = require('../Footer')
    const mockProps = getMockProps()
    const wrapper = shallow(<Footer {...mockProps} />).dive()
    const linkElem = wrapper
      .find(FooterLink)
      .filterWhere(e => e.prop('children') === 'Financials')
    expect(linkElem.exists()).toBe(true)
    expect(linkElem.prop('to')).toEqual(financialsURL)
  })

  it('contains a link to the terms page', () => {
    const Footer = require('../Footer').default
    const { FooterLink } = require('../Footer')
    const mockProps = getMockProps()
    const wrapper = shallow(<Footer {...mockProps} />).dive()
    const linkElem = wrapper
      .find(FooterLink)
      .filterWhere(e => e.prop('children') === 'Terms')
    expect(linkElem.exists()).toBe(true)
    expect(linkElem.prop('to')).toEqual(termsOfServiceURL)
  })

  it('contains a link to the privacy policy page', () => {
    const Footer = require('../Footer').default
    const { FooterLink } = require('../Footer')
    const mockProps = getMockProps()
    const wrapper = shallow(<Footer {...mockProps} />).dive()
    const linkElem = wrapper
      .find(FooterLink)
      .filterWhere(e => e.prop('children') === 'Privacy')
    expect(linkElem.exists()).toBe(true)
    expect(linkElem.prop('to')).toEqual(privacyPolicyURL)
  })

  it('contains a link to the contact page', () => {
    const Footer = require('../Footer').default
    const { FooterLink } = require('../Footer')
    const mockProps = getMockProps()
    const wrapper = shallow(<Footer {...mockProps} />).dive()
    const linkElem = wrapper
      .find(FooterLink)
      .filterWhere(e => e.prop('children') === 'Contact')
    expect(linkElem.exists()).toBe(true)
    expect(linkElem.prop('to')).toEqual(externalContactUsURL)
  })
})
